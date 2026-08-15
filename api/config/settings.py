from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    SECRET_KEY_JWT: str = "clave_secreta_jwt_core_default_dev_123456"
    SECRET_KEY_REFRESH: str = "clave_secreta_refresh_core_default_dev_123456"

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
