import os
import asyncio
from datetime import datetime, timedelta
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.orm import Session
from app.config.database import SessionLocal
from app.tables import HotelReservation, GroupBooking

# Ensure the upload directory exists
UPLOAD_DIR = "uploads/payment_proofs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def cleanup_old_payment_proofs():
    """Delete payment proofs older than 10 days to save space."""
    db: Session = SessionLocal()
    try:
        ten_days_ago = datetime.now() - timedelta(days=10)
        
        # Check Individual Reservations
        old_reservations = db.query(HotelReservation).filter(
            HotelReservation.payment_proof.isnot(None),
            HotelReservation.payment_proof_at <= ten_days_ago
        ).all()
        
        for res in old_reservations:
            if res.payment_proof and os.path.exists(res.payment_proof):
                try:
                    os.remove(res.payment_proof)
                    res.payment_proof = None # Clear path in DB
                except Exception as e:
                    print(f"Failed to delete {res.payment_proof}: {e}")
                    
        # Check Group Bookings
        old_groups = db.query(GroupBooking).filter(
            GroupBooking.payment_proof.isnot(None),
            GroupBooking.payment_proof_at <= ten_days_ago
        ).all()
        
        for group in old_groups:
            if group.payment_proof and os.path.exists(group.payment_proof):
                try:
                    os.remove(group.payment_proof)
                    group.payment_proof = None # Clear path in DB
                except Exception as e:
                    print(f"Failed to delete {group.payment_proof}: {e}")
                    
        db.commit()
    except Exception as e:
        print(f"Scheduler error (cleanup_old_payment_proofs): {e}")
    finally:
        db.close()

def expire_unpaid_bookings():
    """Cancel bookings that have passed their payment deadline and are still Pending."""
    db: Session = SessionLocal()
    try:
        now = datetime.now()
        
        # Expire Individual Reservations
        expired_reservations = db.query(HotelReservation).filter(
            HotelReservation.transaction_status == 'Pending',
            HotelReservation.payment_deadline < now
        ).all()
        
        for res in expired_reservations:
            res.transaction_status = 'Cancelled'
            res.note = (res.note or "") + f" [Auto-cancelled due to unpaid status at {now.strftime('%Y-%m-%d %H:%M')}]"
            
        # Expire Group Bookings
        expired_groups = db.query(GroupBooking).filter(
            GroupBooking.status == 'Pending', # or 'Active' depending on how it's handled initially
            GroupBooking.payment_deadline < now
        ).all()
        
        for group in expired_groups:
            group.status = 'Cancelled'
            group.notes = (group.notes or "") + f" [Auto-cancelled due to unpaid status at {now.strftime('%Y-%m-%d %H:%M')}]"
            
        db.commit()
    except Exception as e:
        print(f"Scheduler error (expire_unpaid_bookings): {e}")
    finally:
        db.close()

scheduler = AsyncIOScheduler()

def start_scheduler():
    # Run cleanup once a day at 2:00 AM
    scheduler.add_job(cleanup_old_payment_proofs, 'cron', hour=2, minute=0)
    
    # Run expiration check every 15 minutes
    scheduler.add_job(expire_unpaid_bookings, 'interval', minutes=15)
    
    scheduler.start()
    print("âœ… Background scheduler started for payment cleanup and booking expiration.")
