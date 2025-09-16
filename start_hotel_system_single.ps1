# Hotel Management System - Single Terminal PowerShell Launcher
# This script runs both servers in one PowerShell window using background jobs

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Hotel Management System" -ForegroundColor Cyan
Write-Host "  Single Terminal Launcher" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Check prerequisites
Write-Host "[INFO] Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "python")) {
    Write-Host "[ERROR] Python not found. Please install Python 3.7+" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Python is available" -ForegroundColor Green

if (-not (Test-Command "node")) {
    Write-Host "[ERROR] Node.js not found. Please install Node.js 16+" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Node.js is available" -ForegroundColor Green

# Check directories
if (-not (Test-Path "hotel-python-backend")) {
    Write-Host "[ERROR] hotel-python-backend directory not found!" -ForegroundColor Red
    Write-Host "Please run this script from the hotel-system root directory." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path "hotel-react-frontend")) {
    Write-Host "[ERROR] hotel-react-frontend directory not found!" -ForegroundColor Red
    Write-Host "Please run this script from the hotel-system root directory." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[INFO] Starting backend server..." -ForegroundColor Yellow

# Start backend server as a job
$backendJob = Start-Job -Name "BackendServer" -ScriptBlock {
    Set-Location "hotel-python-backend"
    $env:PYTHONPATH = (Get-Location).Path
    python -c @"
import sys
sys.path.insert(0, '.')
import uvicorn
print('🚀 Backend server starting on http://127.0.0.1:8000')
print('📖 API Documentation: http://127.0.0.1:8000/docs')
uvicorn.run('app.main:app', host='127.0.0.1', port=8000, reload=True)
"@
}

# Wait for backend to start
Start-Sleep -Seconds 3

Write-Host "[INFO] Starting frontend server..." -ForegroundColor Yellow

# Start frontend server as a job
$frontendJob = Start-Job -Name "FrontendServer" -ScriptBlock {
    Set-Location "hotel-react-frontend"
    Write-Host "🚀 Frontend server starting on http://localhost:5173"
    npm run dev
}

# Wait a moment for servers to initialize
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "   Servers Running!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173/" -ForegroundColor Green
Write-Host "Backend:  http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "API Docs: http://127.0.0.1:8000/docs" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers or close this window" -ForegroundColor Yellow
Write-Host "Type 'status' to see server status" -ForegroundColor Yellow
Write-Host ""

# Monitor servers and allow user interaction
try {
    while ($true) {
        # Check job states
        $backendState = $backendJob.State
        $frontendState = $frontendJob.State
        
        # If either job failed, show error and exit
        if ($backendState -eq "Failed") {
            Write-Host "[ERROR] Backend server failed!" -ForegroundColor Red
            Receive-Job $backendJob -ErrorAction SilentlyContinue
            break
        }
        
        if ($frontendState -eq "Failed") {
            Write-Host "[ERROR] Frontend server failed!" -ForegroundColor Red
            Receive-Job $frontendJob -ErrorAction SilentlyContinue
            break
        }
        
        # Check for user input
        if ([Console]::KeyAvailable) {
            $input = Read-Host
            if ($input -eq "status") {
                Write-Host ""
                Write-Host "Server Status:" -ForegroundColor Cyan
                Write-Host "Backend:  $backendState" -ForegroundColor $(if ($backendState -eq "Running") { "Green" } else { "Yellow" })
                Write-Host "Frontend: $frontendState" -ForegroundColor $(if ($frontendState -eq "Running") { "Green" } else { "Yellow" })
                Write-Host ""
            }
        }
        
        Start-Sleep -Seconds 2
    }
}
catch {
    Write-Host ""
    Write-Host "[INFO] Received stop signal. Shutting down servers..." -ForegroundColor Yellow
}
finally {
    # Cleanup jobs
    Write-Host "[INFO] Stopping servers..." -ForegroundColor Yellow
    
    if ($backendJob) {
        Stop-Job $backendJob -ErrorAction SilentlyContinue
        Remove-Job $backendJob -ErrorAction SilentlyContinue
        Write-Host "[OK] Backend server stopped" -ForegroundColor Green
    }
    
    if ($frontendJob) {
        Stop-Job $frontendJob -ErrorAction SilentlyContinue
        Remove-Job $frontendJob -ErrorAction SilentlyContinue
        Write-Host "[OK] Frontend server stopped" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Hotel Management System stopped. Have a great day!" -ForegroundColor Cyan
}