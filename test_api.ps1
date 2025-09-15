# Test API connectivity
try {
    Write-Host "Testing API Health..."
    $health = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method GET
    Write-Host "Health Status: $($health | ConvertTo-Json)"
    
    Write-Host "`nTesting Login..."
    # OAuth2PasswordRequestForm expects form data, not JSON
    $formData = "username=admin&password=admin123"
    Write-Host "Sending login request with form data: $formData"
    
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login" -Method POST -Body $formData -ContentType "application/x-www-form-urlencoded"
    Write-Host "Login successful: $($response | ConvertTo-Json)"
    
    Write-Host "`nTesting authenticated endpoint..."
    $token = $response.access_token
    Write-Host "Using token: $($token.Substring(0, 50))..."
    
    try {
        $rooms = Invoke-RestMethod -Uri "http://localhost:8000/api/rooms" -Method GET -Headers @{Authorization = "Bearer $token"}
        Write-Host "Rooms data: $($rooms | ConvertTo-Json -Depth 3)"
    } catch {
        Write-Host "Rooms endpoint error: $($_.Exception.Message)"
        Write-Host "Response: $($_.ErrorDetails.Message)"
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.ErrorDetails.Message)"
}