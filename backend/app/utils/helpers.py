def truncate(text: str, length: int = 60) -> str:
    return text if len(text) <= length else text[: length - 1] + "…"
