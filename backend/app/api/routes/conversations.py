from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.conversation import (
    ConversationCreate,
    ConversationOut,
    ConversationUpdate,
    MessageOut,
)
from app.services import conversation_service as svc

router = APIRouter(prefix="/conversations", tags=["conversations"])


async def _owned(db: AsyncSession, conversation_id: int, user: User):
    conv = await svc.get_owned_conversation(db, conversation_id, user.id)
    if conv is None:
        # 404 (not 403) so other users' IDs are not revealed
        raise HTTPException(404, "Conversation not found")
    return conv


@router.get("", response_model=list[ConversationOut])
async def list_conversations(
    q: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await svc.list_conversations(db, user.id, q)


@router.post("", response_model=ConversationOut, status_code=201)
async def create_conversation(
    body: ConversationCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await svc.create_conversation(db, user.id, body.title)


@router.get("/{conversation_id}", response_model=ConversationOut)
async def get_conversation(
    conversation_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _owned(db, conversation_id, user)


@router.patch("/{conversation_id}", response_model=ConversationOut)
async def update_conversation(
    conversation_id: int,
    body: ConversationUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    conv = await _owned(db, conversation_id, user)
    conv.title = body.title
    await db.commit()
    await db.refresh(conv)
    return conv


@router.delete("/{conversation_id}", status_code=204)
async def delete_conversation(
    conversation_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    conv = await _owned(db, conversation_id, user)
    await db.delete(conv)
    await db.commit()
    return Response(status_code=204)


@router.get("/{conversation_id}/messages", response_model=list[MessageOut])
async def get_messages(
    conversation_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _owned(db, conversation_id, user)
    return await svc.list_messages(db, conversation_id)
