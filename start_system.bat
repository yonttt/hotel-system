@echo off
echo Starting Hotel Management System...

start "Backend" cmd /c "cd hotel-python-backend && python run.py"
start "Admin Frontend" cmd /c "cd hotel-react-frontend && npm run dev"
pause 
echo All systems are starting up in separate windows.