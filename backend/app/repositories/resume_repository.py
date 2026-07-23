from app.db.database import db


class ResumeRepository:

    collection = db.resumes

    async def save(self, resume: dict):
        return await self.collection.insert_one(resume)

    async def get_latest(self):
        return await self.collection.find_one(
            sort=[("_id", -1)]
        )