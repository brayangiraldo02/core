from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from routes.users import users_router
from routes.tables import tables_router
from routes.reports import reports_router
from security.deps import get_current_user
import traceback

app = FastAPI(title="Core Starter API", version="1.0.0")

# Configuración CORS flexible
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers globales para diagnóstico claro
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Error de validación en {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"message": "Error de validación", "details": exc.errors()},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Error 500 crítico en {request.url}:")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={
            "message": "Error interno del servidor",
            "error_type": type(exc).__name__,
            "details": str(exc)
        },
    )

# Routers
app.include_router(users_router, prefix="/users")
app.include_router(tables_router, prefix="/tables", dependencies=[Depends(get_current_user)])
app.include_router(reports_router, prefix="/reports", dependencies=[Depends(get_current_user)])

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Core Template API",
        "mode": "Mock & DB ready",
        "features": ["JWT Auth", "Mock Tables", "PDF Generator (Jinja2 + pdfkit)"]
    }

@app.get("/health", dependencies=[Depends(get_current_user)])
def health_check(current_user: dict = Depends(get_current_user)):
    return {"status": "ok", "user": current_user.get("codigo")}
