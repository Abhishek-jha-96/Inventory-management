from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class OrderLineCreate(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0, description="Quantity ordered must be positive")


class OrderCreate(BaseModel):
    """Total amount is always computed by the backend; never accepted from clients."""

    model_config = ConfigDict(extra="forbid")

    customer_id: int = Field(gt=0)
    items: list[OrderLineCreate] = Field(min_length=1)

    @model_validator(mode="after")
    def validate_items(self) -> "OrderCreate":
        if not self.items:
            raise ValueError("Order must include at least one product line")
        return self


class OrderLineRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: int
    quantity: int
    unit_price: Decimal


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_id: int
    total_amount: Decimal
    items: list[OrderLineRead]
