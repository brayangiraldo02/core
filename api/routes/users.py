from fastapi import APIRouter, Response, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from schemas.users import LoginRequest, TokenResponse, RefreshTokenRequest
from controller.users import process_login, refresh_access_token

users_router = APIRouter()

@users_router.post('/login', tags=["Users"], response_model=TokenResponse)
async def login(data: LoginRequest):
    login_result = await process_login(data)

    if 'error' in login_result:
        raise HTTPException(
            status_code=login_result['status_code'],
            detail=login_result['error']
        )
    
    return TokenResponse(
        access_token=login_result['access_token'],
        refresh_token=login_result['refresh_token'],
        user=login_result['user_data']
    )

# ---------------------------------------------------------------------------------------------------------------

@users_router.post('/refresh-token', tags=["Users"])
async def refresh_token(data: RefreshTokenRequest):
    result = await refresh_access_token(data.refresh_token)

    if 'error' in result:
        raise HTTPException(
            status_code=result['status_code'],
            detail=result['error']
        )
    
    return {
        "access_token": result['access_token']
    }
