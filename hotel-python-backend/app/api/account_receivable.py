from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from app.core.database import get_db_connection
from app.core.auth import get_current_user

router = APIRouter(prefix="/account-receivable", tags=["Account Receivable"])


# Pydantic models
class AccountReceivableBase(BaseModel):
    hotel_name: Optional[str] = None
    invoice_no: Optional[str] = None
    guest_name: Optional[str] = None
    room_number: Optional[str] = None
    registration_no: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = 0
    paid_amount: Optional[float] = 0
    balance: Optional[float] = 0
    due_date: Optional[date] = None
    status: Optional[str] = "Outstanding"
    payment_method: Optional[str] = None
    notes: Optional[str] = None


class AccountReceivableCreate(AccountReceivableBase):
    pass


class AccountReceivableUpdate(BaseModel):
    hotel_name: Optional[str] = None
    invoice_no: Optional[str] = None
    guest_name: Optional[str] = None
    room_number: Optional[str] = None
    registration_no: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    paid_amount: Optional[float] = None
    balance: Optional[float] = None
    due_date: Optional[date] = None
    status: Optional[str] = None
    payment_method: Optional[str] = None
    notes: Optional[str] = None


class AccountReceivableResponse(AccountReceivableBase):
    id: int
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


def ensure_table_exists(connection):
    """Create account_receivables table if not exists"""
    cursor = connection.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS account_receivables (
            id INT AUTO_INCREMENT PRIMARY KEY,
            hotel_name VARCHAR(255) DEFAULT NULL,
            invoice_no VARCHAR(50) DEFAULT NULL,
            guest_name VARCHAR(255) DEFAULT NULL,
            room_number VARCHAR(20) DEFAULT NULL,
            registration_no VARCHAR(50) DEFAULT NULL,
            description TEXT DEFAULT NULL,
            amount DECIMAL(15,2) DEFAULT 0,
            paid_amount DECIMAL(15,2) DEFAULT 0,
            balance DECIMAL(15,2) DEFAULT 0,
            due_date DATE DEFAULT NULL,
            status VARCHAR(50) DEFAULT 'Outstanding',
            payment_method VARCHAR(100) DEFAULT NULL,
            notes TEXT DEFAULT NULL,
            created_by VARCHAR(100) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_hotel (hotel_name),
            INDEX idx_status (status),
            INDEX idx_due_date (due_date),
            INDEX idx_invoice (invoice_no),
            INDEX idx_guest (guest_name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)
    connection.commit()
    cursor.close()


@router.get("/next-invoice")
async def get_next_invoice_number(
    current_user: dict = Depends(get_current_user)
):
    """Get the next invoice number"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        today = date.today()
        prefix = f"INV-{today.strftime('%Y%m%d')}"

        cursor.execute(
            "SELECT invoice_no FROM account_receivables WHERE invoice_no LIKE %s ORDER BY id DESC LIMIT 1",
            (f"{prefix}%",)
        )
        last = cursor.fetchone()

        if last and last['invoice_no']:
            try:
                num = int(last['invoice_no'].split('-')[-1]) + 1
            except (ValueError, IndexError):
                num = 1
        else:
            num = 1

        cursor.close()
        connection.close()

        return {"next_invoice_no": f"{prefix}-{num:04d}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating invoice number: {str(e)}")


@router.get("/", response_model=List[AccountReceivableResponse])
async def get_account_receivables(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    hotel_name: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all account receivables with optional filtering"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        query = "SELECT * FROM account_receivables WHERE 1=1"
        params = []

        if hotel_name and hotel_name != 'ALL':
            query += " AND hotel_name = %s"
            params.append(hotel_name)

        if status:
            query += " AND status = %s"
            params.append(status)

        if start_date:
            query += " AND due_date >= %s"
            params.append(start_date)

        if end_date:
            query += " AND due_date <= %s"
            params.append(end_date)

        query += " ORDER BY id DESC LIMIT %s OFFSET %s"
        params.extend([limit, skip])

        cursor.execute(query, params)
        records = cursor.fetchall()

        cursor.close()
        connection.close()

        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching account receivables: {str(e)}")


@router.get("/{ar_id}", response_model=AccountReceivableResponse)
async def get_account_receivable(
    ar_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific account receivable by ID"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM account_receivables WHERE id = %s", (ar_id,))
        record = cursor.fetchone()

        cursor.close()
        connection.close()

        if not record:
            raise HTTPException(status_code=404, detail="Account receivable not found")

        return record
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching account receivable: {str(e)}")


@router.post("/", response_model=AccountReceivableResponse)
async def create_account_receivable(
    ar: AccountReceivableCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new account receivable"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        balance = (ar.amount or 0) - (ar.paid_amount or 0)

        cursor.execute("""
            INSERT INTO account_receivables
            (hotel_name, invoice_no, guest_name, room_number, registration_no,
             description, amount, paid_amount, balance, due_date, status,
             payment_method, notes, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            ar.hotel_name, ar.invoice_no, ar.guest_name, ar.room_number,
            ar.registration_no, ar.description, ar.amount, ar.paid_amount,
            balance, ar.due_date, ar.status, ar.payment_method, ar.notes,
            current_user.get('username', current_user.get('sub', 'system'))
        ))

        connection.commit()
        new_id = cursor.lastrowid

        cursor.execute("SELECT * FROM account_receivables WHERE id = %s", (new_id,))
        new_record = cursor.fetchone()

        cursor.close()
        connection.close()

        return new_record
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating account receivable: {str(e)}")


@router.put("/{ar_id}", response_model=AccountReceivableResponse)
async def update_account_receivable(
    ar_id: int,
    ar: AccountReceivableUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update an account receivable"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM account_receivables WHERE id = %s", (ar_id,))
        existing = cursor.fetchone()
        if not existing:
            cursor.close()
            connection.close()
            raise HTTPException(status_code=404, detail="Account receivable not found")

        update_data = ar.dict(exclude_unset=True)

        # Auto-calculate balance if amount or paid_amount changed
        if 'amount' in update_data or 'paid_amount' in update_data:
            amount = update_data.get('amount', existing['amount'])
            paid = update_data.get('paid_amount', existing['paid_amount'])
            update_data['balance'] = float(amount or 0) - float(paid or 0)
            # Auto-update status
            if update_data['balance'] <= 0:
                update_data['status'] = 'Paid'
            elif float(paid or 0) > 0:
                update_data['status'] = 'Partial'

        update_fields = []
        update_values = []
        for field, value in update_data.items():
            update_fields.append(f"{field} = %s")
            update_values.append(value)

        if not update_fields:
            cursor.close()
            connection.close()
            raise HTTPException(status_code=400, detail="No fields to update")

        update_values.append(ar_id)
        query = f"UPDATE account_receivables SET {', '.join(update_fields)} WHERE id = %s"
        cursor.execute(query, update_values)
        connection.commit()

        cursor.execute("SELECT * FROM account_receivables WHERE id = %s", (ar_id,))
        updated = cursor.fetchone()

        cursor.close()
        connection.close()

        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating account receivable: {str(e)}")


@router.delete("/{ar_id}")
async def delete_account_receivable(
    ar_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Delete an account receivable"""
    try:
        connection = get_db_connection()
        ensure_table_exists(connection)
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM account_receivables WHERE id = %s", (ar_id,))
        existing = cursor.fetchone()
        if not existing:
            cursor.close()
            connection.close()
            raise HTTPException(status_code=404, detail="Account receivable not found")

        cursor.execute("DELETE FROM account_receivables WHERE id = %s", (ar_id,))
        connection.commit()

        cursor.close()
        connection.close()

        return {"message": "Account receivable deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting account receivable: {str(e)}")
