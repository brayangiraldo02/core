import os
from datetime import datetime
from fastapi import BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from utils.pdf import render_template_to_pdf
from mocks.tables_data import MOCK_VEHICLES, MOCK_OWNERS, MOCK_INVENTORY

def cleanup_files(files_to_remove: list[str]):
    for file_path in files_to_remove:
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error al eliminar archivo temporal {file_path}: {e}")

async def generate_sample_pdf(entity: str, current_user: dict, background_tasks: BackgroundTasks):
    try:
        now = datetime.now()
        date_str = now.strftime("%d/%m/%Y")
        hour_str = now.strftime("%I:%M:%S %p")
        user_name = current_user.get("nombre") or current_user.get("codigo") or "Administrador"

        entity_clean = (entity or "vehicles").lower().strip()

        if entity_clean == "owners" or entity_clean == "clientes":
            title = "Reporte de Clientes y Propietarios"
            entity_name = "Catálogo de Clientes"
            columns = ["Código", "Nombre / Razón Social", "Teléfono", "Correo", "Plan Pago", "Estado"]
            rows = [
                [
                    o.get("id", ""),
                    o.get("name", ""),
                    o.get("phone", ""),
                    o.get("email", ""),
                    o.get("payment_plan", ""),
                    o.get("status", "")
                ] for o in MOCK_OWNERS
            ]
            filename = f"reporte_clientes_{now.strftime('%Y%m%d_%H%M%S')}.pdf"

        elif entity_clean == "inventory" or entity_clean == "inventario":
            title = "Reporte de Inventario de Muestra"
            entity_name = "Catálogo de Inventario y Stock"
            columns = ["Código", "Descripción", "Presentación", "Grupo", "Stock", "P. Venta", "Estado"]
            rows = [
                [
                    i.get("code", ""),
                    i.get("name", ""),
                    i.get("presentation", ""),
                    i.get("group_name", ""),
                    str(i.get("stock", 0)),
                    f"${i.get('sale_price', 0):.2f}",
                    i.get("status", "")
                ] for i in MOCK_INVENTORY
            ]
            filename = f"reporte_inventario_{now.strftime('%Y%m%d_%H%M%S')}.pdf"

        else:
            # Default: vehicles
            title = "Reporte de Flota y Vehículos"
            entity_name = "Catálogo de Vehículos"
            columns = ["Código", "Placa", "Cliente", "Tipo", "Plan Pago", "Estado GPS", "Serial GPS"]
            rows = [
                [
                    v.get("id", ""),
                    v.get("plate", ""),
                    v.get("owner_name", ""),
                    v.get("type_name", ""),
                    v.get("payment_plan", ""),
                    v.get("gps_status", ""),
                    v.get("gps_serial", "")
                ] for v in MOCK_VEHICLES
            ]
            filename = f"reporte_vehiculos_{now.strftime('%Y%m%d_%H%M%S')}.pdf"

        data_view = {
            "title": title,
            "entity_name": entity_name,
            "category": "Reporte de Muestra Core",
            "filter_applied": "Todos los registros disponibles",
            "columns": columns,
            "rows": rows,
            "total_items": len(rows),
            "date": date_str,
            "hour": hour_str,
            "user": user_name,
            "company_name": "CORE PLATFORM",
            "system_name": "SISTEMA DE GESTION"
        }

        pdf_path, temp_files = render_template_to_pdf(
            template_name="sample_report.html",
            data_view=data_view,
            title=title,
            orientation="Portrait"
        )

        temp_files.append(pdf_path)
        background_tasks.add_task(cleanup_files, temp_files)

        return FileResponse(
            path=pdf_path,
            filename=filename,
            media_type="application/pdf"
        )

    except Exception as e:
        return JSONResponse(
            content={"message": f"Error al generar reporte PDF: {str(e)}"},
            status_code=500
        )
