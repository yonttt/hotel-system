# Database Reference Cleanup Script
# This script removes outdated and redundant database files

$databaseRefPath = "C:\Users\yonat\OneDrive\Dokumen\hotel-system\hotel-python-backend\database_reference"

Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 79) -ForegroundColor Cyan
Write-Host "DATABASE REFERENCE CLEANUP" -ForegroundColor Yellow
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 79) -ForegroundColor Cyan
Write-Host ""

# Files to delete
$filesToDelete = @(
    "hotel_system.sql",
    "updated_hotel_system.sql",
    "updated_hotel_system_with_categories.sql",
    "migration_add_hotel_rooms.sql",
    "migration_add_market_segments_discounts.sql",
    "migration_add_room_categories.sql",
    "migration_complete_hotel_system_20250922.sql",
    "migration_manual.sql",
    "simple_migration_20250922.sql",
    "create_hotel_reservations.sql",
    "create_hotel_rooms.sql",
    "create_hotel_rooms_complete.sql",
    "create_room_categories.sql",
    "update_hotel_name_column.sql",
    "drop_guest_registrations.sql",
    "COMPLETE_UPDATE_README.md",
    "HOTEL_ROOMS_README.md",
    "ROOM_CATEGORIES_README.md"
)

Write-Host "This script will delete $($filesToDelete.Count) outdated files:" -ForegroundColor Yellow
Write-Host ""

foreach ($file in $filesToDelete) {
    Write-Host "  - $file" -ForegroundColor Red
}

Write-Host ""
Write-Host "Files to KEEP:" -ForegroundColor Green
Write-Host "  - eva_group_hotel_complete_setup.sql (CURRENT)" -ForegroundColor Green
Write-Host "  - DATABASE_SETUP_GUIDE.md (CURRENT)" -ForegroundColor Green
Write-Host ""

$response = Read-Host "Do you want to DELETE these outdated files? (yes/no)"

if ($response -eq "yes") {
    Write-Host ""
    Write-Host "Deleting files..." -ForegroundColor Yellow
    
    $deletedCount = 0
    $notFoundCount = 0
    
    foreach ($file in $filesToDelete) {
        $filePath = Join-Path $databaseRefPath $file
        
        if (Test-Path $filePath) {
            Remove-Item $filePath -Force
            Write-Host "  Deleted: $file" -ForegroundColor Green
            $deletedCount++
        } else {
            Write-Host "  Not found: $file" -ForegroundColor Yellow
            $notFoundCount++
        }
    }
    
    Write-Host ""
    Write-Host "CLEANUP COMPLETE" -ForegroundColor Green
    Write-Host ""
    Write-Host "Deleted: $deletedCount files" -ForegroundColor Green
    
    if ($notFoundCount -gt 0) {
        Write-Host "Not found: $notFoundCount files" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Remaining files in database_reference:" -ForegroundColor Cyan
    $remainingFiles = Get-ChildItem $databaseRefPath
    foreach ($item in $remainingFiles) {
        Write-Host "  - $($item.Name)" -ForegroundColor White
    }
    
} else {
    Write-Host ""
    Write-Host "Operation cancelled. No files were deleted." -ForegroundColor Red
}
