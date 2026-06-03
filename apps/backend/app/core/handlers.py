from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError


async def validation_exception_handler(
    _request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    errors = [
        {
            "field": ".".join(str(loc) for loc in err["loc"] if loc != "body"),
            "message": err["msg"],
            "type": err["type"],
        }
        for err in exc.errors()
    ]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={
            "code": "VALIDATION_ERROR",
            "message": "Request validation failed",
            "errors": errors,
        },
    )


async def integrity_exception_handler(
    _request: Request,
    exc: IntegrityError,
) -> JSONResponse:
    message = str(exc.orig) if exc.orig else "Database constraint violated"
    code = "CONSTRAINT_VIOLATION"
    status_code = status.HTTP_409_CONFLICT

    if "products_sku" in message or "sku" in message.lower():
        code = "SKU_ALREADY_EXISTS"
        message = "Product SKU/code must be unique"
    elif "customers_email" in message or "email" in message.lower():
        code = "EMAIL_ALREADY_EXISTS"
        message = "Customer email must be unique"
    elif "foreign key" in message.lower():
        code = "REFERENCE_CONFLICT"
        message = "Operation conflicts with related records"
        status_code = status.HTTP_409_CONFLICT

    return JSONResponse(
        status_code=status_code,
        content={"code": code, "message": message},
    )


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(IntegrityError, integrity_exception_handler)
