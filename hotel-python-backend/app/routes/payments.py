"""
Midtrans payment gateway integration.

Flow:
  1. Frontend calls POST /payments/create with a reservation id.
  2. We ask Midtrans (Snap) for a transaction token and return it.
  3. Frontend opens the Snap popup; guest pays (QRIS / VA / card / e-wallet).
  4. Midtrans calls POST /payments/webhook when the payment status changes.
  5. We verify the signature and mark the reservation paid/failed.
"""
import time
import hashlib
import logging
from decimal import Decimal

import midtransclient
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.config.config import settings
from app.tables import HotelReservation

logger = logging.getLogger(__name__)

router = APIRouter()


def _snap():
    """Build a Midtrans Snap client from settings."""
    return midtransclient.Snap(
        is_production=settings.MIDTRANS_IS_PRODUCTION,
        server_key=settings.MIDTRANS_SERVER_KEY,
        client_key=settings.MIDTRANS_CLIENT_KEY,
    )


class CreatePaymentRequest(BaseModel):
    reservation_id: int
    amount: float | None = None  # optional override; defaults to balance/payment_amount


@router.post("/create")
def create_payment(payload: CreatePaymentRequest, db: Session = Depends(get_db)):
    """Create a Midtrans Snap transaction for a reservation and return the token."""
    if not settings.MIDTRANS_SERVER_KEY:
        raise HTTPException(status_code=500, detail="Midtrans is not configured")

    reservation = db.query(HotelReservation).filter(
        HotelReservation.id == payload.reservation_id
    ).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    # Decide how much to charge: explicit amount > outstanding balance > payment_amount.
    amount = payload.amount
    if amount is None:
        balance = float(reservation.balance or 0)
        amount = balance if balance > 0 else float(reservation.payment_amount or 0)
    gross_amount = int(round(amount))
    if gross_amount <= 0:
        raise HTTPException(status_code=400, detail="Nothing to pay for this reservation")

    # Unique order id per attempt (Midtrans rejects reused order ids).
    order_id = f"RES-{reservation.id}-{int(time.time())}"

    transaction = {
        "transaction_details": {
            "order_id": order_id,
            "gross_amount": gross_amount,
        },
        "customer_details": {
            "first_name": reservation.guest_name or "Guest",
            "email": reservation.email or settings.ADMIN_EMAIL,
            "phone": reservation.mobile_phone or "",
        },
        "item_details": [
            {
                "id": reservation.reservation_no or str(reservation.id),
                "price": gross_amount,
                "quantity": 1,
                "name": f"Room {reservation.room_number or ''} - {reservation.hotel_name or 'Hotel'}"[:50],
            }
        ],
    }

    try:
        result = _snap().create_transaction(transaction)
    except Exception as e:
        logger.error(f"Midtrans create_transaction failed: {e}")
        raise HTTPException(status_code=502, detail=f"Payment gateway error: {e}")

    reservation.midtrans_order_id = order_id
    reservation.midtrans_payment_status = "pending"
    reservation.midtrans_snap_token = result.get("token")
    db.commit()

    return {
        "token": result.get("token"),
        "redirect_url": result.get("redirect_url"),
        "order_id": order_id,
        "gross_amount": gross_amount,
    }


def _verify_signature(order_id, status_code, gross_amount, signature_key) -> bool:
    """Midtrans signature = SHA512(order_id + status_code + gross_amount + server_key)."""
    raw = f"{order_id}{status_code}{gross_amount}{settings.MIDTRANS_SERVER_KEY}"
    expected = hashlib.sha512(raw.encode("utf-8")).hexdigest()
    return expected == signature_key


@router.post("/webhook")
async def midtrans_webhook(request: Request, db: Session = Depends(get_db)):
    """Receive Midtrans payment notifications and update the reservation."""
    body = await request.json()

    order_id = body.get("order_id")
    status_code = body.get("status_code")
    gross_amount = body.get("gross_amount")
    signature_key = body.get("signature_key")
    transaction_status = body.get("transaction_status")
    fraud_status = body.get("fraud_status")

    if not _verify_signature(order_id, status_code, gross_amount, signature_key):
        logger.warning(f"Midtrans webhook signature mismatch for order {order_id}")
        raise HTTPException(status_code=403, detail="Invalid signature")

    reservation = db.query(HotelReservation).filter(
        HotelReservation.midtrans_order_id == order_id
    ).first()
    if not reservation:
        logger.warning(f"Webhook for unknown order_id {order_id}")
        # Return 200 so Midtrans stops retrying a record we don't have.
        return {"status": "ignored"}

    # Map Midtrans status -> our state.
    if transaction_status in ("capture", "settlement") and fraud_status in (None, "accept"):
        reservation.midtrans_payment_status = "paid"
        reservation.transaction_status = "Confirmed"
        paid = Decimal(str(gross_amount))
        reservation.deposit = (reservation.deposit or Decimal("0")) + paid
        reservation.balance = (reservation.balance or Decimal("0")) - paid
        reservation.payment_method = "Midtrans"
    elif transaction_status == "pending":
        reservation.midtrans_payment_status = "pending"
    elif transaction_status in ("deny", "cancel", "expire"):
        reservation.midtrans_payment_status = "expired" if transaction_status == "expire" else "failed"

    db.commit()
    logger.info(f"Midtrans webhook: order {order_id} -> {transaction_status}")
    return {"status": "ok"}


@router.get("/status/{reservation_id}")
def payment_status(reservation_id: int, db: Session = Depends(get_db)):
    """Return the current Midtrans payment status for a reservation."""
    reservation = db.query(HotelReservation).filter(
        HotelReservation.id == reservation_id
    ).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return {
        "reservation_id": reservation.id,
        "order_id": reservation.midtrans_order_id,
        "payment_status": reservation.midtrans_payment_status,
        "transaction_status": reservation.transaction_status,
    }
