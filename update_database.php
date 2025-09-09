<?php
// Database update script to create proper reservations table
require_once 'config/database.php';

try {
    // Create database connection
    $db = new Database();
    $conn = $db->getConnection();
    
    // Read the SQL file
    $sql = file_get_contents('database/create_hotel_reservations.sql');
    
    // Split into individual statements
    $statements = explode(';', $sql);
    
    $success_count = 0;
    $error_count = 0;
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (empty($statement)) continue;
        
        try {
            $conn->exec($statement);
            $success_count++;
            echo "✓ Statement executed successfully\n";
        } catch (Exception $e) {
            $error_count++;
            echo "✗ Error executing statement: " . $e->getMessage() . "\n";
            echo "Statement: " . substr($statement, 0, 100) . "...\n";
        }
    }
    
    echo "\n=== DATABASE UPDATE COMPLETE ===\n";
    echo "Successful statements: $success_count\n";
    echo "Failed statements: $error_count\n";
    
    // Test the new table
    $result = $conn->query("DESCRIBE hotel_reservations");
    if ($result) {
        echo "\n=== HOTEL RESERVATIONS TABLE STRUCTURE ===\n";
        while ($row = $result->fetch()) {
            echo $row['Field'] . " - " . $row['Type'] . "\n";
        }
    }
    
} catch (Exception $e) {
    echo "Database connection error: " . $e->getMessage() . "\n";
}
?>
