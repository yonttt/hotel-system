from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, rooms, guests, reservations
from app.core.config import settings

app = FastAPI(
    title="Hotel Management System API",
    description="Modern Python API for Eva Group Hotel Management System",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # React dev server (prioritize 5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(rooms.router, prefix="/api/rooms", tags=["rooms"])
app.include_router(guests.router, prefix="/api/guests", tags=["guests"])
app.include_router(reservations.router, prefix="/api/reservations", tags=["reservations"])

@app.get("/")
def read_root():
    return {"message": "Hotel Management System API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "hotel-management-api"}

@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    try:
        from app.core.database import engine
        from app.models import Base
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"⚠️ Database initialization failed: {e}")
        print("API will still work but database operations may fail")

@app.get("/")
async def root():
    return {
        "message": "Eva Group Hotel Management System API",
        "version": "2.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}