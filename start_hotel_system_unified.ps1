#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Unified Hotel Management System Launcher - Single Terminal
.DESCRIPTION
    This script starts both the React frontend and FastAPI backend servers in a single PowerShell terminal window.
    It uses PowerShell jobs to run both servers concurrently and provides real-time status updates.
.NOTES
    Author: Hotel Management System
    Version: 1.0
    Date: September 16, 2025
#>

# Set strict mode for better error handling
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Colors for output
$colors = @{
    Header = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
    Info = "Blue"
    Server = "Magenta"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $colors[$Color]
}

function Test-Prerequisites {
    Write-ColorOutput "🔍 Checking prerequisites..." -Color "Info"
    
    # Check Python
    try {
        $pythonVersion = python --version 2>&1
        Write-ColorOutput "✅ Python: $pythonVersion" -Color "Success"
    }
    catch {
        Write-ColorOutput "❌ Python not found. Please install Python 3.7+" -Color "Error"
        exit 1
    }
    
    # Check Node.js
    try {
        $nodeVersion = node --version 2>&1
        Write-ColorOutput "✅ Node.js: $nodeVersion" -Color "Success"
    }
    catch {
        Write-ColorOutput "❌ Node.js not found. Please install Node.js 16+" -Color "Error"
        exit 1
    }
    
    # Check npm
    try {
        $npmVersion = npm --version 2>&1
        Write-ColorOutput "✅ NPM: v$npmVersion" -Color "Success"
    }
    catch {
        Write-ColorOutput "❌ NPM not found. Please install NPM" -Color "Error"
        exit 1
    }
}

function Start-BackendServer {
    Write-ColorOutput "🐍 Starting Python Backend Server..." -Color "Server"
    
    $backendPath = Join-Path $PSScriptRoot "hotel-python-backend"
    
    if (-not (Test-Path $backendPath)) {
        Write-ColorOutput "❌ Backend directory not found: $backendPath" -Color "Error"
        return $null
    }
    
    # Start backend as a job
    $backendJob = Start-Job -Name "HotelBackend" -ScriptBlock {
        param($BackendPath)
        Set-Location $BackendPath
        
        # Add current directory to Python path
        $env:PYTHONPATH = $BackendPath
        
        # Start the backend server
        python -c "
import sys
import os
sys.path.insert(0, '.')
import uvicorn
print('🚀 Backend server starting on http://127.0.0.1:8000')
print('📖 API Documentation: http://127.0.0.1:8000/docs')
uvicorn.run('app.main:app', host='127.0.0.1', port=8000, reload=True)
"
    } -ArgumentList $backendPath
    
    return $backendJob
}

function Start-FrontendServer {
    Write-ColorOutput "⚛️  Starting React Frontend Server..." -Color "Server"
    
    $frontendPath = Join-Path $PSScriptRoot "hotel-react-frontend"
    
    if (-not (Test-Path $frontendPath)) {
        Write-ColorOutput "❌ Frontend directory not found: $frontendPath" -Color "Error"
        return $null
    }
    
    # Start frontend as a job
    $frontendJob = Start-Job -Name "HotelFrontend" -ScriptBlock {
        param($FrontendPath)
        Set-Location $FrontendPath
        
        Write-Host "🚀 Frontend server starting on http://localhost:5173"
        npm run dev -- --host 0.0.0.0
    } -ArgumentList $frontendPath
    
    return $frontendJob
}

function Show-ServerStatus {
    param($BackendJob, $FrontendJob)
    
    Write-ColorOutput "`n📊 Server Status:" -Color "Header"
    Write-ColorOutput "=================" -Color "Header"
    
    if ($BackendJob) {
        $backendState = $BackendJob.State
        $backendColor = if ($backendState -eq "Running") { "Success" } else { "Warning" }
        Write-ColorOutput "🐍 Backend:  $backendState" -Color $backendColor
    }
    
    if ($FrontendJob) {
        $frontendState = $FrontendJob.State
        $frontendColor = if ($frontendState -eq "Running") { "Success" } else { "Warning" }
        Write-ColorOutput "⚛️  Frontend: $frontendState" -Color $frontendColor
    }
    
    Write-ColorOutput "`n🌐 Access URLs:" -Color "Info"
    Write-ColorOutput "Frontend: http://localhost:5173/" -Color "Success"
    Write-ColorOutput "Backend:  http://127.0.0.1:8000" -Color "Success"
    Write-ColorOutput "API Docs: http://127.0.0.1:8000/docs" -Color "Success"
}

function Monitor-Servers {
    param($BackendJob, $FrontendJob)
    
    Write-ColorOutput "`n🔄 Monitoring servers... (Press Ctrl+C to stop)" -Color "Info"
    Write-ColorOutput "Press 'q' and Enter to quit, 's' and Enter for status" -Color "Info"
    
    try {
        while ($true) {
            # Check if either job has failed
            if ($BackendJob -and $BackendJob.State -eq "Failed") {
                Write-ColorOutput "❌ Backend server failed!" -Color "Error"
                Receive-Job $BackendJob -ErrorAction SilentlyContinue
                break
            }
            
            if ($FrontendJob -and $FrontendJob.State -eq "Failed") {
                Write-ColorOutput "❌ Frontend server failed!" -Color "Error"
                Receive-Job $FrontendJob -ErrorAction SilentlyContinue
                break
            }
            
            # Check for user input
            if ([Console]::KeyAvailable) {
                $key = [Console]::ReadKey($true)
                switch ($key.KeyChar) {
                    'q' { 
                        Write-ColorOutput "`n👋 Shutting down servers..." -Color "Warning"
                        return 
                    }
                    's' { 
                        Show-ServerStatus $BackendJob $FrontendJob
                    }
                }
            }
            
            Start-Sleep -Seconds 2
        }
    }
    catch [System.Management.Automation.PipelineStoppedException] {
        Write-ColorOutput "`n👋 Received stop signal. Shutting down servers..." -Color "Warning"
    }
}

function Stop-Servers {
    param($BackendJob, $FrontendJob)
    
    Write-ColorOutput "🛑 Stopping servers..." -Color "Warning"
    
    if ($BackendJob) {
        Stop-Job $BackendJob -ErrorAction SilentlyContinue
        Remove-Job $BackendJob -ErrorAction SilentlyContinue
        Write-ColorOutput "✅ Backend server stopped" -Color "Success"
    }
    
    if ($FrontendJob) {
        Stop-Job $FrontendJob -ErrorAction SilentlyContinue
        Remove-Job $FrontendJob -ErrorAction SilentlyContinue
        Write-ColorOutput "✅ Frontend server stopped" -Color "Success"
    }
}

# Main execution
try {
    Clear-Host
    Write-ColorOutput "🏨 Hotel Management System - Unified Launcher" -Color "Header"
    Write-ColorOutput "=============================================" -Color "Header"
    Write-ColorOutput "Version: 1.0 | Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -Color "Info"
    Write-ColorOutput ""
    
    # Check prerequisites
    Test-Prerequisites
    Write-ColorOutput ""
    
    # Start servers
    $backendJob = Start-BackendServer
    Start-Sleep -Seconds 3  # Give backend time to start
    
    $frontendJob = Start-FrontendServer
    Start-Sleep -Seconds 5  # Give frontend time to start
    
    # Show initial status
    Show-ServerStatus $backendJob $frontendJob
    
    # Monitor servers
    Monitor-Servers $backendJob $frontendJob
}
catch {
    Write-ColorOutput "❌ An error occurred: $($_.Exception.Message)" -Color "Error"
}
finally {
    # Cleanup
    Stop-Servers $backendJob $frontendJob
    Write-ColorOutput "`n👋 Hotel Management System stopped. Have a great day!" -Color "Header"
}