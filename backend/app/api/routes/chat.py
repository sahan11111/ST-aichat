from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.limiter import limiter
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.conversation import MessageOut
from app.services import chat_service

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
@limiter.limit("20/minute")
async def chat(
    request: Request,
    body: ChatRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await chat_service.send_message(db, user.id, body.conversation_id, body.message)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI Provider error: {exc}") from exc

    if result is None:
        raise HTTPException(404, "Conversation not found")
    conv, user_msg, assistant_msg = result
    return ChatResponse(
        conversation_id=conv.id,
        user_message=MessageOut.model_validate(user_msg),
        assistant_message=MessageOut.model_validate(assistant_msg),
    )


@router.post("/stream")
@limiter.limit("20/minute")
async def chat_stream(
    request: Request,
    body: ChatRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    async def event_stream():
        async for _conv_id, chunk in chat_service.stream_message(
            db, user.id, body.conversation_id, body.message
        ):
            yield chunk

    return StreamingResponse(event_stream(), media_type="text/plain")
