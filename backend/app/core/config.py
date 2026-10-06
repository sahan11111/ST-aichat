from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/ai_chat"
    SECRET_KEY: str = "change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # --- AI provider selection ---
    # Set AI_PROVIDER to "gemini" or "groq"
    AI_PROVIDER: str = "groq"

    # --- Gemini (Google) ---
    GEMINI_API_KEY: str = ""
    # Default to fast flash lite model
    GEMINI_MODEL: str = "gemini-3.5-flash-lite"

    # --- Groq ---
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-20b"

    FRONTEND_URL: str = "http://localhost:3000"


settings = Settings()
