from pydantic import BaseModel


class Interview(BaseModel):

    question: str

    expected_answer: str

    difficulty: str

    topic: str

    category: str