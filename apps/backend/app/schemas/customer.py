from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class CustomerBase(BaseModel):
    full_name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    phone_number: str = Field(min_length=1, max_length=32)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()


class CustomerCreate(CustomerBase):
    model_config = ConfigDict(extra="forbid")


class CustomerRead(CustomerBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
