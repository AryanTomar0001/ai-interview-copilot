import re

FILLER_WORDS = {"um", "uh", "like", "you know", "basically"}

def clean_text(text: str) -> str:
    text = text.lower()

    # remove filler words
    for word in FILLER_WORDS:
        text = text.replace(word, "")

    # remove special characters
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)

    # remove extra spaces
    text = re.sub(r"\s+", " ", text).strip()

    return text