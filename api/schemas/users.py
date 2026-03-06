from pydantic import BaseModel
from typing import Optional, Dict, Any

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: Dict[str, Any]

class RefreshTokenRequest(BaseModel):
    refresh_token: str
