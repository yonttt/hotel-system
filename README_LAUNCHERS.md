# Hotel Management System Launchers

This directory contains several launcher scripts to start both the frontend and backend servers together.

## Available Launchers

### 1. `start_hotel_system_simple.bat` (🌟 Recommended - Single Terminal)
- **Platform**: Windows (Command Prompt/PowerShell)
- **Behavior**: Runs both servers in ONE terminal window
- **Usage**: Double-click the file or run `start_hotel_system_simple.bat` in terminal
- **Pros**: Single window, easy to use, clean output
- **Cons**: None - this is the recommended option!

### 2. `start_hotel_system_single.ps1` (Advanced Single Terminal)
- **Platform**: Windows PowerShell
- **Behavior**: Runs both servers in one PowerShell window with enhanced monitoring
- **Usage**: `.\start_hotel_system_single.ps1` in PowerShell
- **Pros**: Single window, detailed status information, interactive commands
- **Cons**: Requires PowerShell execution policy

### 3. `start_hotel_system_unified.ps1` (Full-Featured Single Terminal)
- **Platform**: Windows PowerShell
- **Behavior**: Advanced single-window launcher with real-time monitoring and colors
- **Usage**: `.\start_hotel_system_unified.ps1` in PowerShell
- **Pros**: Beautiful interface, real-time status, interactive controls
- **Cons**: Requires PowerShell execution policy

### 4. `start_hotel_system.bat` (Legacy - Multiple Windows)
- **Platform**: Windows (Command Prompt/PowerShell)
- **Behavior**: Opens separate windows for frontend and backend
- **Usage**: Double-click the file or run `start_hotel_system.bat` in terminal
- **Pros**: Separate windows for each server
- **Cons**: Multiple windows to manage (not recommended)

### 4. `start_hotel_system.sh`
- **Platform**: Git Bash / WSL / Linux
- **Behavior**: Bash script for Unix-like environments
- **Usage**: `./start_hotel_system.sh` in bash terminal
- **Pros**: Cross-platform compatibility
- **Cons**: Requires bash environment on Windows

## Quick Start (Recommended)

1. **For most users**: Double-click `start_hotel_system_simple.bat`
2. **For single window with monitoring**: Run `.\start_hotel_system_single.ps1` in PowerShell
3. **For advanced features**: Run `.\start_hotel_system_unified.ps1` in PowerShell

**Note**: The new launchers run both servers in a single terminal window to avoid the multiple window problem!

## Server URLs

Once started, the servers will be available at:

- **Frontend (React)**: http://localhost:5173/
- **Backend (FastAPI)**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs

## Stopping the Servers

- **Batch file**: Close the terminal windows or press Ctrl+C in each window
- **PowerShell scripts**: Press Ctrl+C in the PowerShell window
- **Bash script**: Press Ctrl+C in the terminal

## Troubleshooting

### PowerShell Execution Policy Error
If you get an execution policy error with `.ps1` files:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Servers Not Starting
1. Make sure you're in the correct directory
2. Check that Python and Node.js are installed
3. Verify that dependencies are installed:
   - Backend: `cd hotel-python-backend && pip install -r requirements.txt`
   - Frontend: `cd hotel-react-frontend && npm install`

### Port Already in Use
If ports 5173 or 8000 are already in use:
- Stop other applications using these ports
- Or modify the port numbers in the server configuration files

## Dependencies

- **Python 3.7+** with FastAPI and Uvicorn
- **Node.js 16+** with npm
- **Required packages**: See `requirements.txt` (backend) and `package.json` (frontend)