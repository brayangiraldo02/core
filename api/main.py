from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from config.dbconnection import Base, engine
from dotenv import load_dotenv
from routes.users import users_router
# from security.deps import get_current_user # DESCOMENTAR PARA PROTEGER RUTAS
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base.metadata.create_all(bind=engine) # DESCOMENTAR CUANDO HAYA DB ACTIVA

app.include_router(users_router, prefix="/users")
# app.include_router(otra_router, prefix="/otra", dependencies=[Depends(get_current_user)])

@app.get("/")
# @app.get("/", dependencies=[Depends(get_current_user)]) 
def main():
    return {"Hello": "World"}
