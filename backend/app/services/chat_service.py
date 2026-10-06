from sqlalchemy.ext.asyncio import AsyncSession

from app.ai import get_ai_provider
from app.services import conversation_service as convs

SYSTEM_PROMPT = {"role": "system", "content": "You are a helpful AI assistant."}
MAX_HISTORY = 30


async def _prepare(db: AsyncSession, user_id: int, conversation_id: int | None, text: str):
    if conversation_id is None:
        conv = await convs.create_conversation(db, user_id, text[:60])
    else:
        conv = await convs.get_owned_conversation(db, conversation_id, user_id)
        if conv is None:
            return None, None, None
    user_msg = await convs.add_message(db, conv.id, "user", text)
    history = await convs.list_messages(db, conv.id)
    messages = [SYSTEM_PROMPT] + [
        {"role": m.role, "content": m.content} for m in history[-MAX_HISTORY:]
    ]
    return conv, user_msg, messages


async def send_message(db: AsyncSession, user_id: int, conversation_id: int | None, text: str):
    conv, user_msg, messages = await _prepare(db, user_id, conversation_id, text)
    if conv is None:
        return None
    reply = await get_ai_provider().complete(messages)
    assistant_msg = await convs.add_message(db, conv.id, "assistant", reply)
    return conv, user_msg, assistant_msg


async def stream_message(db: AsyncSession, user_id: int, conversation_id: int | None, text: str):
    """Async generator yielding (conversation_id, chunk). Saves the full reply at the end."""
    conv, _, messages = await _prepare(db, user_id, conversation_id, text)
    if conv is None:
        return
    parts: list[str] = []
    async for chunk in get_ai_provider().stream(messages):
        parts.append(chunk)
        yield conv.id, chunk
    await convs.add_message(db, conv.id, "assistant", "".join(parts))
