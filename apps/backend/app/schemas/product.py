from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    sku: str = Field(min_length=1, max_length=64)
    price: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    quantity_in_stock: int = Field(ge=0, description="Cannot be negative")

    @field_validator("sku")
    @classmethod
    def normalize_sku(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("SKU/code cannot be empty")
        return normalized


class ProductCreate(ProductBase):
    model_config = ConfigDict(extra="forbid")


class ProductUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str | None = Field(default=None, min_length=1, max_length=255)
    sku: str | None = Field(default=None, min_length=1, max_length=64)
    price: Decimal | None = Field(
        default=None,
        gt=0,
        max_digits=12,
        decimal_places=2,
    )
    quantity_in_stock: int | None = Field(
        default=None,
        ge=0,
        description="Cannot be negative",
    )

    @field_validator("sku")
    @classmethod
    def normalize_sku(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        if not normalized:
            raise ValueError("SKU/code cannot be empty")
        return normalized

    @model_validator(mode="after")
    def require_at_least_one_field(self) -> "ProductUpdate":
        if not self.model_dump(exclude_unset=True):
            raise ValueError("At least one field must be provided for update")
        return self


class ProductRead(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
