from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerRead
from app.services import customers as customer_service

router = APIRouter(prefix="/customers", tags=["customers"])


@router.post("", response_model=CustomerRead, status_code=status.HTTP_201_CREATED)
async def create_customer(
    payload: CustomerCreate,
    db: AsyncSession = Depends(get_db),
) -> Customer:
    return await customer_service.create_customer(db, payload)


@router.get("", response_model=list[CustomerRead])
async def list_customers(db: AsyncSession = Depends(get_db)) -> list[Customer]:
    return await customer_service.list_customers(db)


@router.get("/{customer_id}", response_model=CustomerRead)
async def get_customer(
    customer_id: int,
    db: AsyncSession = Depends(get_db),
) -> Customer:
    return await customer_service.get_customer(db, customer_id)


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_customer(
    customer_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    await customer_service.delete_customer(db, customer_id)
