<?php
// modules/frontoffice/informasi_reservasi/_reservation_filtering_and_sorting.php

// --- CONFIGURATION & PARAMETER HANDLING ---

// Pagination
$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$entries = isset($_GET['entries']) ? (int)$_GET['entries'] : 10;
$offset = ($page - 1) * $entries;

// Sorting
$sort_column = isset($_GET['sort']) ? $_GET['sort'] : 'created_at';
$sort_order = isset($_GET['order']) && in_array(strtoupper($_GET['order']), ['ASC', 'DESC']) ? $_GET['order'] : 'DESC';

// Whitelist allowed sortable columns to prevent SQL injection
$allowed_sort_columns = [
    'reservation_no', 'guest_name', 'market_segment', 'created_at', 
    'arrival_date', 'departure_date', 'transaction_by', 'deposit', 
    'room_number', 'nights', 'transaction_status', 'payment_amount', 'balance'
];
if (!in_array($sort_column, $allowed_sort_columns)) {
    $sort_column = 'created_at'; // Default sort column
}

// Search
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
?>