from app.services.llm_service import llm_service


def generate_feedback(question, answer, expected_answer, score):
    return llm_service.generate_feedback(
        question=question,
        answer=answer,
        expected=expected_answer,
        score=score
    )