<?php
// modules/frontoffice/informasi_tamu/_pagination_and_sorting.php

// --- FILTERING & PAGINATION SETUP ---
$search = $_GET['search'] ?? '';
$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$entries = isset($_GET['entries']) ? (int)$_GET['entries'] : 100;
$offset = ($page - 1) * $entries;

// Sorting parameters
$sort_column = $_GET['sort'] ?? 'arrival_date';
$sort_order = isset($_GET['order']) && in_array(strtoupper($_GET['order']), ['ASC', 'DESC']) ? $_GET['order'] : 'DESC';
$allowed_sort_columns = [
    'registration_no', 'id_card_number', 'guest_name', 'market_segment', 'nights', 'arrival_date', 
    'departure_date', 'room_number', 'transaction_status', 'payment_amount', 'deposit', 'balance'
];
if (!in_array($sort_column, $allowed_sort_columns)) {
    $sort_column = 'arrival_date';
}
?>