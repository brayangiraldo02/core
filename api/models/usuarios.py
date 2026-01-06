from sqlalchemy import Column, Integer, Numeric, Date, Text, DateTime, DECIMAL, CHAR, Boolean
from config.dbconnection import Base

class Usuarios(Base):
  __tablename__ = 'USUARIOS'

  CODIGO = Column(CHAR(12), primary_key=True)
  NOMBRE = Column(CHAR(50))
  ESTADO = Column(Integer)
  FEC_ESTADO = Column(Date)
  CONTRASEÑA = Column(CHAR(10))
  FEC_CREADO = Column(DateTime)