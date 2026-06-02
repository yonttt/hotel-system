from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db

router = APIRouter(prefix="/category-markets", tags=["category-markets"])

@router.get("/")
async def get_category_markets(db: Session = Depends(get_db)):
    """Get all active category markets."""
    try:
        result = db.execute(text("""
            SELECT id, name 
            FROM category_markets 
            WHERE active = TRUE 
            ORDER BY name ASC
        """))
        category_markets = [{"id": row[0], "name": row[1]} for row in result.fetchall()]
        return {"data": category_markets}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")