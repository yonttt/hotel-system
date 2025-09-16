@echo off
title Hotel Management System Launcher
echo ========================================
echo    HOTEL MANAGEMENT SYSTEM LAUNCHER
echo ========================================
echo.
echo Starting Frontend and Backend servers...
echo.
echo Frontend will be available at: http://localhost:5173/
echo Backend will be available at: http://127.0.0.1:8000
echo API Documentation: http://127.0.0.1:8000/docs
echo.
echo Press Ctrl+C to stop both servers
echo ========================================
echo.

REM Start backend in a new window
start "Hotel Backend Server" cmd /k "cd /d C:\xampp\htdocs\hotel-system\hotel-python-backend && python run.py"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window  
start "Hotel Frontend Server" cmd /k "cd /d C:\xampp\htdocs\hotel-system\hotel-react-frontend && npm run dev"

echo Both servers are starting...
echo.
echo Backend Server: Running in separate window
echo Frontend Server: Running in separate window
echo.
echo To stop the servers, close their respective windows or press Ctrl+C in each window.
echo.
echo Press any key to exit this launcher (servers will continue running)...
pause >nul