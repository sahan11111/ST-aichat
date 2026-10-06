import pytest

from tests.conftest import register_and_auth

pytestmark = pytest.mark.asyncio


async def test_conversation_crud(client):
    h = await register_and_auth(client)
    r = await client.post("/api/conversations", json={"title": "Hello"}, headers=h)
    assert r.status_code == 201
    cid = r.json()["id"]

    r = await client.patch(f"/api/conversations/{cid}", json={"title": "Renamed"}, headers=h)
    assert r.json()["title"] == "Renamed"

    r = await client.delete(f"/api/conversations/{cid}", headers=h)
    assert r.status_code == 204


async def test_user_cannot_access_other_users_conversation(client):
    h1 = await register_and_auth(client, "one@example.com")
    h2 = await register_and_auth(client, "two@example.com")
    r = await client.post("/api/conversations", json={"title": "Private"}, headers=h1)
    cid = r.json()["id"]

    r = await client.get(f"/api/conversations/{cid}", headers=h2)
    assert r.status_code == 404
