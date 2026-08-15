from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from config.settings import settings

class Base(DeclarativeBase):
    pass

engine = None
SessionLocal = None

try:
    if not settings.USE_MOCK_DATA:
        engine = create_engine(
            settings.DATABASE_URL,
            pool_recycle=3600,   # Recicla cada 1 hora
            pool_pre_ping=True   # Pre-ping para evitar 'server has gone away'
        )
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    print(f"Aviso: Conexión DB no inicializada ({e}). Operando en modo Mock.")

def get_db():
    """
    Generador de dependencias. Abre una sesión por request y la cierra al terminar.
    En modo Mock devuelve None sin fallar.
    """
    if SessionLocal is None:
        yield None
        return

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()