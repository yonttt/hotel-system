from app.core.database import get_db_connection

def seed_payment_methods():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    payments = [
        ('Cash', 'cash', 1),
        ('Credit Card', 'card', 1),
        ('Debit Card', 'card', 1),
        ('Bank Transfer', 'transfer', 1),
        ('City Ledger', 'other', 1),
        ('QRIS', 'digital', 1)
    ]
    
    try:
        cursor.executemany(
            "INSERT INTO payment_methods (name, type, active) VALUES (%s, %s, %s)",
            payments
        )
        conn.commit()
        print("Payment methods inserted successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    seed_payment_methods()
