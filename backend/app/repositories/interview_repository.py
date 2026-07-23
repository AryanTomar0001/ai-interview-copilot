from app.db.database import db


class InterviewRepository:

    collection = db.interviews

    async def create(self, interview: dict):
        return await self.collection.insert_one(interview)

    async def get_by_question(self, question: str):
        return await self.collection.find_one(
            {"question": question}
        )