<?php
// Database configuration for XAMPP
define('DB_HOST', 'localhost');
define('DB_NAME', 'hotel_system');
define('DB_USER', 'system');        // Your MySQL username
define('DB_PASS', 'yont29921');     // Your MySQL password

class Database {
    private $connection;
    
    public function __construct() {
        try {
            $this->connection = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        } catch (PDOException $e) {
            // If database doesn't exist, show friendly error
            if (strpos($e->getMessage(), 'Unknown database') !== false) {
                die("Database 'hotel_system' not found. Please create it first using phpMyAdmin and import the SQL file.");
            } else {
                die("Database connection failed: " . $e->getMessage());
            }
        }
    }
    
    public function getConnection() {
        return $this->connection;
    }
}

// Create a global PDO instance for direct use
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Unknown database') !== false) {
        die("Database 'hotel_system' not found. Please create it first using phpMyAdmin and import the SQL file.");
    } else {
        die("Database connection failed: " . $e->getMessage());
    }
}
?>
