import jwt
import datetime
from typing import Dict
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY_JWT')
REFRESH_SECRET_KEY = os.getenv('SECRET_KEY_REFRESH')
ALGORITHM = "HS256"

def create_access_token(data: Dict) -> str:
    payload = data.copy()
    payload.update({
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
        "iat": datetime.datetime.utcnow(),
        "type": "access"
    })
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: Dict) -> str:
    payload = data.copy()
    payload.update({
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=600),
        "iat": datetime.datetime.utcnow(),
        "type": "refresh"
    })
    return jwt.encode(payload, REFRESH_SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}

def decode_refresh_token(token: str) -> dict:
    try:
        return jwt.decode(token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}
