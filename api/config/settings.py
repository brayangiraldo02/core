from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    SECRET_KEY_JWT: str
    SECRET_KEY_REFRESH: str

    # Configuración de Cookies de Seguridad
    # Valores obligatorios, se leen desde el archivo .env
    COOKIE_SECURE: bool  # True en producción con HTTPS
    COOKIE_SAMESITE: str
    COOKIE_PATH: str
    ACCESS_TOKEN_EXPIRE_SECONDS: int
    REFRESH_TOKEN_EXPIRE_MINUTES: int

    DB_TYPE: Optional[str] = "mysql+pymysql"
    DB_USER: Optional[str] = "root"
    DB_PASSWORD: Optional[str] = ""
    DB_HOST: Optional[str] = "localhost"
    DB_PORT: Optional[str] = "3306"
    DB_NAME: Optional[str] = "core_db"

    USE_MOCK_DATA: bool = True

    @property
    def DATABASE_URL(self) -> str:
        return f"{self.DB_TYPE}://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
