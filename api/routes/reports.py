from fastapi import APIRouter, Depends, BackgroundTasks, Query
from controller.reports import generate_sample_pdf
from security.deps import get_current_user
from typing import Optional

reports_router = APIRouter()

@reports_router.get('/sample-pdf', tags=["Reports"])
async def get_sample_pdf(
    background_tasks: BackgroundTasks,
    entity: Optional[str] = Query("vehicles", description="Tipo de catálogo: vehicles, owners, inventory"),
    current_user: dict = Depends(get_current_user)
):
    """
    Genera y descarga un reporte PDF de muestra a partir de plantillas HTML Jinja2 y pdfkit/wkhtmltopdf.
    """
    return await generate_sample_pdf(entity, current_user, background_tasks)
