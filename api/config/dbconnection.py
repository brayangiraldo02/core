from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

db_type = os.getenv('DB_TYPE')
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_host = os.getenv('DB_HOST')
db_port = os.getenv('DB_PORT')
db_name = os.getenv('DB_NAME')
DATABASE_URL = f"{db_type}://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
if DATABASE_URL is None:
    raise ValueError("No se ha definido la variable de entorno 'DB_URL'")

# Database motor
engine = create_engine(
    DATABASE_URL,
    pool_recycle=3600,  # Recicla cada 1 hora
    pool_pre_ping=True  # Habilita pre-ping para evitar 'server has gone away'
)

# Session generator
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base class
Base = declarative_base()