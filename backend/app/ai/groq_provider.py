"""Groq provider using the OpenAI-compatible chat completions endpoint."""
import json
from collections.abc import AsyncIterator

import httpx

from app.ai.base import AIProvider, ChatMessage
from app.core.config import settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


class GroqProvider(AIProvider):
    """AI provider backed by Groq's LLM inference API."""

    def _headers(self) -> dict[str, str]:
        return {"Authorization": f"Bearer {settings.GROQ_API_KEY}"}

    async def complete(self, messages: list[ChatMessage]) -> str:
        payload = {"model": settings.GROQ_MODEL, "messages": messages}
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(GROQ_URL, json=payload, headers=self._headers())
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"]

    async def stream(self, messages: list[ChatMessage]) -> AsyncIterator[str]:
        payload = {"model": settings.GROQ_MODEL, "messages": messages, "stream": True}
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                "POST", GROQ_URL, json=payload, headers=self._headers()
            ) as resp:
                resp.raise_for_status()
                async for line in resp.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    data = line[6:]
                    if data == "[DONE]":
                        break
                    delta = json.loads(data)["choices"][0]["delta"].get("content")
                    if delta:
                        yield delta
