import jwt
import datetime
from typing import Dict
from config.settings import settings

SECRET_KEY = settings.SECRET_KEY_JWT
REFRESH_SECRET_KEY = settings.SECRET_KEY_REFRESH
ALGORITHM = "HS256"

def create_access_token(data: Dict) -> str:
    payload = data.copy()
    now = datetime.datetime.now(datetime.timezone.utc)
    payload.update({
        "exp": now + datetime.timedelta(seconds=settings.ACCESS_TOKEN_EXPIRE_SECONDS),
        "iat": now,
        "type": "access"
    })
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: Dict) -> str:
    payload = data.copy()
    now = datetime.datetime.now(datetime.timezone.utc)
    payload.update({
        "exp": now + datetime.timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES),
        "iat": now,
        "type": "refresh"
    })
    return jwt.encode(payload, REFRESH_SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if not isinstance(payload, dict):
            return {"error": "Invalid token"}
        if payload.get("type") != "access":
            return {"error": "Invalid token"}
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired"}
    except (jwt.PyJWTError, TypeError, ValueError, Exception):
        return {"error": "Invalid token"}

def decode_refresh_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        if not isinstance(payload, dict):
            return {"error": "Invalid token"}
        if payload.get("type") != "refresh":
            return {"error": "Invalid token"}
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired"}
    except (jwt.PyJWTError, TypeError, ValueError, Exception):
        return {"error": "Invalid token"}
