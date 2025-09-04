<?php
// modules/frontoffice/informasi_reservasi/all_reservation.php

// Ensure the path to the database configuration is correct
require_once __DIR__ . '/../../../config/database.php';

// Establish a PDO connection if it's not already set
if (!isset($pdo)) {
    try {
        $pdo = new PDO($dsn, $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
    } catch (PDOException $e) {
        // Display a user-friendly error message
        die("Database connection failed: " . $e->getMessage());
    }
}

// --- CONFIGURATION & PARAMETER HANDLING ---

// Pagination
$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$entries = isset($_GET['entries']) ? (int)$_GET['entries'] : 10;
$offset = ($page - 1) * $entries;

// Sorting
$sort_column = isset($_GET['sort']) ? $_GET['sort'] : 'created_at';
$sort_order = isset($_GET['order']) && in_array(strtoupper($_GET['order']), ['ASC', 'DESC']) ? $_GET['order'] : 'DESC';

// Whitelist allowed sortable columns to prevent SQL injection
$allowed_sort_columns = ['guest_name', 'market_segment', 'created_at', 'arrival_date', 'departure_date', 'transaction_by', 'deposit'];
if (!in_array($sort_column, $allowed_sort_columns)) {
    $sort_column = 'created_at'; // Default sort column
}

// Search
$search = isset($_GET['search']) ? trim($_GET['search']) : '';


// --- DATABASE QUERY ---

// Base SQL for counting records
$sql_count = "SELECT COUNT(*) FROM hotel_reservations";
$sql_data = "SELECT reservation_no, guest_name, market_segment, created_at AS booking, arrival_date, departure_date, transaction_by AS reserved_by, 'N/A' AS deposit_by, deposit, (guest_male + guest_female + guest_child) AS guest_count FROM hotel_reservations";

// Add search condition if a search term is provided
$params = [];
if (!empty($search)) {
    $search_condition = " WHERE guest_name LIKE :search OR market_segment LIKE :search OR reservation_no LIKE :search";
    $sql_count .= $search_condition;
    $sql_data .= $search_condition;
    $params[':search'] = '%' . $search . '%';
}

// Get total number of records
$stmt_count = $pdo->prepare($sql_count);
$stmt_count->execute($params);
$total_records = $stmt_count->fetchColumn();
$total_pages = ceil($total_records / $entries);

// Add sorting and pagination to the data query
$sql_data .= " ORDER BY $sort_column $sort_order LIMIT :limit OFFSET :offset";

// Prepare and execute the final data query
$stmt_data = $pdo->prepare($sql_data);
$stmt_data->bindValue(':limit', $entries, PDO::PARAM_INT);
$stmt_data->bindValue(':offset', $offset, PDO::PARAM_INT);
if (!empty($search)) {
    $stmt_data->bindValue(':search', '%' . $search . '%');
}
$stmt_data->execute();
$reservations = $stmt_data->fetchAll();

// --- HELPER FUNCTION FOR SORTING UI ---

function get_sort_link($column, $display, $current_sort, $current_order) {
    $order = ($current_sort == $column && $current_order == 'ASC') ? 'DESC' : 'ASC';
    $arrow = '';
    if ($current_sort == $column) {
        $arrow = $current_order == 'ASC' ? '▲' : '▼';
    }
    return "<a href=\"?module=frontoffice/informasi_reservasi/all_reservation&sort=$column&order=$order\">$display $arrow</a>";
}

?>

<style>
    /* General styles for the module */
    .reservation-container {
        font-family: Arial, sans-serif;
        color: #333;
    }
    .controls-bar {
        background-color: #f0f0f0;
        padding: 10px;
        border: 1px solid #ccc;
        border-bottom: none;
    }
    .controls-bar, .header-bar, .table-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
    }
    .controls-bar .search-box input {
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 3px;
    }
    .controls-bar .actions button, .controls-bar .actions select {
        padding: 5px 10px;
        margin-left: 5px;
        border: 1px solid #ccc;
        border-radius: 3px;
        background-color: #e0e0e0;
        cursor: pointer;
    }
    .data-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #ccc;
    }
    .data-table th, .data-table td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
        font-size: 12px;
    }
    .data-table th {
        background-color: #f7f7f7;
        font-weight: bold;
    }
    .data-table th a {
        color: #333;
        text-decoration: none;
    }
    .table-footer {
        padding: 10px;
        border: 1px solid #ccc;
        border-top: none;
        font-size: 12px;
    }
    .pagination-controls button {
        padding: 5px 10px;
        margin: 0 2px;
        border: 1px solid #ccc;
        background-color: #f0f0f0;
        cursor: pointer;
    }
    .pagination-controls button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
</style>

<div class="reservation-container">
    <div class="header-bar controls-bar" style="align-items: center;">
        <div style="display: flex; align-items: center;">
            <span style="font-size: 1.5em; margin-right: 10px;">☰</span>
            <strong>ALL RESERVATION LIST</strong>
            <span style="margin-left: 20px; font-size: 1em;">Hotel :</span>
            <select style="margin-left: 5px; padding: 3px 8px;">
                <option value="ALL">All</option>
                <option value="IDOLA">Hotel Idola</option>
            </select>
        </div>
    </div>

    <div class="controls-bar">
        <div class="search-box">
            <label>Search: <input type="text" id="searchInput" value="<?= htmlspecialchars($search) ?>"></label>
        </div>
        <div class="actions">
            <label>Show entries: 
                <select id="entriesSelect">
                    <option value="10" <?= $entries == 10 ? 'selected' : '' ?>>10</option>
                    <option value="25" <?= $entries == 25 ? 'selected' : '' ?>>25</option>
                    <option value="50" <?= $entries == 50 ? 'selected' : '' ?>>50</option>
                    <option value="100" <?= $entries == 100 ? 'selected' : '' ?>>100</option>
                </select>
            </label>
            <button>📊</button>
            <button>📈</button>
            <button>📋</button>
            <button>Print</button>
        </div>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th>No</th>
                <th><?= get_sort_link('guest_name', 'Name', $sort_column, $sort_order) ?></th>
                <th><?= get_sort_link('market_segment', 'Market', $sort_column, $sort_order) ?></th>
                <th><?= get_sort_link('created_at', 'Booking', $sort_column, $sort_order) ?></th>
                <th><?= get_sort_link('arrival_date', 'Arrival', $sort_column, $sort_order) ?></th>
                <th><?= get_sort_link('departure_date', 'Departure', $sort_column, $sort_order) ?></th>
                <th><?= get_sort_link('transaction_by', 'Reserved By', $sort_column, $sort_order) ?></th>
                <th>Deposit By</th>
                <th><?= get_sort_link('deposit', 'Deposit', $sort_column, $sort_order) ?></th>
                <th>Guest</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($reservations)): ?>
                <tr>
                    <td colspan="10" style="text-align: center;">No data available in table</td>
                </tr>
            <?php else: ?>
                <?php foreach ($reservations as $index => $res): ?>
                <tr>
                    <td><?= $offset + $index + 1 ?></td>
                    <td><?= htmlspecialchars($res['guest_name']) ?></td>
                    <td><?= htmlspecialchars($res['market_segment']) ?></td>
                    <td><?= date('d-m-Y', strtotime($res['booking'])) ?></td>
                    <td><?= date('d-m-Y', strtotime($res['arrival_date'])) ?></td>
                    <td><?= date('d-m-Y', strtotime($res['departure_date'])) ?></td>
                    <td><?= htmlspecialchars($res['reserved_by']) ?></td>
                    <td><?= htmlspecialchars($res['deposit_by']) ?></td>
                    <td><?= number_format($res['deposit'], 2) ?></td>
                    <td><?= htmlspecialchars($res['guest_count']) ?></td>
                </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>

    <div class="table-footer">
        <div>Showing <?= $total_records > 0 ? $offset + 1 : 0 ?> to <?= min($offset + $entries, $total_records) ?> of <?= $total_records ?> entries</div>
        <div class="pagination-controls">
            <button onclick="goToPage(1)" <?= $page <= 1 ? 'disabled' : '' ?>>First</button>
            <button onclick="goToPage(<?= $page - 1 ?>)" <?= $page <= 1 ? 'disabled' : '' ?>>Previous</button>
            <button onclick="goToPage(<?= $page + 1 ?>)" <?= $page >= $total_pages ? 'disabled' : '' ?>>Next</button>
            <button onclick="goToPage(<?= $total_pages ?>)" <?= $page >= $total_pages ? 'disabled' : '' ?>>Last</button>
        </div>
    </div>
</div>

<script>
function updateQueryString(key, value, url) {
    url = url || window.location.href;
    const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    const separator = url.indexOf('?') !== -1 ? "&" : "?";
    if (url.match(re)) {
        return url.replace(re, '$1' + key + "=" + value + '$2');
    }
    return url + separator + key + "=" + value;
}

function applyFilters() {
    let url = window.location.href;
    url = updateQueryString('search', document.getElementById('searchInput').value, url);
    url = updateQueryString('entries', document.getElementById('entriesSelect').value, url);
    url = updateQueryString('page', 1, url); // Reset to first page on new search/filter
    window.location.href = url;
}

document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        applyFilters();
    }
});

document.getElementById('entriesSelect').addEventListener('change', function () {
    applyFilters();
});

function goToPage(page) {
    if (page < 1 || page > <?= $total_pages ?>) {
        return;
    }
    window.location.href = updateQueryString('page', page);
}
</script>