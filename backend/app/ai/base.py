from abc import ABC, abstractmethod
from collections.abc import AsyncIterator

ChatMessage = dict[str, str]  # {"role": "...", "content": "..."}


class AIProvider(ABC):
    """Interface every AI provider must implement."""

    @abstractmethod
    async def complete(self, messages: list[ChatMessage]) -> str: ...

    @abstractmethod
    def stream(self, messages: list[ChatMessage]) -> AsyncIterator[str]: ...
