import pytest

from tests.conftest import register_and_auth

pytestmark = pytest.mark.asyncio


async def test_register_login_me(client):
    headers = await register_and_auth(client)
    r = await client.get("/api/auth/me", headers=headers)
    assert r.status_code == 200
    assert r.json()["email"] == "a@example.com"

    r = await client.post(
        "/api/auth/login", json={"email": "a@example.com", "password": "password123"}
    )
    assert r.status_code == 200


async def test_wrong_password(client):
    await register_and_auth(client)
    r = await client.post(
        "/api/auth/login", json={"email": "a@example.com", "password": "wrong-pass"}
    )
    assert r.status_code == 401


async def test_protected_route_requires_token(client):
    r = await client.get("/api/auth/me")
    assert r.status_code == 401
