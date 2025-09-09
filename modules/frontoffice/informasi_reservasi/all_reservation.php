<?php
// modules/frontoffice/informasi_reservasi/all_reservation.php

// Ensure the path to the database configuration is correct
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/_reservation_query.php';
require_once __DIR__ . '/_reservation_filtering_and_sorting.php';

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




// --- DATABASE QUERY ---

// Base SQL for counting records
$sql_count = "SELECT COUNT(*) FROM hotel_reservations";
$sql_data = "SELECT *, (guest_male + guest_female + guest_child) AS guest_count FROM hotel_reservations";

// Add search condition if a search term is provided
$params = [];
if (!empty($search)) {
    $search_condition = " WHERE guest_name LIKE :search OR market_segment LIKE :search OR reservation_no LIKE :search OR room_number LIKE :search";
    $sql_count .= $search_condition;
    $sql_data .= $search_condition;
    $params[':search'] = '%' . $search . '%';
}

$result = get_reservations($pdo, $sql_count, $sql_data, $params, $sort_column, $sort_order, $page, $entries);
$reservations = $result['reservations'];
$total_records = $result['total_records'];
$total_pages = $result['total_pages'];


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
    .reservation-container { font-family: Arial, sans-serif; color: #333; }
    .controls-bar, .header-bar, .table-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; background-color: #f0f0f0; padding: 10px; border: 1px solid #ccc; border-bottom: none; }
    .controls-bar .search-box input { padding: 5px; border: 1px solid #ccc; border-radius: 3px; }
    .controls-bar .actions button, .controls-bar .actions select { padding: 5px 10px; margin-left: 5px; border: 1px solid #ccc; border-radius: 3px; background-color: #e0e0e0; cursor: pointer; }
    .data-table-wrapper { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; border: 1px solid #ccc; }
    .data-table th, .data-table td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 11px; white-space: nowrap; }
    .data-table th { background-color: #f7f7f7; font-weight: bold; }
    .data-table th a { color: #333; text-decoration: none; }
    .table-footer { padding: 10px; border: 1px solid #ccc; border-top: none; font-size: 12px; }
    .pagination-controls button { padding: 5px 10px; margin: 0 2px; border: 1px solid #ccc; background-color: #f0f0f0; cursor: pointer; }
    .pagination-controls button:disabled { cursor: not-allowed; opacity: 0.5; }
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

    <div class="data-table-wrapper">
        <table class="data-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th><?= get_sort_link('reservation_no', 'Resv. No', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('guest_name', 'Name', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('market_segment', 'Market', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('created_at', 'Booking Date', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('arrival_date', 'Arrival', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('departure_date', 'Departure', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('nights', 'Nights', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('room_number', 'Room', $sort_column, $sort_order) ?></th>
                    <th>Guest</th>
                    <th><?= get_sort_link('transaction_by', 'Reserved By', $sort_column, $sort_order) ?></th>
                    <th>Deposit By</th>
                    <th><?= get_sort_link('deposit', 'Deposit', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('payment_amount', 'Payment', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('balance', 'Balance', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('transaction_status', 'Status', $sort_column, $sort_order) ?></th>
                    <th>Detail</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($reservations)): ?>
                    <tr>
                        <td colspan="17" style="text-align: center;">No data available in table</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($reservations as $index => $res):
                    // Corrected the concatenation for guest_title and guest_name
                    $guest_name_display = htmlspecialchars($res['guest_title'] . ". " . $res['guest_name']);
                    ?>
                    <tr>
                        <td><?= $offset + $index + 1 ?></td>
                        <td><?= htmlspecialchars($res['reservation_no']) ?></td>
                        <td><?= $guest_name_display ?></td>
                        <td><?= htmlspecialchars($res['market_segment']) ?></td>
                        <td><?= date('d-m-Y', strtotime($res['created_at'])) ?></td>
                        <td><?= date('d-m-Y', strtotime($res['arrival_date'])) ?></td>
                        <td><?= date('d-m-Y', strtotime($res['departure_date'])) ?></td>
                        <td style="text-align:center;"><?= htmlspecialchars($res['nights']) ?></td>
                        <td><?= htmlspecialchars($res['room_number']) ?></td>
                        <td style="text-align:center;"><?= htmlspecialchars($res['guest_count']) ?></td>
                        <td><?= htmlspecialchars($res['transaction_by']) ?></td>
                        <td>N/A</td>
                        <td><?= number_format($res['deposit'], 2) ?></td>
                        <td><?= number_format($res['payment_amount'], 2) ?></td>
                        <td><?= number_format($res['balance'], 2) ?></td>
                        <td><?= htmlspecialchars($res['transaction_status']) ?></td>
                        <td style="text-align:center;">🔍</td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

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