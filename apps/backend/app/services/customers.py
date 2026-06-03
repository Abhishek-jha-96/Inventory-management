from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import conflict, not_found
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate


async def _email_exists(
    db: AsyncSession,
    email: str,
    *,
    exclude_customer_id: int | None = None,
) -> bool:
    query = select(Customer.id).where(Customer.email == email)
    if exclude_customer_id is not None:
        query = query.where(Customer.id != exclude_customer_id)
    result = await db.execute(query)
    return result.scalar_one_or_none() is not None


async def create_customer(db: AsyncSession, payload: CustomerCreate) -> Customer:
    if await _email_exists(db, str(payload.email)):
        raise conflict("EMAIL_ALREADY_EXISTS", "Customer email must be unique")

    customer = Customer(**payload.model_dump())
    db.add(customer)
    await db.commit()
    await db.refresh(customer)
    return customer


async def list_customers(db: AsyncSession) -> list[Customer]:
    result = await db.execute(select(Customer).order_by(Customer.id))
    return list(result.scalars().all())


async def get_customer(db: AsyncSession, customer_id: int) -> Customer:
    customer = await db.get(Customer, customer_id)
    if customer is None:
        raise not_found("Customer", customer_id)
    return customer


async def delete_customer(db: AsyncSession, customer_id: int) -> None:
    customer = await get_customer(db, customer_id)
    await db.delete(customer)
    await db.commit()
