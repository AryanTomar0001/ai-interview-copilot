
from uuid import uuid4

from app.db.database import db


class InterviewRepository:

    collection = db.interviews
    sessions_collection = db.interview_sessions

    async def create_session(self, user_id: str, mode: str):
        interview_id = str(uuid4())

        session = {
            "_id": interview_id,
            "user_id": user_id,
            "interview_type": mode,
            "status": "in_progress",
            "total_questions": 0,
            "overall_score": None,
        }

        await self.sessions_collection.insert_one(session)

        return interview_id

    async def create(self, interview: dict):
        result = await self.collection.insert_one(interview)

        # Return the generated MongoDB question ID.
        return str(result.inserted_id)

    async def get_by_question(
        self,
        user_id: str,
        question: str
    ):
        return await self.collection.find_one(
            {
                "user_id": user_id,
                "question": question
            },
            sort=[("_id", -1)]
        )

    async def get_by_id(self, question_id: str, user_id: str):
        from bson import ObjectId

        if not ObjectId.is_valid(question_id):
            return None

        return await self.collection.find_one({
            "_id": ObjectId(question_id),
            "user_id": user_id
        })

    async def update_session(self, interview_id: str, updates: dict):
        return await self.sessions_collection.update_one(
            {"_id": interview_id},
            {"$set": updates}
        )

    async def delete_all(self):
        return await self.collection.delete_many({})


    async def save_evaluation(
        self,
        question_id: str,
        user_id: str,
        evaluation: dict,
        transcript: str
    ):
        from bson import ObjectId

        if not ObjectId.is_valid(question_id):
            return None

        return await self.collection.update_one(
            {
                "_id": ObjectId(question_id),
                "user_id": user_id
            },
            {
                "$set": {
                    "evaluation": evaluation,
                    "score": evaluation["score"],
                    "transcript": transcript
                }
            }
        )

    async def get_session_by_id(self, interview_id: str, user_id: str):
        return await self.sessions_collection.find_one({
            "_id": interview_id,
            "user_id": user_id
        })
        