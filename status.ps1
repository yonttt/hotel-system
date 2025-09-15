Write-Host "Hotel Management System - Status Check" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

Write-Host "`nChecking Backend Server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/docs" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend is running on http://localhost:8000" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not responding" -ForegroundColor Red
}

Write-Host "`nChecking Frontend Server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Frontend is running on http://localhost:5173" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend is not responding" -ForegroundColor Red
}

Write-Host "`nLOGIN CREDENTIALS:" -ForegroundColor Green
Write-Host "Admin:   admin   / admin123" -ForegroundColor White
Write-Host "Manager: manager / manager123" -ForegroundColor White
Write-Host "Staff:   staff   / staff123" -ForegroundColor White

Write-Host "`nSystem URLs:" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan