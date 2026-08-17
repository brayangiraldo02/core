from pydantic import BaseModel
from typing import Optional, Dict, Any

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class RefreshTokenRequest(BaseModel):
    refresh_token: Optional[str] = None

class MessageResponse(BaseModel):
    message: str

class UserInfoResponse(BaseModel):
    id: str
    name: str
    role: Optional[str] = "Usuario"
