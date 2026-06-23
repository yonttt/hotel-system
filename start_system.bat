@echo off
echo Starting Hotel Management System...

start "Backend" cmd /c "cd hotel-python-backend && python run.py"

echo Waiting a few seconds for the backend to start before launching ngrok...
timeout /t 6 /nobreak >nul

start "Ngrok Tunnel" cmd /c "ngrok http 8000"
start "Admin Frontend" cmd /c "cd hotel-react-frontend && npm run dev"
start "Public Website" cmd /c "cd WEBSITE-Hotel && npm run dev"

echo.
echo All systems are starting up in separate windows.
echo.
echo   Backend API:      http://localhost:8000
echo   Admin Frontend:   http://localhost:5173
echo   Public Website:   http://localhost:5174
echo   Ngrok inspector:  http://localhost:4040
echo.
echo   PAYMENT WEBHOOK SETUP (Midtrans):
echo   1. Look at the "Ngrok Tunnel" window for a line like:
echo        Forwarding   https://XXXX.ngrok-free.dev -^> http://localhost:8000
echo   2. Copy that https URL and add /payments/webhook to the end, e.g.:
echo        https://XXXX.ngrok-free.dev/payments/webhook
echo   3. Paste it into Midtrans Dashboard -^> Settings -^> Configuration
echo        -^> Payment Notification URL, then Save.
echo   NOTE: the free ngrok URL changes every restart, so update Midtrans each time.
echo.
pause
