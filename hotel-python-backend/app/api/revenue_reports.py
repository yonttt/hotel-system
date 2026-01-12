from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func, text
from typing import List, Optional
from datetime import date
from app.core.database import get_db
from app.models import HotelRegistration, HotelReservation, GroupBooking, HotelRevenueSummary, NonHotelRevenueSummary
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
    Get hotel revenue summary data calculated from actual registrations, reservations, and group bookings.
    Groups data by hotel_name and calculates revenue metrics. Also saves to hotel_revenue_summary table.
    """
    try:
        # Get total available rooms per hotel using raw SQL
        rooms_result = db.execute(text("""
            SELECT hotel_name, COUNT(*) as total_rooms 
            FROM hotel_rooms 
            GROUP BY hotel_name
        """)).fetchall()
        
        hotel_rooms = {r[0]: r[1] for r in rooms_result if r[0]}
        
        # Build registration query with date filters (simplified - no cash/bank split)
        reg_query = db.query(
            HotelRegistration.hotel_name,
            sql_func.count(HotelRegistration.id).label('room_sales'),
            sql_func.sum(HotelRegistration.payment_amount).label('total_revenue'),
            sql_func.sum(HotelRegistration.deposit).label('total_deposit'),
            sql_func.sum(HotelRegistration.balance).label('total_balance')
        )
        
        if start_date:
            reg_query = reg_query.filter(HotelRegistration.arrival_date >= start_date)
        if end_date:
            reg_query = reg_query.filter(HotelRegistration.arrival_date <= end_date)
        
        reg_query = reg_query.filter(
            HotelRegistration.transaction_status.in_(['Check-in', 'Check-out', 'Registration'])
        )
        
        reg_results = reg_query.group_by(HotelRegistration.hotel_name).all()
        
        # Build reservation query with date filters (for confirmed/checked-in reservations)
        res_query = db.query(
            HotelReservation.hotel_name,
            sql_func.count(HotelReservation.id).label('room_sales'),
            sql_func.sum(HotelReservation.payment_amount).label('total_revenue'),
            sql_func.sum(HotelReservation.deposit).label('total_deposit'),
            sql_func.sum(HotelReservation.balance).label('total_balance')
        )
        
        if start_date:
            res_query = res_query.filter(HotelReservation.arrival_date >= start_date)
        if end_date:
            res_query = res_query.filter(HotelReservation.arrival_date <= end_date)
        
        res_query = res_query.filter(
            HotelReservation.transaction_status.in_(['Confirmed', 'Checked-in', 'Checked-out'])
        )
        
        res_results = res_query.group_by(HotelReservation.hotel_name).all()
        
        # Build group booking query with date filters
        gb_query = db.query(
            GroupBooking.hotel_name,
            sql_func.sum(GroupBooking.total_rooms).label('room_sales'),
            sql_func.sum(GroupBooking.total_amount).label('total_revenue'),
            sql_func.sum(GroupBooking.total_deposit).label('total_deposit'),
            sql_func.sum(GroupBooking.total_balance).label('total_balance')
        )
        
        if start_date:
            gb_query = gb_query.filter(GroupBooking.arrival_date >= start_date)
        if end_date:
            gb_query = gb_query.filter(GroupBooking.arrival_date <= end_date)
        
        gb_query = gb_query.filter(
            GroupBooking.status.in_(['Active', 'Confirmed', 'Checked-in', 'Checked-out'])
        )
        
        gb_results = gb_query.group_by(GroupBooking.hotel_name).all()
        
        # Combine results from registrations, reservations, and group bookings
        hotel_data = {}
        
        # Process registration data
        for reg in reg_results:
            hotel_name = reg.hotel_name or 'Hotel New Idola'
            if hotel_name not in hotel_data:
                hotel_data[hotel_name] = {
                    'room_sales': 0,
                    'total_revenue': Decimal('0'),
                    'total_deposit': Decimal('0'),
                    'total_balance': Decimal('0')
                }
            hotel_data[hotel_name]['room_sales'] += reg.room_sales or 0
            hotel_data[hotel_name]['total_revenue'] += reg.total_revenue or Decimal('0')
            hotel_data[hotel_name]['total_deposit'] += reg.total_deposit or Decimal('0')
            hotel_data[hotel_name]['total_balance'] += reg.total_balance or Decimal('0')
        
        # Process reservation data
        for res in res_results:
            hotel_name = res.hotel_name or 'Hotel New Idola'
            if hotel_name not in hotel_data:
                hotel_data[hotel_name] = {
                    'room_sales': 0,
                    'total_revenue': Decimal('0'),
                    'total_deposit': Decimal('0'),
                    'total_balance': Decimal('0')
                }
            hotel_data[hotel_name]['room_sales'] += res.room_sales or 0
            hotel_data[hotel_name]['total_revenue'] += res.total_revenue or Decimal('0')
            hotel_data[hotel_name]['total_deposit'] += res.total_deposit or Decimal('0')
            hotel_data[hotel_name]['total_balance'] += res.total_balance or Decimal('0')
        
        # Process group booking data
        for gb in gb_results:
            hotel_name = gb.hotel_name or 'Hotel New Idola'
            if hotel_name not in hotel_data:
                hotel_data[hotel_name] = {
                    'room_sales': 0,
                    'total_revenue': Decimal('0'),
                    'total_deposit': Decimal('0'),
                    'total_balance': Decimal('0')
                }
            hotel_data[hotel_name]['room_sales'] += gb.room_sales or 0
            hotel_data[hotel_name]['total_revenue'] += gb.total_revenue or Decimal('0')
            hotel_data[hotel_name]['total_deposit'] += gb.total_deposit or Decimal('0')
            hotel_data[hotel_name]['total_balance'] += gb.total_balance or Decimal('0')
        
        # Format response data and save to database
        data = []
        report_date = date.today()
        
        for idx, (hotel_name, metrics) in enumerate(sorted(hotel_data.items()), 1):
            available_rooms = hotel_rooms.get(hotel_name, 0)
            room_sales = int(metrics['room_sales']) if isinstance(metrics['room_sales'], Decimal) else metrics['room_sales']
            total_revenue = metrics['total_revenue']
            total_deposit = metrics['total_deposit']
            total_balance = metrics['total_balance']
            
            # Calculate occupancy rate
            occ_percentage = round((room_sales / available_rooms * 100) if available_rooms > 0 else 0)
            occ_rate = f"{occ_percentage}%"
            
            # Calculate ARR (Average Room Rate)
            arr = total_revenue / room_sales if room_sales > 0 else Decimal('0')
            
            # Collection = total revenue - balance (unpaid)
            collection = total_revenue - total_balance
            
            # Net income = collection (paid amount)
            net_income = collection
            
            # Save or update in hotel_revenue_summary table
            existing_summary = db.query(HotelRevenueSummary).filter(
                HotelRevenueSummary.hotel_name == hotel_name,
                HotelRevenueSummary.report_date == report_date
            ).first()
            
            if existing_summary:
                # Update existing record
                existing_summary.available_rooms = available_rooms
                existing_summary.room_sales = room_sales
                existing_summary.occupancy_rate = occ_rate
                existing_summary.arr = arr
                existing_summary.revenue_from_na = total_revenue
                existing_summary.total_cash = total_revenue
                existing_summary.collection = collection
                existing_summary.bank_distribution = total_deposit
                existing_summary.balance = total_balance
                existing_summary.net_income = net_income
            else:
                # Create new record
                new_summary = HotelRevenueSummary(
                    hotel_id=idx,
                    hotel_name=hotel_name,
                    report_date=report_date,
                    available_rooms=available_rooms,
                    room_sales=room_sales,
                    occupancy_rate=occ_rate,
                    arr=arr,
                    revenue_from_na=total_revenue,
                    total_cash=total_revenue,
                    collection=collection,
                    bank_distribution=total_deposit,
                    balance=total_balance,
                    operational_expense=Decimal('0'),
                    non_operational_expense=Decimal('0'),
                    owner_receive_expense=Decimal('0'),
                    total_expense=Decimal('0'),
                    net_income=net_income
                )
                db.add(new_summary)
            
            data.append({
                "no": idx,
                "hotelName": hotel_name,
                "availableRooms": available_rooms,
                "roomSales": room_sales,
                "occ": occ_rate,
                "arr": decimal_to_float(arr),
                "revFromNA": decimal_to_float(total_revenue),
                "totalCash": decimal_to_float(total_revenue),
                "colection": decimal_to_float(collection),
                "bankDist": decimal_to_float(total_deposit),
                "balance": decimal_to_float(total_balance),
                "operationalExp": 0,
                "nonOperationalExp": 0,
                "ownerReceive": 0,
                "totalExpense": 0,
                "netIncome": decimal_to_float(net_income),
            })
        
        # Commit the changes to database
        db.commit()
        
        return {"success": True, "data": data}
    
    except Exception as e:
        db.rollback()
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
