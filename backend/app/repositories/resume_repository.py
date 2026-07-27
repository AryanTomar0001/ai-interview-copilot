from app.db.database import db


class ResumeRepository:

    collection = db.resumes

    async def create(self, resume: dict):
        return await self.collection.insert_one(resume)

    async def latest(self):
        return await self.collection.find_one(
            sort=[("_id", -1)]
        )
    async def get_latest_by_user(self, user_id: str):
        return await self.collection.find_one(
            {"user_id": user_id},
            sort=[("_id", -1)]
        )   
    async def delete_by_user_id(self, user_id: str):
        return await self.collection.delete_many(
            {"user_id": user_id}
        )