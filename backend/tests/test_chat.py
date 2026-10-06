import pytest

from app.services import chat_service
from tests.conftest import register_and_auth

pytestmark = pytest.mark.asyncio


class FakeProvider:
    async def complete(self, messages):
        return "Hi from the fake AI"

    async def stream(self, messages):
        yield "Hi"


async def test_chat_creates_conversation_and_reply(client, monkeypatch):
    monkeypatch.setattr(chat_service, "get_ai_provider", lambda: FakeProvider())
    h = await register_and_auth(client)
    r = await client.post("/api/chat", json={"message": "Hello"}, headers=h)
    assert r.status_code == 200
    body = r.json()
    assert body["assistant_message"]["content"] == "Hi from the fake AI"


async def test_empty_message_rejected(client):
    h = await register_and_auth(client)
    r = await client.post("/api/chat", json={"message": ""}, headers=h)
    assert r.status_code == 422
