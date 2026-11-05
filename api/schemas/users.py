from pydantic import BaseModel
from typing import Optional
from schemas.login import LoginRequest, TokenResponse, RefreshTokenRequest, MessageResponse


class UserInfoResponse(BaseModel):
    name: str
