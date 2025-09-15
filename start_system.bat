@echo off
echo Starting Hotel Management System...
echo.

REM Kill any existing processes (optional)
taskkill /f /im node.exe /t >nul 2>&1
taskkill /f /im python.exe /t >nul 2>&1

echo Starting Backend Server...
start cmd /k "cd /d C:\xampp\htdocs\hotel-system\hotel-python-backend && python run.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start cmd /k "cd /d C:\xampp\htdocs\hotel-system\hotel-react-frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5174
echo.
echo Login Credentials:
echo Username: admin   Password: admin123
echo Username: manager Password: manager123
echo Username: staff   Password: staff123
echo.
pause