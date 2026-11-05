from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from mocks.users_data import MOCK_USERS

async def get_user_info(current_user: dict, db: Session = None):
    try:
        user_id = current_user.get("codigo") if current_user else None
        if not user_id:
            return JSONResponse(content={"message": "Token sin identificador de usuario"}, status_code=401)

        # 1. Búsqueda en mock dataset
        mock_user = next((u for u in MOCK_USERS if u["id"] == user_id or u["username"] == user_id), None)
        if mock_user:
            return JSONResponse(
                content={
                    "name": mock_user["name"]
                },
                status_code=200
            )

        # 2. Búsqueda en base de datos si está conectada
        if db is not None:
            try:
                from models.usuarios import Usuarios
                user = db.query(Usuarios).filter(Usuarios.CODIGO == user_id).first()
                if user:
                    user_name = user.NOMBRE.strip() if hasattr(user.NOMBRE, 'strip') else user.NOMBRE
                    return JSONResponse(
                        content={
                            "name": user_name
                        },
                        status_code=200
                    )
            except Exception:
                pass

        return JSONResponse(content={"message": "Usuario no encontrado"}, status_code=404)

    except Exception:
        return JSONResponse(content={"message": "Error interno del servidor"}, status_code=500)
