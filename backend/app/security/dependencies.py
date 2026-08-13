from fastapi import Header, HTTPException

from app.security.auth import verify_token


async def get_current_user(
    authorization: str = Header(...)
):

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    token = authorization.split(" ")[1]

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Token expired or invalid"
        )

    return payload