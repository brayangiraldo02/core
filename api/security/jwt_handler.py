import jwt
import datetime
from typing import Dict
from dotenv import load_dotenv
import os

load_dotenv()

# Establece una clave secreta
SECRET_KEY = os.getenv('SECRET_KEY_JWT')
ALGORITHM = "HS256"

def encode_jwt(user_data: Dict) -> str:
    """Codifica un token JWT basado en los datos del usuario"""
    payload = {
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=600),  # Token expira en 10 horas
        "iat": datetime.datetime.utcnow(),
        "user_data": user_data
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_jwt(token: str) -> dict:
    """Decodifica un token JWT para obtener los datos del usuario"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["user_data"]
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}

def create_token(data: Dict, secret: str = SECRET_KEY) -> str:
    return encode_jwt(user_data=data)