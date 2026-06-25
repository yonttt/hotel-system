import os
import sys
sys.path.insert(0, '.')

if __name__ == "__main__":
    import uvicorn
    # Local default: 127.0.0.1 + reload (terminal link works on Windows, code hot-reloads).
    # On the server, set these in .env:
    #   HOST=0.0.0.0   (reachable from the internet)
    #   RELOAD=false   (stable, no auto-restart)
    # For real production prefer gunicorn:
    #   gunicorn -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "true").lower() == "true"
    uvicorn.run("app.main:app", host=host, port=port, reload=reload)