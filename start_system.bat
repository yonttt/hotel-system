@echo off
echo Starting Hotel Management System...

start "Backend" cmd /c "cd hotel-python-backend && python run.py"
start "Admin Frontend" cmd /c "cd hotel-react-frontend && npm run dev"
start "Public Website" cmd /c "cd WEBSITE-Hotel && npm run dev"

echo All systems are starting up in separate windows.
echo.
echo   Backend API:      http://localhost:8000
echo   Admin Frontend:   http://localhost:5173
echo   Public Website:   http://localhost:5174
echo.
pause