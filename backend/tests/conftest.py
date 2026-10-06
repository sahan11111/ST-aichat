import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.core.database import Base, get_db
from app.main import app
from app import models  # noqa: F401

engine = create_async_engine("sqlite+aiosqlite:///./test.db")
TestSession = async_sessionmaker(engine, expire_on_commit=False)


async def override_get_db():
    async with TestSession() as session:
        yield session


app.dependency_overrides[get_db] = override_get_db


@pytest_asyncio.fixture
async def client():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c


async def register_and_auth(client, email="a@example.com"):
    r = await client.post(
        "/api/auth/register", json={"email": email, "password": "password123"}
    )
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
