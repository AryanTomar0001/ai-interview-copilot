
import re


def chunk_text(
    text: str,
    chunk_size: int = 900,
    overlap: int = 120
) -> list[str]:
    if not isinstance(text, str):
        raise TypeError("Resume text must be a string")

    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than zero")

    if overlap < 0 or overlap >= chunk_size:
        raise ValueError("overlap must be >= 0 and < chunk_size")

    if not text.strip():
        return []

    # Preserve paragraph breaks, but normalize excessive whitespace.
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()

    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        hard_end = min(start + chunk_size, text_length)
        end = hard_end

        if hard_end < text_length:
            # Prefer a natural boundary in the latter part of the chunk.
            minimum = start + int(chunk_size * 0.6)

            for separator in ("\n\n", "\n", " "):
                boundary = text.rfind(separator, minimum, hard_end)

                if boundary >= minimum:
                    end = boundary
                    break

        # Defensive fallback to guarantee forward progress.
        if end <= start:
            end = hard_end

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end >= text_length:
            break

        # Move backwards for overlap, then avoid starting mid-word.
        next_start = max(start + 1, end - overlap)

        while (
            next_start < text_length
            and next_start > 0
            and not text[next_start - 1].isspace()
        ):
            next_start += 1

        while (
            next_start < text_length
            and text[next_start].isspace()
        ):
            next_start += 1

        if next_start <= start:
            next_start = end

        start = next_start

    return chunks




def infer_section(chunk: str) -> str:
    """
    Best-effort label based on text near the start of a chunk.
    This is a hint, not guaranteed resume-section classification.
    """
    lines = [
        line.strip().lower().rstrip(":")
        for line in chunk.splitlines()
        if line.strip()
    ]

    header = " ".join(lines[:2])

    patterns = {
        "skills": (
            "technical skills",
            "skills",
            "programming languages",
            "technologies",
            "tech stack",
        ),
        "projects": (
            "projects",
            "personal projects",
            "academic projects",
        ),
        "experience": (
            "work experience",
            "professional experience",
            "internship",
        ),
        "education": (
            "education",
            "academic background",
        ),
        "certifications": (
            "certifications",
            "certificates",
        ),
    }

    for section, keywords in patterns.items():
        if any(keyword in header for keyword in keywords):
            return section

    return "other"
