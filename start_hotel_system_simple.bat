@echo off
REM Hotel Management System - Single Terminal Launcher
REM This batch file starts both frontend and backend servers in one terminal window

setlocal enabledelayedexpansion

echo.
echo ================================
echo   Hotel Management System
echo   Single Terminal Launcher
echo ================================
echo.

REM Check if we're in the correct directory
if not exist "hotel-python-backend" (
    echo ERROR: hotel-python-backend directory not found!
    echo Please run this script from the hotel-system root directory.
    pause
    exit /b 1
)

if not exist "hotel-react-frontend" (
    echo ERROR: hotel-react-frontend directory not found!
    echo Please run this script from the hotel-system root directory.
    pause
    exit /b 1
)

echo [INFO] Checking prerequisites...

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.7+
    pause
    exit /b 1
)
echo [OK] Python is available

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js 16+
    pause
    exit /b 1
)
echo [OK] Node.js is available

echo.
echo [INFO] Starting backend server in background...

REM Start backend server in background
start /b "Backend Server" cmd /c "cd hotel-python-backend && python start_backend.py"

REM Wait a moment for backend to start
echo [INFO] Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo [INFO] Starting frontend server...
echo.
echo ================================
echo   Servers Status:
echo   Backend:  http://127.0.0.1:8000
echo   Frontend: http://localhost:5173
echo   API Docs: http://127.0.0.1:8000/docs
echo ================================
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start frontend server (this will run in the current terminal)
cd hotel-react-frontend
npm run dev

REM If we reach here, frontend stopped, so clean up
echo.
echo [INFO] Frontend stopped. Cleaning up...
echo [INFO] Stopping background processes...

REM Kill any remaining Node.js and Python processes related to our servers
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1

echo [INFO] Hotel Management System stopped.
pause