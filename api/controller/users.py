from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from config.dbconnection import session
from security.jwt_handler import encode_jwt, decode_jwt
from schemas.users import LoginRequest
from models.usuarios import Usuarios
from dotenv import load_dotenv
import os

load_dotenv()

# ---------------------------------------------------------------------------------------------------------------

async def process_login(data: LoginRequest):
  db = session()
  user_admin = os.getenv('USER_ADMIN')
  password_admin = os.getenv('PASSWORD_ADMIN')
  try:
    if data.username == user_admin and data.password == password_admin:
      user_data_cookie = {
        "codigo": user_admin,
      }
      user_data_localStorage = {
        "id": user_admin,
        "nombre": "Administrador",
      }
      token_cookie = encode_jwt(user_data_cookie)
      token_localStorage = encode_jwt(user_data_localStorage)
      
      return {'token_cookie': token_cookie, 'token_localStorage': token_localStorage, 'status_code':200}
    
    user = db.query(Usuarios).filter(Usuarios.CODIGO == data.username).first()
    
    if not user:
      return {'error': 'Usuario no encontrado', 'status_code':404}
    if user.CONTRASEÑA != data.password:
      return {'error': 'Contraseña incorrecta', 'status_code':401}
    if user.ESTADO == 0:
      return {'error': 'Usuario inactivo', 'status_code':403}

    user_data_cookie = {
      "codigo": user.CODIGO,
    }
    user_data_localStorage = {
      "id": user.CODIGO,
      "nombre": user.NOMBRE,
    }
    token_cookie = encode_jwt(user_data_cookie)
    token_localStorage = encode_jwt(user_data_localStorage)
    
    return {'token_cookie': token_cookie, 'token_localStorage': token_localStorage, 'status_code':200}
  except Exception as e:
    return {'error': str(e), 'status_code':500}
  finally:
    db.close()