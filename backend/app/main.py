import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.routes import auth, chat, conversations, users
from app.core.config import settings
from app.core.database import Base, engine
from app.core.limiter import limiter
from app import models  # noqa: F401  (register models)

logger = logging.getLogger("app")

app = FastAPI(title="AI Chat API", version="0.1.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    return response


@app.exception_handler(Exception)
async def unhandled(request: Request, exc: Exception):
    logger.exception("Unhandled error")  # details only in server logs
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "An internal server error occurred."},
    )


@app.on_event("startup")
async def on_startup():
    # Convenience for local dev. Use `alembic upgrade head` in production.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/health")
async def health():
    return {"status": "ok"}


for r in (auth.router, users.router, conversations.router, chat.router):
    app.include_router(r, prefix="/api")
