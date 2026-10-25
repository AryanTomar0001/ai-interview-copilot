
from app.db.database import db


class ResumeRepository:

    collection = db.resumes

    async def create(self, resume: dict):
        return await self.collection.insert_one(resume)

    async def get_latest_by_user(self, user_id: str):
        return await self.collection.find_one(
            {"user_id": user_id},
            sort=[("_id", -1)]
        )

    async def delete_older_by_user_id(
        self,
        user_id: str,
        keep_resume_id: str
    ):
        # Delete older records only after the new resume
        # has been processed and saved successfully.
        return await self.collection.delete_many({
            "user_id": user_id,
            "resume_id": {"$ne": keep_resume_id}
        })

    async def delete_by_user_id(self, user_id: str):
        # Keep only for intentional deletion of all resumes
        # belonging to one authenticated user.
        return await self.collection.delete_many({
            "user_id": user_id
        })
