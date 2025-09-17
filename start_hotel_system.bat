@echo off
title Hotel Management System Launcher
echo ========================================
echo    HOTEL MANAGEMENT SYSTEM LAUNCHER
echo ========================================
echo.
echo Starting Frontend and Backend servers in single terminal...
echo.
echo Frontend will be available at: http://localhost:5173/
echo Backend will be available at: http://127.0.0.1:8000
echo API Documentation: http://127.0.0.1:8000/docs
echo.
echo Press Ctrl+C to stop both servers
echo ========================================
echo.

REM Start backend in background
echo Starting Backend Server...
start /B cmd /c "cd /d C:\xampp\htdocs\hotel-system\hotel-python-backend && python run.py"

REM Wait 5 seconds for backend to start
echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start frontend in foreground (this will keep the terminal open)
echo Starting Frontend Server...
echo.
echo Both servers are now running!
echo - Backend: http://127.0.0.1:8000 (running in background)
echo - Frontend: http://localhost:5173/ (starting below)
echo.
echo To stop both servers, press Ctrl+C
echo ========================================
echo.

cd /d C:\xampp\htdocs\hotel-system\hotel-react-frontend
npm run dev