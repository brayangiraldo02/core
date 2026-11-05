from fastapi import APIRouter, Depends, Response, Cookie
from typing import Optional
from sqlalchemy.orm import Session
from schemas.login import LoginRequest, TokenResponse, RefreshTokenRequest, MessageResponse
from controller.login import process_login, refresh_access_token, process_logout
from config.dbconnection import get_db

login_router = APIRouter()

@login_router.post('/login', tags=["Users"], response_model=TokenResponse)
async def login(
    data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    return await process_login(data, response, db)

@login_router.post('/refresh-token', tags=["Users"], response_model=TokenResponse)
async def refresh_token(
    response: Response,
    refresh_token: Optional[str] = Cookie(None, alias="refresh_token"),
    data: Optional[RefreshTokenRequest] = None
):
    return await refresh_access_token(response, refresh_token, data)

@login_router.post('/logout', tags=["Users"], response_model=MessageResponse)
async def logout(response: Response):
    return await process_logout(response)
