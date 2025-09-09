<?php
// Today Check In Module
// Category: FRONTOFFICE
// Sub-Category: INFO TAMU

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

// Include database connection
require_once __DIR__ . '/../../../config/database.php';

// --- FILTERING & PAGINATION SETUP ---
$search = $_GET['search'] ?? '';
$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$entries = isset($_GET['entries']) ? (int)$_GET['entries'] : 100;
$offset = ($page - 1) * $entries;

// Sorting parameters
$sort_column = $_GET['sort'] ?? 'arrival_date';
$sort_order = isset($_GET['order']) && in_array(strtoupper($_GET['order']), ['ASC', 'DESC']) ? $_GET['order'] : 'DESC';
// Expanded sortable columns
$allowed_sort_columns = [
    'registration_no', 'id_card_number', 'guest_name', 'market_segment', 'nights', 'arrival_date', 
    'departure_date', 'room_number', 'transaction_status', 'payment_amount', 'deposit', 'balance'
];
if (!in_array($sort_column, $allowed_sort_columns)) {
    $sort_column = 'arrival_date';
}

// --- DATABASE QUERY ---
$registrations = [];
$total_records = 0;
$error_message = '';
$today_date = date('Y-m-d'); // Always use the current date

try {
    $params = [':today_date' => $today_date];
    $where_clauses = ["arrival_date = :today_date"];

    // Add search condition
    if (!empty($search)) {
        $where_clauses[] = "(guest_name LIKE :search OR id_card_number LIKE :search OR market_segment LIKE :search OR registration_no LIKE :search OR room_number LIKE :search)";
        $params[':search'] = '%' . $search . '%';
    }

    $where_sql = 'WHERE ' . implode(' AND ', $where_clauses);

    // Get total record count for pagination
    $sql_count = "SELECT COUNT(*) FROM guest_registrations $where_sql";
    $stmt_count = $pdo->prepare($sql_count);
    $stmt_count->execute($params);
    $total_records = $stmt_count->fetchColumn();
    $total_pages = ceil($total_records / $entries);

    // Fetch the data for the current page, selecting all columns
    $sql_data = "SELECT *, (guest_count_male + guest_count_female + guest_count_child) as total_ci FROM guest_registrations $where_sql ORDER BY $sort_column $sort_order LIMIT :limit OFFSET :offset";
    
    $stmt_data = $pdo->prepare($sql_data);
    
    // Bind parameters
    foreach ($params as $key => &$val) {
        $stmt_data->bindParam($key, $val);
    }
    $stmt_data->bindValue(':limit', $entries, PDO::PARAM_INT);
    $stmt_data->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt_data->execute();
    $registrations = $stmt_data->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    $error_message = "Database error: " . $e->getMessage();
}

// Helper function for creating sortable table headers
function get_sort_link($column, $display, $current_sort, $current_order) {
    $order = ($current_sort == $column && $current_order == 'ASC') ? 'DESC' : 'ASC';
    $arrow = ($current_sort == $column) ? ($current_order == 'ASC' ? '▲' : '▼') : '';
    // Preserve other GET parameters when creating the link
    $query_params = http_build_query(array_merge($_GET, ['sort' => $column, 'order' => $order]));
    return "<a href=\"?{$query_params}\">$display $arrow</a>";
}
?>

<style>
    .checkin-container { font-family: Arial, sans-serif; color: #333; }
    .header-bar, .controls-bar, .table-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; background-color: #f0f0f0; padding: 10px; border: 1px solid #ccc; }
    .header-bar { border-bottom: none; }
    .controls-bar { border-bottom: none; }
    .controls-bar .search-box input, .header-bar input, .header-bar select { padding: 5px; border: 1px solid #ccc; border-radius: 3px; }
    .controls-bar .actions button, .controls-bar .actions select { padding: 5px 10px; margin-left: 5px; border: 1px solid #ccc; border-radius: 3px; background-color: #e0e0e0; cursor: pointer; }
    .data-table { width: 100%; border-collapse: collapse; border: 1px solid #ccc; }
    .data-table th, .data-table td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 11px; white-space: nowrap; } /* smaller font and nowrap */
    .data-table th { background-color: #f7f7f7; font-weight: bold; }
    .data-table th a { color: #333; text-decoration: none; }
    .table-footer { border-top: none; font-size: 12px; }
    .pagination-controls button { padding: 5px 10px; margin: 0 2px; border: 1px solid #ccc; background-color: #fff; cursor: pointer; }
    .pagination-controls button:disabled { cursor: not-allowed; opacity: 0.5; }
</style>

<div class="checkin-container">
    <div class="header-bar">
        <form id="filterForm" class="flex items-center gap-2">
             <input type="hidden" name="module" value="frontoffice/informasi_tamu/today_checkin_info">
             <input type="hidden" name="title" value="Check In Today">
            <strong>Check In Information (<?= htmlspecialchars($today_date) ?>)</strong>
            <label for="hotel" class="ml-4">Hotel:</label>
            <select id="hotel" name="hotel">
                <option>ALL</option>
            </select>
        </form>
    </div>

    <div class="controls-bar">
        <div class="search-box">
            <label>Search: <input type="text" id="search" value="<?= htmlspecialchars($search) ?>"></label>
        </div>
        <div class="actions">
            <label>Show 
                <select id="entries">
                    <option value="10" <?= $entries == 10 ? 'selected' : '' ?>>10</option>
                    <option value="25" <?= $entries == 25 ? 'selected' : '' ?>>25</option>
                    <option value="50" <?= $entries == 50 ? 'selected' : '' ?>>50</option>
                    <option value="100" <?= $entries == 100 ? 'selected' : '' ?>>100</option>
                </select>
             entries</label>
        </div>
    </div>

    <?php if ($error_message): ?>
        <div style="padding: 10px; background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; margin-bottom: 10px;">
            <?= htmlspecialchars($error_message) ?>
        </div>
    <?php endif; ?>

    <div class="overflow-x-auto">
        <table class="data-table">
            <thead>
                <tr>
                    <th>NO</th>
                    <th><?= get_sort_link('registration_no', 'Reg. No', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('guest_name', 'Guest Name', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('id_card_number', 'ID Card', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('market_segment', 'Market', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('room_number', 'Room', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('arrival_date', 'Arrival', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('departure_date', 'Departure', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('nights', 'Nights', $sort_column, $sort_order) ?></th>
                    <th>Total Guest</th>
                    <th><?= get_sort_link('payment_amount', 'Payment', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('deposit', 'Deposit', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('balance', 'Balance', $sort_column, $sort_order) ?></th>
                    <th><?= get_sort_link('transaction_status', 'Status', $sort_column, $sort_order) ?></th>
                    <th>Detail</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($registrations)): ?>
                    <tr>
                        <td colspan="15" style="text-align: center;">No check-in data found for today.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($registrations as $index => $reg): ?>
                        <tr>
                            <td><?= $offset + $index + 1 ?></td>
                            <td><?= htmlspecialchars($reg['registration_no']) ?></td>
                            <td><?= htmlspecialchars($reg['guest_title'] . '. ' . $reg['guest_name']) ?></td>
                            <td><?= htmlspecialchars($reg['id_card_number']) ?></td>
                            <td><?= htmlspecialchars($reg['market_segment']) ?></td>
                            <td><?= htmlspecialchars($reg['room_number']) ?></td>
                            <td><?= htmlspecialchars($reg['arrival_date']) ?></td>
                            <td><?= htmlspecialchars($reg['departure_date']) ?></td>
                            <td style="text-align:center;"><?= htmlspecialchars($reg['nights']) ?></td>
                            <td style="text-align:center;"><?= htmlspecialchars($reg['total_ci']) ?></td>
                            <td><?= number_format($reg['payment_amount'], 2) ?></td>
                            <td><?= number_format($reg['deposit'], 2) ?></td>
                            <td><?= number_format($reg['balance'], 2) ?></td>
                            <td><?= htmlspecialchars($reg['transaction_status']) ?></td>
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
            <button onclick="goToPage(<?= $page - 1 ?>)" <?= $page <= 1 ? 'disabled' : '' ?>>Previous</button>
            <button onclick="goToPage(<?= $page + 1 ?>)" <?= $page >= $total_pages ? 'disabled' : '' ?>>Next</button>
        </div>
    </div>
</div>

<script>
    function applyFilters() {
        const form = document.getElementById('filterForm');
        const searchInput = document.getElementById('search');
        const entriesSelect = document.getElementById('entries');
        
        const url = new URL(window.location.href);
        url.searchParams.set('hotel', form.hotel.value);
        url.searchParams.set('search', searchInput.value);
        url.searchParams.set('entries', entriesSelect.value);
        url.searchParams.set('page', 1); 
        
        window.location.href = url.toString();
    }

    document.getElementById('filterForm').addEventListener('change', applyFilters);
    document.getElementById('search').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
    document.getElementById('entries').addEventListener('change', applyFilters);

    function goToPage(page) {
        if (page > 0 && page <= <?= $total_pages ?>) {
            const url = new URL(window.location.href);
            url.searchParams.set('page', page);
            window.location.href = url.toString();
        }
    }
</script>

