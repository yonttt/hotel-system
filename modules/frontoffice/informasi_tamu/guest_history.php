<?php
// Guest History Module
// Category: FRONTOFFICE
// Sub-Category: INFO

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

// Include database connection
require_once __DIR__ . '/../../../config/database.php';

// --- FILTERING & PAGINATION SETUP ---
// Set a wide default date range to show all records initially
$date_from = $_GET['date_from'] ?? '2020-01-01'; 
$date_to = $_GET['date_to'] ?? date('Y-m-d');
$search = $_GET['search'] ?? '';
$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$entries = isset($_GET['entries']) ? (int)$_GET['entries'] : 100;
$offset = ($page - 1) * $entries;

// Sorting parameters
$sort_column = $_GET['sort'] ?? 'arrival_date';
$sort_order = isset($_GET['order']) && in_array(strtoupper($_GET['order']), ['ASC', 'DESC']) ? $_GET['order'] : 'DESC';
$allowed_sort_columns = ['id_card_number', 'guest_name', 'market_segment', 'nights', 'arrival_date', 'departure_date'];
if (!in_array($sort_column, $allowed_sort_columns)) {
    $sort_column = 'arrival_date';
}

// --- DATABASE QUERY ---
$registrations = [];
$total_records = 0;
$error_message = '';

try {
    $params = [];
    $where_clauses = [];

    // Add date range condition for arrival_date
    $where_clauses[] = "arrival_date BETWEEN :date_from AND :date_to";
    $params[':date_from'] = $date_from;
    $params[':date_to'] = $date_to;

    // Add search condition
    if (!empty($search)) {
        $where_clauses[] = "(guest_name LIKE :search OR id_card_number LIKE :search OR market_segment LIKE :search)";
        $params[':search'] = '%' . $search . '%';
    }

    $where_sql = 'WHERE ' . implode(' AND ', $where_clauses);

    // Get total record count for pagination
    $sql_count = "SELECT COUNT(*) FROM guest_registrations $where_sql";
    $stmt_count = $pdo->prepare($sql_count);
    $stmt_count->execute($params);
    $total_records = $stmt_count->fetchColumn();
    $total_pages = ceil($total_records / $entries);

    // Fetch the data for the current page
    $sql_data = "SELECT registration_no, id_card_number, guest_name, market_segment, nights, arrival_date, departure_date, (guest_count_male + guest_count_female + guest_count_child) as total_ci FROM guest_registrations $where_sql ORDER BY $sort_column $sort_order LIMIT :limit OFFSET :offset";
    
    $stmt_data = $pdo->prepare($sql_data);
    
    foreach ($params as $key => &$val) {
        $stmt_data->bindParam($key, $val);
    }
    $stmt_data->bindValue(':limit', $entries, PDO::PARAM_INT);
    $stmt_data->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt_data->execute();
    $registrations = $stmt_data->fetchAll();

} catch (PDOException $e) {
    $error_message = "Database error: " . $e->getMessage();
}

// Helper function for creating sortable table headers
function get_sort_link($column, $display, $current_sort, $current_order) {
    $order = ($current_sort == $column && $current_order == 'ASC') ? 'DESC' : 'ASC';
    $arrow = ($current_sort == $column) ? ($current_order == 'ASC' ? '▲' : '▼') : '';
    $query_params = http_build_query(array_merge($_GET, ['sort' => $column, 'order' => $order]));
    return "<a href=\"?{$query_params}\">$display $arrow</a>";
}
?>

<style>
    .guest-history-container { font-family: Arial, sans-serif; color: #333; }
    .header-bar, .controls-bar, .table-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; background-color: #f0f0f0; padding: 10px; border: 1px solid #ccc; }
    .header-bar { border-bottom: none; }
    .controls-bar { border-bottom: none; }
    .controls-bar .search-box input, .header-bar input, .header-bar select { padding: 5px; border: 1px solid #ccc; border-radius: 3px; }
    .controls-bar .actions button, .controls-bar .actions select { padding: 5px 10px; margin-left: 5px; border: 1px solid #ccc; border-radius: 3px; background-color: #e0e0e0; cursor: pointer; }
    .data-table { width: 100%; border-collapse: collapse; border: 1px solid #ccc; }
    .data-table th, .data-table td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
    .data-table th { background-color: #f7f7f7; font-weight: bold; }
    .data-table th a { color: #333; text-decoration: none; }
    .table-footer { border-top: none; font-size: 12px; }
    .pagination-controls button { padding: 5px 10px; margin: 0 2px; border: 1px solid #ccc; background-color: #fff; cursor: pointer; }
    .pagination-controls button:disabled { cursor: not-allowed; opacity: 0.5; }
</style>

<div class="guest-history-container">
    <div class="header-bar">
        <form id="filterForm" class="flex items-center gap-2">
             <input type="hidden" name="module" value="frontoffice/informasi_tamu/guest_history">
             <input type="hidden" name="title" value="Guest History">
            <strong>Guest History Information</strong>
            <label for="date_from" class="ml-4">Date:</label>
            <input type="date" id="date_from" name="date_from" value="<?= htmlspecialchars($date_from) ?>">
            <label for="date_to">To:</label>
            <input type="date" id="date_to" name="date_to" value="<?= htmlspecialchars($date_to) ?>">
            <label for="hotel">Hotel:</label>
            <select id="hotel" name="hotel">
                <option>All</option>
                <option>New Idola</option>
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

    <table class="data-table">
        <thead>
            <tr>
                <th>NO</th>
                <th><?= get_sort_link('id_card_number', 'ID CARD', $sort_column, $sort_order) ?></th>
                <th><?= get_sort_link('guest_name', 'GUEST NAME', $sort_column, $sort_order) ?></th>
                <th><?= get_sort_link('market_segment', 'MARKET', $sort_column, $sort_order) ?></th>
                <th><?= get_sort_link('nights', 'NIGHTS', $sort_column, $sort_order) ?></th>
                <th><?= get_sort_link('arrival_date', 'ARRIVAL', $sort_column, $sort_order) ?></th>
                <th><?= get_sort_link('departure_date', 'DEPARTURE', $sort_column, $sort_order) ?></th>
                <th>TOTAL_CI</th>
                <th>DETAIL</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($registrations)): ?>
                <tr>
                    <td colspan="9" style="text-align: center;">No data available in table</td>
                </tr>
            <?php else: ?>
                <?php foreach ($registrations as $index => $reg): ?>
                    <tr>
                        <td><?= $offset + $index + 1 ?></td>
                        <td><?= htmlspecialchars($reg['id_card_number']) ?></td>
                        <td><?= htmlspecialchars($reg['guest_name']) ?></td>
                        <td><?= htmlspecialchars($reg['market_segment']) ?></td>
                        <td style="text-align:center;"><?= htmlspecialchars($reg['nights']) ?></td>
                        <td><?= htmlspecialchars($reg['arrival_date']) ?></td>
                        <td><?= htmlspecialchars($reg['departure_date']) ?></td>
                        <td style="text-align:center;"><?= htmlspecialchars($reg['total_ci']) ?></td>
                        <td style="text-align:center;">🔍</td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>

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
        url.searchParams.set('date_from', form.date_from.value);
        url.searchParams.set('date_to', form.date_to.value);
        url.searchParams.set('hotel', form.hotel.value);
        url.searchParams.set('search', searchInput.value);
        url.searchParams.set('entries', entriesSelect.value);
        url.searchParams.set('page', 1); // Reset to first page on new filter
        
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