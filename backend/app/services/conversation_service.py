from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.conversation import Conversation
from app.models.message import Message


async def list_conversations(db: AsyncSession, user_id: int, q: str | None = None):
    stmt = select(Conversation).where(Conversation.user_id == user_id)
    if q:
        stmt = stmt.where(Conversation.title.ilike(f"%{q}%"))
    stmt = stmt.order_by(Conversation.updated_at.desc())
    return (await db.execute(stmt)).scalars().all()


async def get_owned_conversation(
    db: AsyncSession, conversation_id: int, user_id: int
) -> Conversation | None:
    """Ownership check: a user can only ever load their own conversations."""
    stmt = select(Conversation).where(
        Conversation.id == conversation_id, Conversation.user_id == user_id
    )
    return (await db.execute(stmt)).scalar_one_or_none()


async def create_conversation(db: AsyncSession, user_id: int, title: str) -> Conversation:
    conv = Conversation(user_id=user_id, title=title)
    db.add(conv)
    await db.commit()
    await db.refresh(conv)
    return conv


async def list_messages(db: AsyncSession, conversation_id: int):
    stmt = select(Message).where(Message.conversation_id == conversation_id).order_by(Message.id)
    return (await db.execute(stmt)).scalars().all()


async def add_message(db: AsyncSession, conversation_id: int, role: str, content: str) -> Message:
    msg = Message(conversation_id=conversation_id, role=role, content=content)
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg
