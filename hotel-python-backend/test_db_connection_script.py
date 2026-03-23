from sqlalchemy import create_engine, text
import os
import sys
from dotenv import load_dotenv

print("Starting database connection test...")
print(f"Python executable: {sys.executable}")

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL not found in environment variables.")
    exit(1)

print(f"Connecting to database using URL: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Database connection successfully established!")
        print(f"Result of 'SELECT 1': {result.fetchone()[0]}")
except Exception as e:
    print(f"Failed to connect to the database: {e}")
