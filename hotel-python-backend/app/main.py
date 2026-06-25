import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi.errors import RateLimitExceeded
from app.routes import auth, users, hotel_rooms, room_pricing, guests, hotel_registrations, hotel_reservations, cities, nationalities, category_markets, market_segments, payment_methods, group_bookings, revenue_reports, master_data, room_rates, master_meja, kategori_menu_resto, checkin, checkout, night_audit, properties, laundry, account_receivable, adjustments, chatbot, public_website, cms, payments
from app.config.security_middleware import (
    limiter,
    SecurityHeadersMiddleware,
    LoginProtectionMiddleware,
    rate_limit_exceeded_handler
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup/shutdown. Initializes DB tables and the background scheduler."""
    # --- Startup ---
    try:
        from app.config.database import engine, ensure_payment_columns
        from app.tables import Base
        Base.metadata.create_all(bind=engine)
        ensure_payment_columns()
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        logger.error("API will still work but database operations may fail")

    try:
        from app.config.scheduler import start_scheduler
        start_scheduler()
    except Exception as e:
        logger.error(f"Background scheduler failed to start: {e}")

    yield
    # --- Shutdown (nothing to clean up currently) ---


# In production set ENVIRONMENT=production in the server's .env. This hides the
# interactive API docs (/docs, /redoc) so the full API surface isn't public.
# Locally it stays unset, so the docs work exactly as before.
IS_PRODUCTION = os.getenv("ENVIRONMENT", "development").lower() == "production"

app = FastAPI(
    title="Hotel Management System API",
    description="Modern Python API for Eva Group Hotel Management System",
    version="2.0.0",
    docs_url=None if IS_PRODUCTION else "/docs",   # Swagger UI (hidden in production)
    redoc_url=None if IS_PRODUCTION else "/redoc",  # ReDoc (hidden in production)
    lifespan=lifespan
)

# Add rate limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# Add Security Middlewares (order matters - first added = last executed)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(LoginProtectionMiddleware)

# Configure CORS with more specific settings
# For production, replace with your actual domain(s)
ALLOWED_ORIGINS = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    # Add production domains here:
    # "https://your-hotel-domain.com",
]

# Production domains come from the server's .env so you never have to edit code.
# Single domain:   FRONTEND_URL=https://yourhotel.com
# Multiple domains: CORS_ORIGINS=https://yourhotel.com,https://admin.yourhotel.com
FRONTEND_URL = os.getenv("FRONTEND_URL")
if FRONTEND_URL:
    ALLOWED_ORIGINS.append(FRONTEND_URL.strip())

CORS_ORIGINS = os.getenv("CORS_ORIGINS")
if CORS_ORIGINS:
    ALLOWED_ORIGINS.extend(
        origin.strip() for origin in CORS_ORIGINS.split(",") if origin.strip()
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"],
    expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
)

# Serve uploaded files (payment proofs, etc.) so the frontend can display them directly
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Hotel Management System API is running"}

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(hotel_rooms.router, prefix="/hotel-rooms", tags=["hotel-rooms"])
app.include_router(room_pricing.router, prefix="/room-pricing", tags=["room-pricing"])
app.include_router(guests.router, prefix="/guests", tags=["guests"])
app.include_router(hotel_registrations.router, prefix="/hotel-registrations", tags=["hotel-registrations"])
app.include_router(hotel_reservations.router, prefix="/hotel-reservations", tags=["hotel-reservations"])
app.include_router(group_bookings.router, prefix="", tags=["group-bookings"])
app.include_router(cities.router, prefix="", tags=["cities"])
app.include_router(nationalities.router, prefix="", tags=["countries"])
app.include_router(category_markets.router, prefix="", tags=["category-markets"])
app.include_router(market_segments.router, prefix="", tags=["market-segments"])
app.include_router(payment_methods.router, prefix="", tags=["payment-methods"])
app.include_router(revenue_reports.router, prefix="/revenue-reports", tags=["revenue-reports"])
app.include_router(master_data.router, prefix="/master-data", tags=["master-data"])
app.include_router(room_rates.router, prefix="/room-rates", tags=["room-rates"])
app.include_router(master_meja.router, prefix="", tags=["master-meja"])
app.include_router(kategori_menu_resto.router, prefix="", tags=["kategori-menu-resto"])
app.include_router(checkin.router, prefix="/checkin", tags=["checkin"])
app.include_router(checkout.router, prefix="/checkout", tags=["checkout"])
app.include_router(night_audit.router, prefix="/night-audit", tags=["night-audit"])
app.include_router(properties.router, prefix="/properties", tags=["properties"])
app.include_router(laundry.router, prefix="", tags=["laundry"])
app.include_router(account_receivable.router, prefix="", tags=["account-receivable"])
app.include_router(adjustments.router, prefix="", tags=["adjustments"])
app.include_router(chatbot.router, prefix="/chatbot", tags=["chatbot"])
app.include_router(public_website.router, prefix="/public", tags=["public-website"])
app.include_router(cms.router, prefix="/cms", tags=["cms"])
app.include_router(payments.router, prefix="/payments", tags=["payments"])

from fastapi.responses import RedirectResponse

@app.get("/")
async def root():
    # Redirect root directly to Swagger UI so it's easier to access
    return RedirectResponse(url="/docs")
