from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.pagination import BasePaginationRequest
from controller.tables import get_vehicles, get_owners, get_owner_basic_info, get_inventory, get_brands
from config.dbconnection import get_db
from security.deps import get_current_user

tables_router = APIRouter()

@tables_router.post('/vehicles', tags=["Tables"])
async def post_vehicles(
    pagination: BasePaginationRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return await get_vehicles(pagination, db)

@tables_router.post('/owners', tags=["Tables"])
async def post_owners(
    pagination: BasePaginationRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return await get_owners(pagination, db)

@tables_router.get('/owners/basic-info/{owner_id}', tags=["Tables"])
async def get_owner_info(
    owner_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return await get_owner_basic_info(owner_id, db)

@tables_router.post('/inventory', tags=["Tables"])
async def post_inventory(
    pagination: BasePaginationRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return await get_inventory(pagination, db)

@tables_router.get('/brands', tags=["Tables"])
async def get_all_brands(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return await get_brands(db)
