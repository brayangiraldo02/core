from pydantic import BaseModel
from typing import Optional

class BasePaginationRequest(BaseModel):
    page_number: int = 1
    page_size: int = 10
    search: Optional[str] = None
