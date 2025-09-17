# Hotel Management System - Single Terminal Launcher
# This script starts both backend and frontend in the same terminal

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   HOTEL MANAGEMENT SYSTEM LAUNCHER" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting Frontend and Backend servers in single terminal..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Frontend will be available at: http://localhost:5173/" -ForegroundColor Green
Write-Host "Backend will be available at: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "API Documentation: http://127.0.0.1:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to cleanup background jobs on exit
function Cleanup {
    Write-Host "`nStopping all servers..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    Write-Host "All servers stopped." -ForegroundColor Green
}

# Register cleanup function for Ctrl+C
Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

try {
    # Start Backend Server as background job
    Write-Host "Starting Backend Server..." -ForegroundColor Yellow
    $backendJob = Start-Job -ScriptBlock {
        Set-Location "C:\xampp\htdocs\hotel-system\hotel-python-backend"
        python run.py
    }
    
    # Wait a bit for backend to start
    Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Check if backend job is running
    if ($backendJob.State -eq "Running") {
        Write-Host "✅ Backend Server: Started successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend Server: Failed to start" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Both servers are now running!" -ForegroundColor Green
    Write-Host "- Backend: http://127.0.0.1:8000 (running in background)" -ForegroundColor Cyan
    Write-Host "- Frontend: http://localhost:5173/ (starting below)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To stop both servers, press Ctrl+C" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Start Frontend in foreground
    Set-Location "C:\xampp\htdocs\hotel-system\hotel-react-frontend"
    npm run dev
    
} catch {
    Write-Host "Error occurred: $_" -ForegroundColor Red
} finally {
    Cleanup
}