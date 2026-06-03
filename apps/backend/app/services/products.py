from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import conflict, not_found
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


async def _sku_exists(
    db: AsyncSession,
    sku: str,
    *,
    exclude_product_id: int | None = None,
) -> bool:
    query = select(Product.id).where(Product.sku == sku)
    if exclude_product_id is not None:
        query = query.where(Product.id != exclude_product_id)
    result = await db.execute(query)
    return result.scalar_one_or_none() is not None


async def create_product(db: AsyncSession, payload: ProductCreate) -> Product:
    if await _sku_exists(db, payload.sku):
        raise conflict("SKU_ALREADY_EXISTS", "Product SKU/code must be unique")

    product = Product(**payload.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


async def list_products(db: AsyncSession) -> list[Product]:
    result = await db.execute(select(Product).order_by(Product.id))
    return list(result.scalars().all())


async def get_product(db: AsyncSession, product_id: int) -> Product:
    product = await db.get(Product, product_id)
    if product is None:
        raise not_found("Product", product_id)
    return product


async def update_product(
    db: AsyncSession,
    product_id: int,
    payload: ProductUpdate,
) -> Product:
    product = await get_product(db, product_id)
    updates = payload.model_dump(exclude_unset=True)

    if "sku" in updates and await _sku_exists(
        db,
        updates["sku"],
        exclude_product_id=product_id,
    ):
        raise conflict("SKU_ALREADY_EXISTS", "Product SKU/code must be unique")

    for field, value in updates.items():
        setattr(product, field, value)

    await db.commit()
    await db.refresh(product)
    return product


async def delete_product(db: AsyncSession, product_id: int) -> None:
    product = await get_product(db, product_id)
    await db.delete(product)
    await db.commit()
