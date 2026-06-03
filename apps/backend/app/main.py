from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI

from app.core.handlers import register_exception_handlers
from app.db.base import Base
from app.db.session import engine
from app.routers import customers, orders, products


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="Ethara API",
    lifespan=lifespan,
    description=(
        "Inventory and order API service."
    ),
)

register_exception_handlers(app)

app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
