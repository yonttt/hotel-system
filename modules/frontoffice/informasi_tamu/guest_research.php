<?php
// Guest Research Module
// Category: FRONTOFFICE
// Sub-Category: INFORMASI TAMU

if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

require_once __DIR__ . '/../../../config/database.php';
$db = new Database();
$conn = $db->getConnection();

// --- INITIALIZE VARIABLES ---
$results = [];
$total_records = 0;
$error_message = '';
$is_search_triggered = isset($_GET['action']) && $_GET['action'] === 'search';
$hotel_name = "New Idola Hotel"; // Set hotel name

// --- FILTERING & PAGINATION SETUP ---
$params = [':hotel_name' => $hotel_name];
$search_criteria = [
    'guest_type' => $_GET['guest_type'] ?? 'ROOM',
    'registration_no' => $_GET['registration_no'] ?? '',
    'bill_no' => $_GET['bill_no'] ?? '',
    'card_no' => $_GET['card_no'] ?? '',
    'guest_name' => $_GET['guest_name'] ?? '',
    'mobile_no' => $_GET['mobile_no'] ?? '',
    'payment_by' => $_GET['payment_by'] ?? '',
    'report_periode' => $_GET['report_periode'] ?? ''
];

$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$entries = isset($_GET['entries']) ? (int)$_GET['entries'] : 15;
$offset = ($page - 1) * $entries;

// Sorting parameters
$sort_column = $_GET['sort'] ?? 'gr.arrival_date';
$sort_order = isset($_GET['order']) && in_array(strtoupper($_GET['order']), ['ASC', 'DESC']) ? $_GET['order'] : 'DESC';
$allowed_sort_columns = [
    'gr.registration_no', 'gr.reservation_no', 'r.bill_no', 'gr.id_card_number', 'gr.guest_name', 'gr.phone_number',
    'gr.nationality', 'gr.city', 'gr.address', 'gr.market_segment', 'gr.room_number', 'r.checkin_by', 'gr.arrival_date',
    'gr.departure_date', 'r.checkout_by', 'gr.payment_method', 'gr.payment_amount', 'r.cashier', 'r.payment_date'
];
if (!in_array($sort_column, $allowed_sort_columns)) {
    $sort_column = 'gr.arrival_date';
}

// --- DATABASE QUERY (ONLY IF SEARCH IS TRIGGERED) ---
if ($is_search_triggered) {
    try {
        $where_clauses = ["gr.hotel_name = :hotel_name"];

        // Build WHERE clauses from search criteria
        if (!empty($search_criteria['registration_no'])) {
            $where_clauses[] = "gr.registration_no LIKE :registration_no";
            $params[':registration_no'] = '%' . $search_criteria['registration_no'] . '%';
        }
        if (!empty($search_criteria['card_no'])) {
            $where_clauses[] = "gr.id_card_number LIKE :card_no";
            $params[':card_no'] = '%' . $search_criteria['card_no'] . '%';
        }
        if (!empty($search_criteria['guest_name'])) {
            $where_clauses[] = "gr.guest_name LIKE :guest_name";
            $params[':guest_name'] = '%' . $search_criteria['guest_name'] . '%';
        }
        if (!empty($search_criteria['mobile_no'])) {
            $where_clauses[] = "gr.phone_number LIKE :mobile_no";
            $params[':mobile_no'] = '%' . $search_criteria['mobile_no'] . '%';
        }
        if (!empty($search_criteria['payment_by'])) {
            $where_clauses[] = "gr.payment_method = :payment_by";
            $params[':payment_by'] = $search_criteria['payment_by'];
        }

        // Handle Report Periode (Date Range)
        $report_periode = $search_criteria['report_periode'];
        if ($report_periode) {
            $today = date('Y-m-d');
            switch ($report_periode) {
                case 'today':
                    $where_clauses[] = "gr.arrival_date = :today_date";
                    $params[':today_date'] = $today;
                    break;
                case 'this_week':
                    $start_of_week = date('Y-m-d', strtotime('monday this week', strtotime($today)));
                    $where_clauses[] = "gr.arrival_date >= :start_of_week";
                    $params[':start_of_week'] = $start_of_week;
                    break;
                case 'this_month':
                    $start_of_month = date('Y-m-01');
                    $where_clauses[] = "gr.arrival_date >= :start_of_month";
                    $params[':start_of_month'] = $start_of_month;
                    break;
            }
        }

        $base_query = "FROM guest_registrations gr LEFT JOIN reservations r ON gr.reservation_no = r.reservation_no";
        $where_sql = !empty($where_clauses) ? 'WHERE ' . implode(' AND ', $where_clauses) : '';

        // Get total record count
        $sql_count = "SELECT COUNT(*) $base_query $where_sql";
        $stmt_count = $conn->prepare($sql_count);
        $stmt_count->execute($params);
        $total_records = $stmt_count->fetchColumn();
        $total_pages = $total_records > 0 ? ceil($total_records / $entries) : 1;

        // Fetch the data for the current page
        $sql_data = "SELECT gr.*, r.bill_no, r.checkin_by, r.checkout_by, r.cashier, r.payment_date, (gr.guest_count_male + gr.guest_count_female + gr.guest_count_child) as total_guests $base_query $where_sql ORDER BY $sort_column $sort_order LIMIT :limit OFFSET :offset";
        
        $stmt_data = $conn->prepare($sql_data);
        foreach ($params as $key => &$val) {
            $stmt_data->bindParam($key, $val);
        }
        $stmt_data->bindValue(':limit', $entries, PDO::PARAM_INT);
        $stmt_data->bindValue(':offset', $offset, PDO::PARAM_INT);
        
        $stmt_data->execute();
        $results = $stmt_data->fetchAll(PDO::FETCH_ASSOC);

    } catch (PDOException $e) {
        $error_message = "Database error: " . $e->getMessage();
    }
}

function get_sort_link($column, $display, $current_sort, $current_order) {
    $order = ($current_sort == $column && $current_order == 'ASC') ? 'DESC' : 'ASC';
    $query_params = http_build_query(array_merge($_GET, ['sort' => $column, 'order' => $order]));
    return "<a href=\"?{$query_params}\">$display</a>";
}
?>

<style>
    /* Main Container Styles */
    .module-container {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 13px;
        background-color: #f9f9f9;
    }
    .module-header-bar {
        background-color: #e9e9e9;
        padding: 8px 15px;
        font-weight: 600;
        font-size: 14px;
        color: #333;
        border: 1px solid #ccc;
        border-bottom: none;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .filter-form-container {
        background-color: #fff;
        border: 1px solid #ccc;
        padding: 20px;
        margin-bottom: 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .filter-form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr); 
        gap: 15px 25px; /* row-gap, column-gap */
        align-items: center;
    }
    .form-group {
        display: grid;
        grid-template-columns: 120px 1fr;
        align-items: center;
        gap: 10px;
    }
    .form-group label {
        font-weight: 600;
        font-size: 13px;
        text-align: left;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .form-group input, .form-group select {
        width: 100%;
        padding: 6px;
        border: 1px solid #ccc;
        border-radius: 3px;
        font-size: 13px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-sizing: border-box; /* Ensures padding doesn't add to width */
    }
    .form-actions {
        margin-top: 20px;
    }
    .btn-primary {
        background-color: #337ab7;
        color: white;
        padding: 8px 15px;
        border: none;
        cursor: pointer;
        border-radius: 3px;
        font-weight: 600;
        font-size: 13px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .btn-primary:hover {
        background-color: #286090;
    }

    /* Results Table Styles to match the image */
    .result-header {
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-bottom: none;
        padding: 8px 12px;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 14px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .controls-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background-color: #fff;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        font-size: 13px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .controls-bar label {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    .controls-bar input[type="search"] {
        width: 200px;
    }
    .controls-bar input, .controls-bar select {
        padding: 4px 6px;
        font-size: 13px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        border: 1px solid #ccc;
        border-radius: 2px;
    }
    .data-table-wrapper {
        overflow-x: auto;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
    }
    .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .data-table th, .data-table td {
        border-top: 1px solid #ccc;
        padding: 8px 12px;
        text-align: left;
        white-space: nowrap;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .data-table th {
        background-color: #f0f0f0;
        font-weight: 600;
        font-size: 13px;
    }
    .data-table th a {
        color: #333;
        text-decoration: none;
        display: inline-block;
        padding-right: 15px;
        position: relative;
    }
    .data-table th a::after, .data-table th a::before {
        content: "";
        position: absolute;
        right: 5px;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        opacity: 0.5;
    }
    .data-table th a::before { /* Up arrow */
        top: 6px;
        border-bottom: 4px solid #333;
    }
    .data-table th a::after { /* Down arrow */
        bottom: 6px;
        border-top: 4px solid #333;
    }
    .data-table td.no-data {
        text-align: center;
        padding: 20px;
        color: #555;
    }
    .table-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        font-size: 12px;
        border: 1px solid #ccc;
        border-top: none;
    }
    .pagination-controls button {
        padding: 4px 10px;
        margin-left: 5px;
        cursor: pointer;
        border: 1px solid #ccc;
        background-color: #f0f0f0;
        border-radius: 3px;
    }
    .pagination-controls button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
</style>

<div class="module-container">
    <div class="module-header-bar">FIND ANY GUEST BY PAYMENT METHOD</div>
    
    <div class="filter-form-container">
        <form id="researchForm" method="GET">
            <input type="hidden" name="module" value="frontoffice/informasi_tamu/guest_research">
            <input type="hidden" name="title" value="Guest Research">
            
            <div class="filter-form-grid">
                <div class="form-group">
                    <label for="hotel_name">HOTEL NAME</label>
                    <input type="text" id="hotel_name" name="hotel_name" value="New Idola Hotel" readonly>
                </div>
                <div class="form-group">
                    <label for="guest_type">GUEST TYPE</label>
                    <select id="guest_type" name="guest_type">
                        <option value="ROOM" <?= $search_criteria['guest_type'] == 'ROOM' ? 'selected' : '' ?>>ROOM</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="registration_no">REGISTRATION NO</label>
                    <input type="text" id="registration_no" name="registration_no" value="<?= htmlspecialchars($search_criteria['registration_no']) ?>">
                </div>
                 <div class="form-group">
                    <label for="card_no">CARD NO</label>
                    <input type="text" id="card_no" name="card_no" value="<?= htmlspecialchars($search_criteria['card_no']) ?>">
                </div>
                 <div class="form-group">
                    <label for="guest_name">GUEST NAME</label>
                    <input type="text" id="guest_name" name="guest_name" value="<?= htmlspecialchars($search_criteria['guest_name']) ?>">
                </div>
                <div class="form-group">
                    <label for="mobile_no">MOBILE NO</label>
                    <input type="text" id="mobile_no" name="mobile_no" value="<?= htmlspecialchars($search_criteria['mobile_no']) ?>">
                </div>
                 <div class="form-group">
                    <label for="payment_by">PAYMENT BY</label>
                    <select id="payment_by" name="payment_by">
                        <option value="">-- Any --</option>
                        <option value="Cash" <?= $search_criteria['payment_by'] == 'Cash' ? 'selected' : '' ?>>Cash</option>
                        <option value="Credit Card" <?= $search_criteria['payment_by'] == 'Credit Card' ? 'selected' : '' ?>>Credit Card</option>
                        <option value="Bank Transfer" <?= $search_criteria['payment_by'] == 'Bank Transfer' ? 'selected' : '' ?>>Bank Transfer</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="report_periode">REPORT PERIODE</label>
                    <select id="report_periode" name="report_periode">
                        <option value="">-- Report Category --</option>
                        <option value="today" <?= $search_criteria['report_periode'] == 'today' ? 'selected' : '' ?>>Today</option>
                        <option value="this_week" <?= $search_criteria['report_periode'] == 'this_week' ? 'selected' : '' ?>>This Week</option>
                        <option value="this_month" <?= $search_criteria['report_periode'] == 'this_month' ? 'selected' : '' ?>>This Month</option>
                    </select>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" name="action" value="search" class="btn-primary">Detail Data</button>
            </div>
        </form>
    </div>

    <div>
        <div class="result-header">RESULT</div>
        <div class="controls-bar">
            <div>
                 <label>Search: <input type="search" id="resultSearchInput" onkeypress="applyResultSearch(event)" placeholder=""></label>
            </div>
            <div>
                <label>Show 
                    <select id="entries" onchange="document.getElementById('researchForm').submit()">
                        <option value="15" <?= $entries == 15 ? 'selected' : '' ?>>15</option>
                        <option value="25" <?= $entries == 25 ? 'selected' : '' ?>>25</option>
                        <option value="50" <?= $entries == 50 ? 'selected' : '' ?>>50</option>
                        <option value="100" <?= $entries == 100 ? 'selected' : '' ?>>100</option>
                    </select>
                entries</label>
            </div>
        </div>

        <div class="data-table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th><?= get_sort_link('gr.registration_no', 'Registration No', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('gr.reservation_no', 'Reservation No', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('r.bill_no', 'Bill No', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('gr.id_card_number', 'Card Id', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('gr.guest_name', 'Guest Name', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('gr.phone_number', 'Phone No', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('gr.nationality', 'Nationality', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('gr.city', 'City', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('gr.address', 'Address', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('gr.market_segment', 'Market Segment', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('gr.room_number', 'Room', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('r.checkin_by', 'Checkin By', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('gr.arrival_date', 'Arrival', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('gr.departure_date', 'Departure', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('r.checkout_by', 'Checkout By', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('gr.payment_method', 'Payment By', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('gr.payment_amount', 'Total', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('r.cashier', 'Cashier', $sort_column, $sort_order) ?></th>
                        <th><?= get_sort_link('r.payment_date', 'Payment Date', $sort_column, $sort_order) ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!$is_search_triggered): ?>
                         <tr><td colspan="20" class="no-data">Please provide search criteria and click "Detail Data".</td></tr>
                    <?php elseif (empty($results)): ?>
                        <tr><td colspan="20" class="no-data">No data available in table</td></tr>
                    <?php else: ?>
                        <?php foreach ($results as $index => $row): ?>
                            <tr>
                                <td><?= $offset + $index + 1 ?></td>
                                <td><?= htmlspecialchars($row['registration_no']) ?></td>
                                <td><?= htmlspecialchars($row['reservation_no']) ?></td>
                                <td><?= htmlspecialchars($row['bill_no'] ?? '-') ?></td>
                                <td><?= htmlspecialchars($row['id_card_number']) ?></td>
                                <td><?= htmlspecialchars($row['guest_title'] . '. ' . $row['guest_name']) ?></td>
                                <td><?= htmlspecialchars($row['phone_number']) ?></td>
                                <td><?= htmlspecialchars($row['nationality']) ?></td>
                                <td><?= htmlspecialchars($row['city']) ?></td>
                                <td><?= htmlspecialchars($row['address']) ?></td>
                                <td><?= htmlspecialchars($row['market_segment']) ?></td>
                                <td><?= htmlspecialchars($row['room_number']) ?></td>
                                <td><?= htmlspecialchars($row['checkin_by'] ?? '-') ?></td>
                                <td><?= htmlspecialchars($row['arrival_date']) ?></td>
                                <td><?= htmlspecialchars($row['departure_date']) ?></td>
                                <td><?= htmlspecialchars($row['checkout_by'] ?? '-') ?></td>
                                <td><?= htmlspecialchars($row['payment_method']) ?></td>
                                <td><?= number_format($row['payment_amount'], 2) ?></td>
                                <td><?= htmlspecialchars($row['cashier'] ?? '-') ?></td>
                                <td><?= htmlspecialchars($row['payment_date'] ?? '-') ?></td>
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
                <button onclick="goToPage(<?= $page + 1 ?>)" <?= $page >= ($total_pages ?? 1) ? 'disabled' : '' ?>>Next</button>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Sync the result search box with the main guest name search box on load
        const guestNameSearch = document.getElementById('guest_name').value;
        const resultSearch = document.getElementById('resultSearchInput');
        if (resultSearch) {
            resultSearch.value = guestNameSearch;
        }
    });

    function applyFilters() {
        const form = document.getElementById('researchForm');
        const entriesSelect = document.getElementById('entries');
        let entriesInput = form.querySelector('input[name="entries"]');
        if (!entriesInput) {
            entriesInput = document.createElement('input');
            entriesInput.type = 'hidden';
            entriesInput.name = 'entries';
            form.appendChild(entriesInput);
        }
        entriesInput.value = entriesSelect.value;
        form.submit();
    }

    function goToPage(page) {
        const totalPages = <?= $total_pages ?? 1 ?>;
        if (page > 0 && page <= totalPages) {
            const url = new URL(window.location.href);
            url.searchParams.set('page', page);
            window.location.href = url.toString();
        }
    }
    
    function applyResultSearch(event) {
        if (event.key === 'Enter') {
             const searchTerm = event.target.value;
             const form = document.getElementById('researchForm');
             
             // This search bar will primarily search by guest name or reg no
             form.guest_name.value = searchTerm;
             form.registration_no.value = searchTerm;

             // Ensure the 'action=search' parameter is included
             let actionInput = form.querySelector('input[name="action"]');
             if (!actionInput) {
                actionInput = document.createElement('input');
                actionInput.type = 'hidden';
                actionInput.name = 'action';
                form.appendChild(actionInput);
             }
             actionInput.value = 'search';

             form.submit();
        }
    }
</script>