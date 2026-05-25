import sys
sys.path.insert(0, '.')

if __name__ == "__main__":
    import uvicorn
    # Changed host to 127.0.0.1 so the terminal link works correctly in Windows browsers
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)