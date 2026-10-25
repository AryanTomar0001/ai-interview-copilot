from app.schemas.interview import InterviewConfig


def build_interview_plan(config: InterviewConfig) -> dict:
    question_count = config.question_count

    # Initialize question counts for all categories
    question_counts = {
        "technical": 0,
        "project": 0,
        "hr": 0,
    }

    # Select flow according to interview mode
    if config.mode == "technical":
        generator = "technical_generator"
        question_counts["technical"] = question_count

    elif config.mode == "project":
        generator = "project_generator"
        question_counts["project"] = question_count

    elif config.mode == "hr":
        generator = "hr_generator"
        question_counts["hr"] = question_count

    elif config.mode == "combined":
        generator = "combined_generator"

        # Default distribution: 50% technical,
        # 30% project, remaining questions HR.
        technical_count = min(
            question_count,
            (question_count * 5 + 5) // 10,
        )

        project_count = min(
            question_count - technical_count,
            (question_count * 3 + 5) // 10,
        )

        hr_count = (
            question_count - technical_count - project_count
        )

        question_counts = {
            "technical": technical_count,
            "project": project_count,
            "hr": hr_count,
        }

    else:
        raise ValueError("Unsupported interview mode")

    return {
        "mode": config.mode,
        "difficulty": config.difficulty,
        "question_count": question_count,
        "generator": generator,
        "question_counts": question_counts,
    }