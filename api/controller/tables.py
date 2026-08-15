from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from schemas.pagination import BasePaginationRequest
from mocks.tables_data import MOCK_VEHICLES, MOCK_OWNERS, MOCK_INVENTORY, MOCK_BRANDS
from mocks.mock_service import paginate_and_search

async def get_vehicles(pagination: BasePaginationRequest, db: Session = None):
    try:
        response = paginate_and_search(
            items=MOCK_VEHICLES,
            page_number=pagination.page_number,
            page_size=pagination.page_size,
            search=pagination.search
        )
        return JSONResponse(content=jsonable_encoder(response), status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

async def get_owners(pagination: BasePaginationRequest, db: Session = None):
    try:
        response = paginate_and_search(
            items=MOCK_OWNERS,
            page_number=pagination.page_number,
            page_size=pagination.page_size,
            search=pagination.search
        )
        # Adaptar respuesta para compatibilidad con propiedad `owners` e `items`
        response["owners"] = response["items"]
        return JSONResponse(content=jsonable_encoder(response), status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

async def get_owner_basic_info(owner_id: str, db: Session = None):
    try:
        owner = next((o for o in MOCK_OWNERS if str(o["id"]) == str(owner_id)), None)
        if not owner:
            return JSONResponse(content={"message": "Cliente no encontrado"}, status_code=404)

        vehicles = [v for v in MOCK_VEHICLES if str(v.get("owner_id")) == str(owner_id)]

        response = {
            **owner,
            "vehicles": vehicles
        }
        return JSONResponse(content=jsonable_encoder(response), status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

async def get_inventory(pagination: BasePaginationRequest, db: Session = None):
    try:
        response = paginate_and_search(
            items=MOCK_INVENTORY,
            page_number=pagination.page_number,
            page_size=pagination.page_size,
            search=pagination.search
        )
        return JSONResponse(content=jsonable_encoder(response), status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

async def get_brands(db: Session = None):
    try:
        return JSONResponse(content=jsonable_encoder(MOCK_BRANDS), status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
