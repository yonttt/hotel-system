#!/usr/bin/env python3
"""
Hotel Management System Backend Server Starter
This script starts the FastAPI backend server with uvicorn
"""

import sys
import os
from pathlib import Path

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

def start_server():
    """Start the FastAPI backend server"""
    try:
        import uvicorn
        
        print("🚀 Starting Hotel Management System Backend...")
        print("📍 Server will be available at: http://127.0.0.1:8000")
        print("📖 API Documentation: http://127.0.0.1:8000/docs")
        print("--" * 25)
        
        # Start the server
        uvicorn.run(
            "app.main:app",
            host="127.0.0.1",
            port=8000,
            reload=True,
            log_level="info"
        )
        
    except ImportError as e:
        print(f"❌ Error: Missing dependency - {e}")
        print("Please install uvicorn: pip install uvicorn")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    start_server()