from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.core.database import get_db
from app.models import HotelRevenueSummary, NonHotelRevenueSummary
from decimal import Decimal

router = APIRouter()

# Helper function to convert Decimal to float for JSON serialization
def decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    return obj

@router.get("/hotel-revenue")
async def get_hotel_revenue(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """
    Get hotel revenue summary data filtered by date range.
    If no dates provided, returns all records.
    """
    try:
        query = db.query(HotelRevenueSummary)
        
        if start_date:
            query = query.filter(HotelRevenueSummary.report_date >= start_date)
        if end_date:
            query = query.filter(HotelRevenueSummary.report_date <= end_date)
        
        results = query.order_by(HotelRevenueSummary.hotel_id).all()
        
        # Convert results to dictionary and handle Decimal types
        data = []
        for idx, item in enumerate(results, 1):
            data.append({
                "no": idx,
                "hotelName": item.hotel_name,
                "availableRooms": item.available_rooms,
                "roomSales": item.room_sales,
                "occ": item.occupancy_rate,
                "arr": decimal_to_float(item.arr),
                "revFromNA": decimal_to_float(item.revenue_from_na),
                "totalCash": decimal_to_float(item.total_cash),
                "colection": decimal_to_float(item.collection),
                "bankDist": decimal_to_float(item.bank_distribution),
                "balance": decimal_to_float(item.balance),
                "operationalExp": decimal_to_float(item.operational_expense),
                "nonOperationalExp": decimal_to_float(item.non_operational_expense),
                "ownerReceive": decimal_to_float(item.owner_receive_expense),
                "totalExpense": decimal_to_float(item.total_expense),
                "netIncome": decimal_to_float(item.net_income),
            })
        
        return {"success": True, "data": data}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching hotel revenue: {str(e)}")

@router.get("/non-hotel-revenue")
async def get_non_hotel_revenue(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """
    Get non-hotel revenue summary data filtered by date range.
    If no dates provided, returns all records.
    """
    try:
        query = db.query(NonHotelRevenueSummary)
        
        if start_date:
            query = query.filter(NonHotelRevenueSummary.report_date >= start_date)
        if end_date:
            query = query.filter(NonHotelRevenueSummary.report_date <= end_date)
        
        results = query.order_by(NonHotelRevenueSummary.unit_id).all()
        
        # Convert results to dictionary and handle Decimal types
        data = []
        for idx, item in enumerate(results, 1):
            data.append({
                "no": idx,
                "unitName": item.unit_name,
                "revFromNA": decimal_to_float(item.revenue_from_na),
                "totalCash": decimal_to_float(item.total_cash),
                "colection": decimal_to_float(item.collection),
                "bankDist": decimal_to_float(item.bank_distribution),
                "balance": decimal_to_float(item.balance),
                "operationalExp": decimal_to_float(item.operational_expense),
                "nonOperationalExp": decimal_to_float(item.non_operational_expense),
                "ownerReceive": decimal_to_float(item.owner_receive_expense),
                "totalExpense": decimal_to_float(item.total_expense),
                "netIncome": decimal_to_float(item.net_income),
            })
        
        return {"success": True, "data": data}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching non-hotel revenue: {str(e)}")
