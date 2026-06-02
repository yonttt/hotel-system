"""
Security Middleware for Hotel Management System
Implements rate limiting, security headers, and other protections
"""
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time
import logging

logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

# Track failed login attempts (in-memory, for production use Redis)
failed_login_attempts = {}
LOGIN_ATTEMPT_LIMIT = 5
LOGIN_LOCKOUT_TIME = 900  # 15 minutes in seconds


def check_login_attempts(ip_address: str) -> tuple[bool, int]:
    """
    Check if IP is locked out due to too many failed attempts.
    Returns (is_allowed, remaining_lockout_seconds)
    """
    if ip_address not in failed_login_attempts:
        return True, 0
    
    attempts, lockout_until = failed_login_attempts[ip_address]
    current_time = time.time()
    
    if lockout_until and current_time < lockout_until:
        remaining = int(lockout_until - current_time)
        return False, remaining
    
    # Reset if lockout has expired
    if lockout_until and current_time >= lockout_until:
        del failed_login_attempts[ip_address]
        return True, 0
    
    return True, 0


def record_failed_login(ip_address: str):
    """Record a failed login attempt for an IP address."""
    current_time = time.time()
    
    if ip_address not in failed_login_attempts:
        failed_login_attempts[ip_address] = [1, None]
    else:
        attempts, _ = failed_login_attempts[ip_address]
        attempts += 1
        
        if attempts >= LOGIN_ATTEMPT_LIMIT:
            lockout_until = current_time + LOGIN_LOCKOUT_TIME
            failed_login_attempts[ip_address] = [attempts, lockout_until]
            logger.warning(f"IP {ip_address} locked out after {attempts} failed login attempts")
        else:
            failed_login_attempts[ip_address] = [attempts, None]


def clear_failed_logins(ip_address: str):
    """Clear failed login attempts after successful login."""
    if ip_address in failed_login_attempts:
        del failed_login_attempts[ip_address]


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses."""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # Cache control for sensitive data
        if "/auth/" in request.url.path or "/users/" in request.url.path:
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private"
            response.headers["Pragma"] = "no-cache"
        
        # Note: HSTS should only be enabled in production with HTTPS
        # response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response


class LoginProtectionMiddleware(BaseHTTPMiddleware):
    """Protect login endpoint from brute force attacks."""
    
    async def dispatch(self, request: Request, call_next):
        # Only check login endpoint
        if request.url.path == "/auth/login" and request.method == "POST":
            client_ip = get_remote_address(request)
            is_allowed, remaining_seconds = check_login_attempts(client_ip)
            
            if not is_allowed:
                from fastapi.responses import JSONResponse
                return JSONResponse(
                    status_code=429,
                    content={
                        "detail": f"Too many failed login attempts. Please try again in {remaining_seconds} seconds.",
                        "retry_after": remaining_seconds
                    }
                )
        
        response = await call_next(request)
        return response


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """Custom handler for rate limit exceeded."""
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=429,
        content={
            "detail": "Rate limit exceeded. Please slow down.",
            "retry_after": 60
        }
    )
