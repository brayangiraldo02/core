from fastapi import Response, HTTPException, status
from typing import Optional
from sqlalchemy.orm import Session
from security.jwt_handler import create_access_token, create_refresh_token, decode_refresh_token
from schemas.login import LoginRequest, TokenResponse, RefreshTokenRequest, MessageResponse
from mocks.users_data import MOCK_USERS
from config.settings import settings

def _clear_refresh_cookie(response: Response) -> Optional[dict]:
    """Helper unificado para borrar la cookie de refresh_token y retornar headers para HTTPException."""
    response.delete_cookie(
        key="refresh_token",
        path=settings.COOKIE_PATH,
        httponly=True,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE
    )
    set_cookie_val = response.headers.get("set-cookie")
    return {"Set-Cookie": set_cookie_val} if set_cookie_val else None


async def process_login(data: LoginRequest, response: Response, db: Session = None) -> TokenResponse:
    try:
        # 1. Verificación contra dataset mock
        mock_user = next((u for u in MOCK_USERS if u["username"] == data.username or u["id"] == data.username), None)
        if mock_user:
            if not mock_user.get("active", True):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Usuario inactivo")
            if mock_user["password"] != data.password:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Contraseña incorrecta")

            # Minimización de claims: estrictamente {"codigo": user_id}
            user_data_payload = {"codigo": mock_user["id"]}
            access_token = create_access_token(user_data_payload)
            refresh_token = create_refresh_token(user_data_payload)

            # Configuración de cookie HttpOnly
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite=settings.COOKIE_SAMESITE,
                path=settings.COOKIE_PATH,
                max_age=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60
            )

            return TokenResponse(
                access_token=access_token,
                token_type="bearer"
            )

        # 2. Verificación contra base de datos si está conectada
        if db is not None:
            try:
                from models.usuarios import Usuarios
                user = db.query(Usuarios).filter(Usuarios.CODIGO == data.username).first()
                if user:
                    if user.ESTADO == 0:
                        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Usuario inactivo")
                    
                    user_password = user.CONTRASEÑA.strip() if hasattr(user.CONTRASEÑA, 'strip') else user.CONTRASEÑA
                    if user_password != data.password:
                        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Contraseña incorrecta")

                    user_code = user.CODIGO.strip() if hasattr(user.CODIGO, 'strip') else user.CODIGO
                    user_data_payload = {"codigo": user_code}
                    access_token = create_access_token(user_data_payload)
                    refresh_token = create_refresh_token(user_data_payload)

                    response.set_cookie(
                        key="refresh_token",
                        value=refresh_token,
                        httponly=True,
                        secure=settings.COOKIE_SECURE,
                        samesite=settings.COOKIE_SAMESITE,
                        path=settings.COOKIE_PATH,
                        max_age=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60
                    )

                    return TokenResponse(
                        access_token=access_token,
                        token_type="bearer"
                    )
            except HTTPException:
                raise
            except Exception:
                pass

        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario o contraseña inválidos")

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

async def refresh_access_token(
    response: Response,
    refresh_token: Optional[str] = None,
    data: Optional[RefreshTokenRequest] = None
) -> TokenResponse:
    cookie_passed = refresh_token is not None
    try:
        token_from_cookie = refresh_token.strip() if (refresh_token and isinstance(refresh_token, str)) else None
        token_from_body = data.refresh_token.strip() if (data and data.refresh_token and isinstance(data.refresh_token, str)) else None
        token_to_use = token_from_cookie or token_from_body

        if not token_to_use:
            headers = _clear_refresh_cookie(response) if cookie_passed else None
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token no encontrado",
                headers=headers
            )

        user_data = decode_refresh_token(token_to_use)
        if "error" in user_data:
            headers = _clear_refresh_cookie(response)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=user_data["error"],
                headers=headers
            )

        user_code = user_data.get("codigo")
        if not user_code or not isinstance(user_code, (str, int)):
            headers = _clear_refresh_cookie(response)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers=headers
            )

        # Rotación de tokens con payload mínimo
        new_payload = {"codigo": str(user_code)}
        new_access_token = create_access_token(new_payload)
        new_refresh_token = create_refresh_token(new_payload)

        # Emitir nueva cookie con refresh token renovado
        response.set_cookie(
            key="refresh_token",
            value=new_refresh_token,
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite=settings.COOKIE_SAMESITE,
            path=settings.COOKIE_PATH,
            max_age=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60
        )

        return TokenResponse(
            access_token=new_access_token,
            token_type="bearer"
        )
    except HTTPException:
        raise
    except Exception:
        headers = _clear_refresh_cookie(response) if cookie_passed else None
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor",
            headers=headers
        )

async def process_logout(response: Response) -> MessageResponse:
    # Borrado seguro de cookie incluyendo secure=settings.COOKIE_SECURE
    _clear_refresh_cookie(response)
    return MessageResponse(message="Sesión cerrada correctamente")
