from app.db.database import db


class InterviewRepository:

    collection = db.interviews

    async def create(self, interview: dict):
        return await self.collection.insert_one(interview)

    async def get_by_question(
    self,
    user_id: str,
    question: str
    ):
        return await self.collection.find_one(
        {
            "user_id": user_id,
            "question": question
        }
        )

    async def delete_all(self):
        return await self.collection.delete_many({})