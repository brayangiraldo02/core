from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from schemas.users import LoginRequest
from controller.users import process_login

users_router = APIRouter()

@users_router.post('/login/', tags=["Users"])
async def login(data: LoginRequest, response: Response):
  login_result = await process_login(data)

  if 'error' in login_result:
    return JSONResponse(content=jsonable_encoder({'message': login_result['error']}), status_code=login_result['status_code'])
  
  response.set_cookie(key="access_token", value=login_result['token_cookie'], httponly=True, secure=True, samesite='strict')
  return JSONResponse(content=jsonable_encoder({'token': login_result['token_localStorage']}), status_code=login_result['status_code'])