from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..core.database import get_db

router = APIRouter(prefix="/market-segments", tags=["market-segments"])

@router.get("/")
async def get_market_segments(db: Session = Depends(get_db)):
    """Get all active market segments with discount information."""
    try:
        result = db.execute(text("""
            SELECT id, name, discount_percentage, category, description
            FROM market_segments 
            WHERE active = TRUE 
            ORDER BY category ASC, name ASC
        """))
        market_segments = [
            {
                "id": row[0], 
                "name": row[1],
                "discount_percentage": float(row[2]) if row[2] is not None else 0.00,
                "category": row[3] if row[3] is not None else "Standard",
                "description": row[4] if row[4] is not None else ""
            } 
            for row in result.fetchall()
        ]
        return {"data": market_segments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/by-category/{category}")
async def get_market_segments_by_category(category: str, db: Session = Depends(get_db)):
    """Get market segments filtered by category (e.g., 'Walkin', 'Standard')."""
    try:
        result = db.execute(text("""
            SELECT id, name, discount_percentage, category, description
            FROM market_segments 
            WHERE active = TRUE AND category = :category
            ORDER BY discount_percentage ASC, name ASC
        """), {"category": category})
        market_segments = [
            {
                "id": row[0], 
                "name": row[1],
                "discount_percentage": float(row[2]) if row[2] is not None else 0.00,
                "category": row[3] if row[3] is not None else "Standard",
                "description": row[4] if row[4] is not None else ""
            } 
            for row in result.fetchall()
        ]
        return {"data": market_segments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/walkin")
async def get_walkin_rates(db: Session = Depends(get_db)):
    """Get all Walkin discount rates."""
    try:
        result = db.execute(text("""
            SELECT id, name, discount_percentage, description
            FROM market_segments 
            WHERE active = TRUE AND category = 'Walkin'
            ORDER BY discount_percentage ASC, name ASC
        """))
        walkin_rates = [
            {
                "id": row[0], 
                "name": row[1],
                "discount_percentage": float(row[2]) if row[2] is not None else 0.00,
                "description": row[3] if row[3] is not None else ""
            } 
            for row in result.fetchall()
        ]
        return {"data": walkin_rates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/categories")
async def get_market_segment_categories(db: Session = Depends(get_db)):
    """Get all unique market segment categories."""
    try:
        result = db.execute(text("""
            SELECT DISTINCT category 
            FROM market_segments 
            WHERE active = TRUE AND category IS NOT NULL
            ORDER BY category ASC
        """))
        categories = [row[0] for row in result.fetchall()]
        return {"data": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")