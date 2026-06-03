from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderRead
from app.services import orders as order_service

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: OrderCreate,
    db: AsyncSession = Depends(get_db),
) -> Order:
    return await order_service.create_order(db, payload)


@router.get("", response_model=list[OrderRead])
async def list_orders(db: AsyncSession = Depends(get_db)) -> list[Order]:
    return await order_service.list_orders(db)


@router.get("/{order_id}", response_model=OrderRead)
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
) -> Order:
    return await order_service.get_order(db, order_id)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    await order_service.delete_order(db, order_id)
