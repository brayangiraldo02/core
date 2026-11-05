from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.users import UserInfoResponse
from controller.users import get_user_info
from config.dbconnection import get_db
from security.deps import get_current_user

users_router = APIRouter()

@users_router.get('/info', tags=["Users"], response_model=UserInfoResponse)
async def user_info(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await get_user_info(current_user, db)
