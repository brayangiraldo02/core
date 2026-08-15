from typing import List, Dict, Any, Optional

def paginate_and_search(
    items: List[Dict[str, Any]],
    page_number: int = 1,
    page_size: int = 10,
    search: Optional[str] = None
) -> Dict[str, Any]:
    """
    Función utilitaria genérica que filtra y pagina cualquier lista de diccionarios en memoria.
    """
    if page_number < 1:
        page_number = 1
    if page_size < 1:
        page_size = 10

    filtered_items = items

    if search and search.strip():
        search_term = search.strip().lower()

        def matches(item: Dict[str, Any]) -> bool:
            for val in item.values():
                if val is not None and search_term in str(val).lower():
                    return True
            return False

        filtered_items = [item for item in items if matches(item)]

    total_items = len(filtered_items)
    total_pages = (total_items + page_size - 1) // page_size if total_items > 0 else 0

    offset = (page_number - 1) * page_size
    paged_items = filtered_items[offset : offset + page_size]

    return {
        "page_number": page_number,
        "page_size": page_size,
        "total_items": total_items,
        "total_pages": total_pages,
        "items": paged_items
    }
