from app.ai.base import AIProvider
from app.ai.gemini_provider import GeminiProvider
from app.ai.groq_provider import GroqProvider
from app.core.config import settings


def get_ai_provider() -> AIProvider:
    providers = {"groq": GroqProvider, "gemini": GeminiProvider}
    try:
        return providers[settings.AI_PROVIDER.lower()]()
    except KeyError:
        raise RuntimeError(f"Unknown AI_PROVIDER: {settings.AI_PROVIDER}")
