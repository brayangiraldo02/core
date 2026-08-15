from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from security.jwt_handler import create_access_token, create_refresh_token, decode_refresh_token
from schemas.users import LoginRequest
from mocks.users_data import MOCK_USERS

async def process_login(data: LoginRequest, db: Session = None):
    try:
        # 1. Verificación contra dataset mock (o lista de usuarios configurados)
        mock_user = next((u for u in MOCK_USERS if u["username"] == data.username or u["id"] == data.username), None)
        if mock_user:
            if not mock_user.get("active", True):
                return {"error": "Usuario inactivo", "status_code": 403}
            if mock_user["password"] != data.password:
                return {"error": "Contraseña incorrecta", "status_code": 401}

            user_data_payload = {"codigo": mock_user["id"], "nombre": mock_user["name"]}
            access_token = create_access_token(user_data_payload)
            refresh_token = create_refresh_token(user_data_payload)
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "status_code": 200
            }

        # 2. Verificación contra DB real si está activa y disponible
        if db is not None:
            try:
                from models.usuarios import Usuarios
                user = db.query(Usuarios).filter(Usuarios.CODIGO == data.username).first()
                if user:
                    if user.ESTADO == 0:
                        return {"error": "Usuario inactivo", "status_code": 403}
                    if user.CONTRASEÑA != data.password:
                        return {"error": "Contraseña incorrecta", "status_code": 401}

                    user_data_payload = {"codigo": user.CODIGO, "nombre": user.NOMBRE}
                    access_token = create_access_token(user_data_payload)
                    refresh_token = create_refresh_token(user_data_payload)
                    return {
                        "access_token": access_token,
                        "refresh_token": refresh_token,
                        "status_code": 200
                    }
            except Exception:
                pass

        return {"error": "Usuario o contraseña inválidos", "status_code": 401}

    except Exception as e:
        return {"error": str(e), "status_code": 500}

async def get_user_info(current_user: dict, db: Session = None):
    try:
        user_id = current_user.get("codigo")
        user_name = current_user.get("nombre")

        # Buscar en mocks
        mock_user = next((u for u in MOCK_USERS if u["id"] == user_id or u["username"] == user_id), None)
        if mock_user:
            return JSONResponse(
                content={
                    "id": mock_user["id"],
                    "name": mock_user["name"],
                    "role": mock_user.get("role", "Usuario")
                },
                status_code=200
            )

        # Buscar en DB si aplica
        if db is not None:
            try:
                from models.usuarios import Usuarios
                user = db.query(Usuarios).filter(Usuarios.CODIGO == user_id).first()
                if user:
                    return JSONResponse(
                        content={
                            "id": user.CODIGO,
                            "name": user.NOMBRE,
                            "role": "Usuario"
                        },
                        status_code=200
                    )
            except Exception:
                pass

        if user_name:
            return JSONResponse(
                content={"id": user_id, "name": user_name, "role": "Usuario"},
                status_code=200
            )

        return JSONResponse(content={"message": "Usuario no encontrado"}, status_code=404)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

async def refresh_access_token(refresh_token: str):
    try:
        if not refresh_token:
            return {"error": "Refresh token missing", "status_code": 401}

        user_data = decode_refresh_token(refresh_token)
        if "error" in user_data:
            return {"error": user_data["error"], "status_code": 401}

        new_payload = {
            "codigo": user_data.get("codigo"),
            "nombre": user_data.get("nombre", "")
        }
        new_access_token = create_access_token(new_payload)

        return {"access_token": new_access_token, "status_code": 200}
    except Exception as e:
        return {"error": str(e), "status_code": 500}
