from collections import defaultdict
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.errors import bad_request, not_found
from app.models.customer import Customer
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderLineCreate


def _aggregate_line_quantities(
    items: list[OrderLineCreate],
) -> dict[int, int]:
    quantities: dict[int, int] = defaultdict(int)
    for line in items:
        quantities[line.product_id] += line.quantity
    return dict(quantities)


async def _load_order(db: AsyncSession, order_id: int) -> Order | None:
    result = await db.execute(
        select(Order)
        .where(Order.id == order_id)
        .options(selectinload(Order.items)),
    )
    return result.scalar_one_or_none()


async def create_order(db: AsyncSession, payload: OrderCreate) -> Order:
    customer = await db.get(Customer, payload.customer_id)
    if customer is None:
        raise not_found("Customer", payload.customer_id)

    line_quantities = _aggregate_line_quantities(payload.items)
    product_ids = list(line_quantities.keys())

    result = await db.execute(
        select(Product)
        .where(Product.id.in_(product_ids))
        .with_for_update(),
    )
    products_by_id = {p.id: p for p in result.scalars().all()}

    if len(products_by_id) != len(product_ids):
        missing = set(product_ids) - set(products_by_id.keys())
        raise not_found("Product", next(iter(missing)))

    stock_errors: list[dict[str, str | int]] = []
    for product_id, quantity in line_quantities.items():
        product = products_by_id[product_id]
        if product.quantity_in_stock < quantity:
            stock_errors.append(
                {
                    "product_id": product.id,
                    "sku": product.sku,
                    "requested": quantity,
                    "available": product.quantity_in_stock,
                },
            )

    if stock_errors:
        raise bad_request(
            "INSUFFICIENT_INVENTORY",
            "Orders cannot be placed when inventory is insufficient",
            extra={"products": stock_errors},
        )

    total_amount = Decimal("0")
    order_items: list[OrderItem] = []

    for product_id, quantity in line_quantities.items():
        product = products_by_id[product_id]
        line_total = product.price * quantity
        total_amount += line_total
        product.quantity_in_stock -= quantity
        order_items.append(
            OrderItem(
                product_id=product.id,
                quantity=quantity,
                unit_price=product.price,
            ),
        )

    order = Order(
        customer_id=payload.customer_id,
        total_amount=total_amount,
        items=order_items,
    )
    db.add(order)
    await db.commit()

    loaded = await _load_order(db, order.id)
    assert loaded is not None
    return loaded


async def list_orders(db: AsyncSession) -> list[Order]:
    result = await db.execute(
        select(Order).options(selectinload(Order.items)).order_by(Order.id),
    )
    return list(result.scalars().all())


async def get_order(db: AsyncSession, order_id: int) -> Order:
    order = await _load_order(db, order_id)
    if order is None:
        raise not_found("Order", order_id)
    return order


async def delete_order(db: AsyncSession, order_id: int) -> None:
    order = await get_order(db, order_id)

    product_ids = [item.product_id for item in order.items]
    if product_ids:
        result = await db.execute(
            select(Product)
            .where(Product.id.in_(product_ids))
            .with_for_update(),
        )
        products_by_id = {p.id: p for p in result.scalars().all()}
        for item in order.items:
            product = products_by_id.get(item.product_id)
            if product is not None:
                product.quantity_in_stock += item.quantity

    await db.delete(order)
    await db.commit()
