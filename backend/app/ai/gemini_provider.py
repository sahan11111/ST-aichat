"""Gemini provider using the official google-genai SDK (>= 2.25.0)."""
from collections.abc import AsyncIterator

from google import genai
from google.genai import types

from app.ai.base import AIProvider, ChatMessage
from app.core.config import settings


def _build_client() -> genai.Client:
    return genai.Client(api_key=settings.GEMINI_API_KEY)


def _format_messages(
    messages: list[ChatMessage],
) -> tuple[types.GenerateContentConfig | None, list[types.Content]]:
    """Convert chat messages to Gemini SDK contents and config."""
    system_parts: list[str] = []
    contents: list[types.Content] = []

    for msg in messages:
        role = msg.get("role", "")
        content = msg.get("content", "")
        if not content:
            continue
        if role == "system":
            system_parts.append(content)
        elif role in ("assistant", "model"):
            contents.append(
                types.Content(
                    role="model",
                    parts=[types.Part.from_text(text=content)],
                )
            )
        else:
            contents.append(
                types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=content)],
                )
            )

    config = (
        types.GenerateContentConfig(system_instruction="\n\n".join(system_parts))
        if system_parts
        else None
    )
    return config, contents


class GeminiProvider(AIProvider):
    """AI provider backed by Google's Gemini models via the google-genai SDK."""

    async def complete(self, messages: list[ChatMessage]) -> str:
        client = _build_client()
        config, contents = _format_messages(messages)
        response = await client.aio.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=contents,
            config=config,
        )
        return response.text or ""

    async def stream(self, messages: list[ChatMessage]) -> AsyncIterator[str]:
        client = _build_client()
        config, contents = _format_messages(messages)
        stream_response = await client.aio.models.generate_content_stream(
            model=settings.GEMINI_MODEL,
            contents=contents,
            config=config,
        )
        async for chunk in stream_response:
            if chunk.text:
                yield chunk.text
