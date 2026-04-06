from app.ml.predict import predict_score

def evaluate_answer(question, answer, expected_answer):
    if not answer.strip():
        return {
            "score": 0,
            "confidence": 0,
            "error": "Empty answer"
        }

    score, confidence = predict_score(answer, expected_answer)

    return {
        "score": score,
        "confidence": confidence,
        "method": "Hybrid ML + Embedding"
    }