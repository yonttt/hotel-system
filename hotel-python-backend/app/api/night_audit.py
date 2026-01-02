from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from datetime import datetime, date
from pydantic import BaseModel
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models import User

router = APIRouter()

# Pydantic schemas for night audit
class NightAuditCreate(BaseModel):
    audit_date: date
    hotel_name: Optional[str] = 'HOTEL NEW IDOLA'
    room_number: Optional[str] = None
    registration_id: Optional[int] = None
    registration_no: Optional[str] = None
    guest_name: Optional[str] = None
    extra_bed: Optional[float] = 0
    extra_bill: Optional[float] = 0
    late_charge: Optional[float] = 0
    discount: Optional[float] = 0
    meeting_room: Optional[float] = 0
    add_meeting_room: Optional[float] = 0
    cash: Optional[float] = 0
    debet: Optional[float] = 0
    transfer: Optional[float] = 0
    voucher: Optional[float] = 0
    creditcard: Optional[float] = 0
    guest_ledger_minus: Optional[float] = 0
    guest_ledger_plus: Optional[float] = 0
    notes: Optional[str] = None

class NightAuditResponse(BaseModel):
    id: int
    audit_date: date
    hotel_name: Optional[str] = None
    room_number: Optional[str] = None
    registration_id: Optional[int] = None
    registration_no: Optional[str] = None
    guest_name: Optional[str] = None
    extra_bed: Optional[float] = 0
    extra_bill: Optional[float] = 0
    late_charge: Optional[float] = 0
    discount: Optional[float] = 0
    meeting_room: Optional[float] = 0
    add_meeting_room: Optional[float] = 0
    cash: Optional[float] = 0
    debet: Optional[float] = 0
    transfer: Optional[float] = 0
    voucher: Optional[float] = 0
    creditcard: Optional[float] = 0
    guest_ledger_minus: Optional[float] = 0
    guest_ledger_plus: Optional[float] = 0
    total_revenue: Optional[float] = 0
    total_payment: Optional[float] = 0
    notes: Optional[str] = None
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class NightAuditUpdate(BaseModel):
    room_number: Optional[str] = None
    guest_name: Optional[str] = None
    extra_bed: Optional[float] = None
    extra_bill: Optional[float] = None
    late_charge: Optional[float] = None
    discount: Optional[float] = None
    meeting_room: Optional[float] = None
    add_meeting_room: Optional[float] = None
    cash: Optional[float] = None
    debet: Optional[float] = None
    transfer: Optional[float] = None
    voucher: Optional[float] = None
    creditcard: Optional[float] = None
    guest_ledger_minus: Optional[float] = None
    guest_ledger_plus: Optional[float] = None
    notes: Optional[str] = None


@router.get("/", response_model=List[NightAuditResponse])
def get_night_audits(
    skip: int = 0,
    limit: int = 100,
    audit_date: Optional[date] = None,
    hotel_name: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all night audit records with optional filters."""
    try:
        query = """
            SELECT 
                id, audit_date, hotel_name, room_number, registration_id, registration_no,
                guest_name, extra_bed, extra_bill, late_charge, discount, meeting_room,
                add_meeting_room, cash, debet, transfer, voucher, creditcard,
                guest_ledger_minus, guest_ledger_plus, total_revenue, total_payment,
                notes, created_by, created_at
            FROM night_audit
            WHERE 1=1
        """
        params = {}
        
        if audit_date:
            query += " AND audit_date = :audit_date"
            params["audit_date"] = audit_date
            
        if hotel_name and hotel_name != 'ALL':
            query += " AND hotel_name = :hotel_name"
            params["hotel_name"] = hotel_name
            
        query += " ORDER BY audit_date DESC, room_number ASC LIMIT :limit OFFSET :skip"
        params["limit"] = limit
        params["skip"] = skip
        
        result = db.execute(text(query), params)
        rows = result.fetchall()
        
        audits = []
        for row in rows:
            audits.append({
                "id": row[0],
                "audit_date": row[1],
                "hotel_name": row[2],
                "room_number": row[3],
                "registration_id": row[4],
                "registration_no": row[5],
                "guest_name": row[6],
                "extra_bed": float(row[7] or 0),
                "extra_bill": float(row[8] or 0),
                "late_charge": float(row[9] or 0),
                "discount": float(row[10] or 0),
                "meeting_room": float(row[11] or 0),
                "add_meeting_room": float(row[12] or 0),
                "cash": float(row[13] or 0),
                "debet": float(row[14] or 0),
                "transfer": float(row[15] or 0),
                "voucher": float(row[16] or 0),
                "creditcard": float(row[17] or 0),
                "guest_ledger_minus": float(row[18] or 0),
                "guest_ledger_plus": float(row[19] or 0),
                "total_revenue": float(row[20] or 0),
                "total_payment": float(row[21] or 0),
                "notes": row[22],
                "created_by": row[23],
                "created_at": row[24]
            })
        
        return audits
        
    except Exception as e:
        print(f"Error fetching night audits: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching night audits: {str(e)}"
        )


@router.get("/{audit_id}", response_model=NightAuditResponse)
def get_night_audit(
    audit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a single night audit record by ID."""
    try:
        result = db.execute(
            text("""
                SELECT 
                    id, audit_date, hotel_name, room_number, registration_id, registration_no,
                    guest_name, extra_bed, extra_bill, late_charge, discount, meeting_room,
                    add_meeting_room, cash, debet, transfer, voucher, creditcard,
                    guest_ledger_minus, guest_ledger_plus, total_revenue, total_payment,
                    notes, created_by, created_at
                FROM night_audit
                WHERE id = :id
            """),
            {"id": audit_id}
        )
        row = result.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Night audit record not found")
        
        return {
            "id": row[0],
            "audit_date": row[1],
            "hotel_name": row[2],
            "room_number": row[3],
            "registration_id": row[4],
            "registration_no": row[5],
            "guest_name": row[6],
            "extra_bed": float(row[7] or 0),
            "extra_bill": float(row[8] or 0),
            "late_charge": float(row[9] or 0),
            "discount": float(row[10] or 0),
            "meeting_room": float(row[11] or 0),
            "add_meeting_room": float(row[12] or 0),
            "cash": float(row[13] or 0),
            "debet": float(row[14] or 0),
            "transfer": float(row[15] or 0),
            "voucher": float(row[16] or 0),
            "creditcard": float(row[17] or 0),
            "guest_ledger_minus": float(row[18] or 0),
            "guest_ledger_plus": float(row[19] or 0),
            "total_revenue": float(row[20] or 0),
            "total_payment": float(row[21] or 0),
            "notes": row[22],
            "created_by": row[23],
            "created_at": row[24]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching night audit: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching night audit: {str(e)}"
        )


@router.post("/", response_model=NightAuditResponse)
def create_night_audit(
    audit_data: NightAuditCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new night audit record."""
    try:
        # Calculate totals
        total_revenue = (
            (audit_data.extra_bed or 0) +
            (audit_data.extra_bill or 0) +
            (audit_data.late_charge or 0) +
            (audit_data.meeting_room or 0) +
            (audit_data.add_meeting_room or 0) +
            (audit_data.guest_ledger_plus or 0) -
            (audit_data.discount or 0) -
            (audit_data.guest_ledger_minus or 0)
        )
        
        total_payment = (
            (audit_data.cash or 0) +
            (audit_data.debet or 0) +
            (audit_data.transfer or 0) +
            (audit_data.voucher or 0) +
            (audit_data.creditcard or 0)
        )
        
        db.execute(
            text("""
                INSERT INTO night_audit (
                    audit_date, hotel_name, room_number, registration_id, registration_no,
                    guest_name, extra_bed, extra_bill, late_charge, discount, meeting_room,
                    add_meeting_room, cash, debet, transfer, voucher, creditcard,
                    guest_ledger_minus, guest_ledger_plus, total_revenue, total_payment,
                    notes, created_by
                ) VALUES (
                    :audit_date, :hotel_name, :room_number, :registration_id, :registration_no,
                    :guest_name, :extra_bed, :extra_bill, :late_charge, :discount, :meeting_room,
                    :add_meeting_room, :cash, :debet, :transfer, :voucher, :creditcard,
                    :guest_ledger_minus, :guest_ledger_plus, :total_revenue, :total_payment,
                    :notes, :created_by
                )
            """),
            {
                "audit_date": audit_data.audit_date,
                "hotel_name": audit_data.hotel_name or 'HOTEL NEW IDOLA',
                "room_number": audit_data.room_number,
                "registration_id": audit_data.registration_id,
                "registration_no": audit_data.registration_no,
                "guest_name": audit_data.guest_name,
                "extra_bed": audit_data.extra_bed or 0,
                "extra_bill": audit_data.extra_bill or 0,
                "late_charge": audit_data.late_charge or 0,
                "discount": audit_data.discount or 0,
                "meeting_room": audit_data.meeting_room or 0,
                "add_meeting_room": audit_data.add_meeting_room or 0,
                "cash": audit_data.cash or 0,
                "debet": audit_data.debet or 0,
                "transfer": audit_data.transfer or 0,
                "voucher": audit_data.voucher or 0,
                "creditcard": audit_data.creditcard or 0,
                "guest_ledger_minus": audit_data.guest_ledger_minus or 0,
                "guest_ledger_plus": audit_data.guest_ledger_plus or 0,
                "total_revenue": total_revenue,
                "total_payment": total_payment,
                "notes": audit_data.notes,
                "created_by": current_user.username
            }
        )
        db.commit()
        
        # Get the created record
        result = db.execute(text("SELECT LAST_INSERT_ID()"))
        new_id = result.scalar()
        
        return get_night_audit(new_id, db, current_user)
        
    except Exception as e:
        db.rollback()
        print(f"Error creating night audit: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating night audit: {str(e)}"
        )


@router.put("/{audit_id}", response_model=NightAuditResponse)
def update_night_audit(
    audit_id: int,
    audit_data: NightAuditUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing night audit record."""
    try:
        # Check if record exists
        existing = db.execute(
            text("SELECT id FROM night_audit WHERE id = :id"),
            {"id": audit_id}
        ).fetchone()
        
        if not existing:
            raise HTTPException(status_code=404, detail="Night audit record not found")
        
        # Build update query dynamically
        update_fields = []
        params = {"id": audit_id}
        
        for field, value in audit_data.dict(exclude_unset=True).items():
            if value is not None:
                update_fields.append(f"{field} = :{field}")
                params[field] = value
        
        if update_fields:
            # Recalculate totals
            current = get_night_audit(audit_id, db, current_user)
            
            extra_bed = audit_data.extra_bed if audit_data.extra_bed is not None else current.get('extra_bed', 0)
            extra_bill = audit_data.extra_bill if audit_data.extra_bill is not None else current.get('extra_bill', 0)
            late_charge = audit_data.late_charge if audit_data.late_charge is not None else current.get('late_charge', 0)
            discount = audit_data.discount if audit_data.discount is not None else current.get('discount', 0)
            meeting_room = audit_data.meeting_room if audit_data.meeting_room is not None else current.get('meeting_room', 0)
            add_meeting_room = audit_data.add_meeting_room if audit_data.add_meeting_room is not None else current.get('add_meeting_room', 0)
            cash = audit_data.cash if audit_data.cash is not None else current.get('cash', 0)
            debet = audit_data.debet if audit_data.debet is not None else current.get('debet', 0)
            transfer = audit_data.transfer if audit_data.transfer is not None else current.get('transfer', 0)
            voucher = audit_data.voucher if audit_data.voucher is not None else current.get('voucher', 0)
            creditcard = audit_data.creditcard if audit_data.creditcard is not None else current.get('creditcard', 0)
            guest_ledger_minus = audit_data.guest_ledger_minus if audit_data.guest_ledger_minus is not None else current.get('guest_ledger_minus', 0)
            guest_ledger_plus = audit_data.guest_ledger_plus if audit_data.guest_ledger_plus is not None else current.get('guest_ledger_plus', 0)
            
            total_revenue = extra_bed + extra_bill + late_charge + meeting_room + add_meeting_room + guest_ledger_plus - discount - guest_ledger_minus
            total_payment = cash + debet + transfer + voucher + creditcard
            
            update_fields.append("total_revenue = :total_revenue")
            update_fields.append("total_payment = :total_payment")
            params["total_revenue"] = total_revenue
            params["total_payment"] = total_payment
            
            query = f"UPDATE night_audit SET {', '.join(update_fields)}, updated_at = NOW() WHERE id = :id"
            db.execute(text(query), params)
            db.commit()
        
        return get_night_audit(audit_id, db, current_user)
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error updating night audit: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error updating night audit: {str(e)}"
        )


@router.delete("/{audit_id}")
def delete_night_audit(
    audit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a night audit record."""
    try:
        # Check if record exists
        existing = db.execute(
            text("SELECT id, room_number FROM night_audit WHERE id = :id"),
            {"id": audit_id}
        ).fetchone()
        
        if not existing:
            raise HTTPException(status_code=404, detail="Night audit record not found")
        
        db.execute(
            text("DELETE FROM night_audit WHERE id = :id"),
            {"id": audit_id}
        )
        db.commit()
        
        return {
            "success": True,
            "message": f"Night audit record for room {existing[1]} deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting night audit: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting night audit: {str(e)}"
        )
