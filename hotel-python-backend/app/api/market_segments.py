from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db

router = APIRouter(prefix="/market-segments", tags=["market-segments"])

@router.get("/")
async def get_market_segments(db: Session = Depends(get_db)):
    """Get all active market segments."""
    try:
        result = db.execute(text("""
            SELECT id, name 
            FROM market_segments 
            WHERE active = TRUE 
            ORDER BY name ASC
        """))
        market_segments = [{"id": row[0], "name": row[1]} for row in result.fetchall()]
        return {"data": market_segments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")