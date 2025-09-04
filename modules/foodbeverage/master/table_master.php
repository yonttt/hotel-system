<?php
// Master Meja Module
require_once 'config/database.php';

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    try {
        switch ($action) {
            case 'create':
                $stmt = $pdo->prepare("INSERT INTO master_meja (nama_cabang, no_meja, lantai, kursi, status) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$_POST['nama_cabang'], $_POST['no_meja'], $_POST['lantai'], $_POST['kursi'], $_POST['status']]);
                echo json_encode(['success' => true, 'message' => 'Meja berhasil ditambahkan']);
                exit;
                
            case 'update':
                $stmt = $pdo->prepare("UPDATE master_meja SET nama_cabang = ?, no_meja = ?, lantai = ?, kursi = ?, status = ? WHERE id = ?");
                $stmt->execute([$_POST['nama_cabang'], $_POST['no_meja'], $_POST['lantai'], $_POST['kursi'], $_POST['status'], $_POST['id']]);
                echo json_encode(['success' => true, 'message' => 'Meja berhasil diupdate']);
                exit;
                
            case 'delete':
                $stmt = $pdo->prepare("DELETE FROM master_meja WHERE id = ?");
                $stmt->execute([$_POST['id']]);
                echo json_encode(['success' => true, 'message' => 'Meja berhasil dihapus']);
                exit;
                
            case 'get':
                $stmt = $pdo->prepare("SELECT * FROM master_meja WHERE id = ?");
                $stmt->execute([$_POST['id']]);
                $data = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($data);
                exit;
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        exit;
    }
}

// Fetch data for display
$search = $_GET['search'] ?? '';
$filter = $_GET['filter'] ?? 'Hotel New Idola';
$page = max(1, intval($_GET['page'] ?? 1));
$entries = intval($_GET['entries'] ?? 10);
$sortColumn = $_GET['sort'] ?? 'no_meja';
$sortDirection = $_GET['dir'] ?? 'asc';

// Validate sort parameters
$allowedColumns = ['no_meja', 'lantai', 'kursi', 'status', 'hit'];
if (!in_array($sortColumn, $allowedColumns)) {
    $sortColumn = 'no_meja';
}
if (!in_array(strtolower($sortDirection), ['asc', 'desc'])) {
    $sortDirection = 'asc';
}

$sql = "SELECT * FROM master_meja WHERE 1=1";
$params = [];

if (!empty($search)) {
    $sql .= " AND (no_meja LIKE ? OR status LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

// Since we only have Hotel New Idola option, we don't need additional filtering by status
// All tables belong to Hotel New Idola by default

// Add sorting
$sql .= " ORDER BY $sortColumn $sortDirection";

// Get total count for pagination
$countStmt = $pdo->prepare(str_replace("SELECT *", "SELECT COUNT(*)", $sql));
$countStmt->execute($params);
$totalRecords = $countStmt->fetchColumn();

// Add pagination
$offset = ($page - 1) * $entries;
$sql .= " LIMIT $entries OFFSET $offset";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$tables = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Calculate pagination info
$totalPages = ceil($totalRecords / $entries);
$startRecord = $offset + 1;
$endRecord = min($offset + $entries, $totalRecords);
?>

<div class="content-card">
    <!-- Main Container with Single Border -->
    <div class="bg-white rounded-lg shadow border-2 border-gray-400 overflow-hidden">
        <!-- Top Controls - Template Layout -->
        <div class="px-4 py-2 border-b border-gray-300">
            <!-- First Row: Button and Filter -->
            <div class="flex items-center justify-between w-full mb-2">
                <!-- Left Side - New Table Button and Filter -->
                <div class="flex items-center space-x-6">
                    <button type="button" class="btn btn-primary-simple" onclick="openCreateModal()">
                        + New Table
                    </button>
                    
                    <!-- Filter -->
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-700 font-medium form-label">Filter:</span>
                        <select id="filterStatus" class="form-select-template" onchange="applyFilter()">
                            <option value="Hotel New Idola" selected>Hotel New Idola</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Second Row: Search and Show Entries -->
            <div class="flex items-center justify-between w-full">
                <!-- Search -->
                <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-700 font-medium form-label">Search:</span>
                    <input type="text" id="searchInput" class="form-input-template" placeholder="Search here..." 
                           value="<?= htmlspecialchars($search) ?>" onkeyup="handleSearch(event)">
                </div>
                
                <!-- Show Entries -->
                <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-700 font-medium form-label">Show entries:</span>
                    <select id="showEntries" class="form-select-template" onchange="changeShowEntries()">
                        <option value="10" <?= $entries == 10 ? 'selected' : '' ?>>10</option>
                        <option value="25" <?= $entries == 25 ? 'selected' : '' ?>>25</option>
                        <option value="50" <?= $entries == 50 ? 'selected' : '' ?>>50</option>
                        <option value="100" <?= $entries == 100 ? 'selected' : '' ?>>100</option>
                    </select>
                </div>
            </div>
        </div>
        
        <!-- Data Table -->
        <div class="overflow-hidden">
            <table class="min-w-full border-collapse table-bordered">
            <thead class="bg-gray-50 border-b-2 border-gray-300">
                <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">No</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-r border-gray-300" onclick="sortTable('no_meja')">
                        <div class="flex items-center justify-between">
                            <span>No meja</span>
                            <span class="sort-arrows">
                                <?php if ($sortColumn == 'no_meja'): ?>
                                    <?= $sortDirection == 'asc' ? '<' : '>' ?>
                                <?php else: ?>
                                    <>
                                <?php endif; ?>
                            </span>
                        </div>
                    </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-r border-gray-300" onclick="sortTable('lantai')">
                        <div class="flex items-center justify-between">
                            <span>Lantai</span>
                            <span class="sort-arrows">
                                <?php if ($sortColumn == 'lantai'): ?>
                                    <?= $sortDirection == 'asc' ? '<' : '>' ?>
                                <?php else: ?>
                                    <>
                                <?php endif; ?>
                            </span>
                        </div>
                    </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-r border-gray-300" onclick="sortTable('kursi')">
                        <div class="flex items-center justify-between">
                            <span>Kursi</span>
                            <span class="sort-arrows">
                                <?php if ($sortColumn == 'kursi'): ?>
                                    <?= $sortDirection == 'asc' ? '<' : '>' ?>
                                <?php else: ?>
                                    <>
                                <?php endif; ?>
                            </span>
                        </div>
                    </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-r border-gray-300" onclick="sortTable('status')">
                        <div class="flex items-center justify-between">
                            <span>Status</span>
                            <span class="sort-arrows">
                                <?php if ($sortColumn == 'status'): ?>
                                    <?= $sortDirection == 'asc' ? '<' : '>' ?>
                                <?php else: ?>
                                    <>
                                <?php endif; ?>
                            </span>
                        </div>
                    </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border-r border-gray-300" onclick="sortTable('hit')">
                        <div class="flex items-center justify-between">
                            <span>Hit</span>
                            <span class="sort-arrows">
                                <?php if ($sortColumn == 'hit'): ?>
                                    <?= $sortDirection == 'asc' ? '<' : '>' ?>
                                <?php else: ?>
                                    <>
                                <?php endif; ?>
                            </span>
                        </div>
                    </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
            </thead>
            <tbody class="bg-white">
                <?php if (empty($tables)): ?>
                <tr class="border-b border-gray-300">
                    <td colspan="7" class="px-4 py-3 text-center text-gray-500 border-r border-gray-300">No data available</td>
                </tr>
                <?php else: ?>
                <?php foreach ($tables as $index => $table): ?>
                <tr class="hover:bg-gray-50 border-b border-gray-300">
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300"><?= $startRecord + $index ?></td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-blue-600 font-medium border-r border-gray-300"><?= htmlspecialchars($table['no_meja']) ?></td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300"><?= htmlspecialchars($table['lantai']) ?></td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300"><?= htmlspecialchars($table['kursi']) ?></td>
                    <td class="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            <?= $table['status'] === 'Kosong' ? 'bg-green-100 text-green-800' : 
                                ($table['status'] === 'Terisi' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800') ?>">
                            <?= htmlspecialchars($table['status']) ?>
                        </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300"><?= htmlspecialchars($table['hit']) ?></td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button type="button" class="text-blue-600 hover:text-blue-900 mr-2" onclick="editTable(<?= $table['id'] ?>)">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="text-red-600 hover:text-red-900" onclick="deleteTable(<?= $table['id'] ?>)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
                <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
        </div>
        
        <!-- Pagination -->
        <div class="border-t border-gray-300 p-3">
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600">
                    Showing <?= $startRecord ?> to <?= $endRecord ?> of <?= $totalRecords ?> entries
                </div>
        <div class="flex space-x-1">
            <button class="pagination-btn <?= $page <= 1 ? 'disabled' : '' ?>" 
                    onclick="goToPage('first')" 
                    <?= $page <= 1 ? 'disabled' : '' ?>
                    title="First Page">First</button>
            <button class="pagination-btn <?= $page <= 1 ? 'disabled' : '' ?>" 
                    onclick="goToPage('prev')" 
                    <?= $page <= 1 ? 'disabled' : '' ?>
                    title="Previous Page">Previous</button>
            
            <?php
            // Generate page numbers
            $startPage = max(1, $page - 2);
            $endPage = min($totalPages, $page + 2);
            
            for ($i = $startPage; $i <= $endPage; $i++):
            ?>
            <button class="pagination-btn <?= $i == $page ? 'active' : '' ?>" 
                    onclick="goToPage(<?= $i ?>)"><?= $i ?></button>
            <?php endfor; ?>
            
            <?php if ($endPage < $totalPages): ?>
            <span class="pagination-btn disabled">...</span>
            <button class="pagination-btn" onclick="goToPage(<?= $totalPages ?>)"><?= $totalPages ?></button>
            <?php endif; ?>
            
            <button class="pagination-btn <?= $page >= $totalPages ? 'disabled' : '' ?>" 
                    onclick="goToPage('next')" 
                    <?= $page >= $totalPages ? 'disabled' : '' ?>
                    title="Next Page">Next</button>
            <button class="pagination-btn <?= $page >= $totalPages ? 'disabled' : '' ?>" 
                    onclick="goToPage('last')" 
                    <?= $page >= $totalPages ? 'disabled' : '' ?>
                    title="Last Page">Last</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal for Create/Edit -->
<div id="tableModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-6 border w-[500px] shadow-lg rounded-md bg-white">
        <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-6 text-center border-b pb-3" id="modalTitle">Add New Table</h3>
            <form id="tableForm">
                <input type="hidden" id="tableId" name="id">
                <input type="hidden" id="formAction" name="action" value="create">
                
                <!-- Form Table Structure -->
                <div class="overflow-hidden rounded-lg border border-gray-200">
                    <table class="w-full">
                        <tbody class="divide-y divide-gray-200">
                            <tr class="bg-gray-50">
                                <td class="px-4 py-3 text-sm font-medium text-gray-700 w-1/3 border-r border-gray-200">
                                    Nama Cabang
                                </td>
                                <td class="px-4 py-3">
                                    <select id="namaCabang" name="nama_cabang" class="form-select w-full" required>
                                        <option value="HOTEL NEW IDOLA">HOTEL NEW IDOLA</option>
                                    </select>
                                </td>
                            </tr>
                            
                            <tr class="bg-white">
                                <td class="px-4 py-3 text-sm font-medium text-gray-700 w-1/3 border-r border-gray-200">
                                    No Meja
                                </td>
                                <td class="px-4 py-3">
                                    <input type="text" id="noMeja" name="no_meja" class="form-input w-full" required 
                                           placeholder="Masukkan nomor meja">
                                </td>
                            </tr>
                            
                            <tr class="bg-gray-50">
                                <td class="px-4 py-3 text-sm font-medium text-gray-700 w-1/3 border-r border-gray-200">
                                    Jumlah Kursi
                                </td>
                                <td class="px-4 py-3">
                                    <input type="number" id="kursi" name="kursi" class="form-input w-full" min="1" required 
                                           placeholder="Jumlah kursi">
                                </td>
                            </tr>
                            
                            <tr class="bg-white">
                                <td class="px-4 py-3 text-sm font-medium text-gray-700 w-1/3 border-r border-gray-200">
                                    Lantai
                                </td>
                                <td class="px-4 py-3">
                                    <select id="lantai" name="lantai" class="form-select w-full" required>
                                        <option value="">Pilih Lantai</option>
                                        <option value="1">Lantai 1</option>
                                        <option value="2">Lantai 2</option>
                                        <option value="3">Lantai 3</option>
                                    </select>
                                </td>
                            </tr>
                            
                            <tr class="bg-gray-50">
                                <td class="px-4 py-3 text-sm font-medium text-gray-700 w-1/3 border-r border-gray-200">
                                    Status
                                </td>
                                <td class="px-4 py-3">
                                    <select id="status" name="status" class="form-select w-full" required>
                                        <option value="">Pilih Status</option>
                                        <option value="Kosong">Kosong</option>
                                        <option value="Terisi">Terisi</option>
                                        <option value="Maintenance">Maintenance</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                    <button type="button" class="btn-table-cancel" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn-table-save">Save</button>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
.btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
}
.btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-primary-simple {
    background-color: #3b82f6;
    color: #ffffff;
    border: 1px solid #3b82f6;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary-simple:hover {
    background-color: #2563eb;
    border-color: #2563eb;
}

.btn-primary-highlighted {
    background-color: #1d4ed8;
    color: #ffffff;
    box-shadow: 0 4px 14px 0 rgba(29, 78, 216, 0.39);
    border: 2px solid #1d4ed8;
    transition: all 0.3s ease;
}

.btn-primary-highlighted:hover {
    background-color: #1e40af;
    box-shadow: 0 6px 20px 0 rgba(29, 78, 216, 0.5);
    transform: translateY(-1px);
}

.btn-secondary {
    @apply bg-gray-300 text-gray-700 hover:bg-gray-400;
}

/* Compact form controls */
.form-input-compact, .form-select-compact {
    @apply border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
    min-width: 120px;
}

.form-input-compact {
    width: 200px;
}

.form-select-compact {
    width: 140px; /* Increased width for "Hotel New Idola" text */
}

/* Template Style Form Controls */
.form-input-template, .form-select-template {
    border: 1px solid #d1d5db;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 14px;
    background-color: #ffffff;
    color: #374151;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    outline: none;
    vertical-align: middle;
    line-height: 1.4;
}

.form-input-template {
    width: 200px;
}

.form-select-template {
    width: 150px;
}

.form-input-template:focus, .form-select-template:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form-input-template::placeholder {
    color: #9ca3af;
    font-size: 13px;
}

/* Label alignment with form controls */
.form-label {
    line-height: 1.4;
    vertical-align: middle;
    display: inline-flex;
    align-items: center;
}

/* Sort arrows styling */
.sort-arrows {
    font-size: 10px;
    color: #9ca3af;
    font-weight: bold;
    margin-left: 4px;
    transition: color 0.2s ease;
    font-family: monospace;
    letter-spacing: 0px;
    line-height: 0.7;
    display: inline-block;
    vertical-align: middle;
}

th:hover .sort-arrows {
    color: #3b82f6;
}

/* Template layout spacing */
.space-x-6 > * + * {
    margin-left: 1.5rem;
}

.space-x-2 > * + * {
    margin-left: 0.5rem;
}

/* Table with Borders - Real Table Look */
.table-bordered {
    border-collapse: collapse !important;
}

.table-bordered th,
.table-bordered td {
    border: 1px solid #d1d5db !important;
}

.table-bordered thead th {
    border-bottom: 2px solid #9ca3af !important;
    background-color: #f9fafb;
    font-weight: 600;
}

.table-bordered tbody tr:nth-child(even) {
    background-color: #fafafa;
}

.table-bordered tbody tr:nth-child(odd) {
    background-color: #ffffff;
}

.table-bordered tbody tr:hover {
    background-color: #f0f9ff !important;
}

/* Enhanced table container */
.table-container-bordered {
    border: 2px solid #d1d5db;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Table Form Modal Styles */
.btn-table-cancel {
    padding: 8px 16px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background-color: #ffffff;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-table-cancel:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
}

.btn-table-save {
    padding: 8px 16px;
    border: 1px solid #3b82f6;
    border-radius: 6px;
    background-color: #3b82f6;
    color: #ffffff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-table-save:hover {
    background-color: #2563eb;
    border-color: #2563eb;
}

/* Enhanced form table styles */
#tableModal .form-input, #tableModal .form-select {
    border: 1px solid #d1d5db;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

#tableModal .form-input:focus, #tableModal .form-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

#tableModal .form-input::placeholder {
    color: #9ca3af;
}

/* Table form cell styling */
#tableModal table td:first-child {
    background-color: #f8fafc;
    font-weight: 500;
}

#tableModal table tr:hover td {
    background-color: #f1f5f9;
}

.form-input, .form-select {
    @apply border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

/* Enhanced table styles */
.table-container {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead th {
    background-color: #f8fafc;
    padding: 12px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e2e8f0;
}

tbody td {
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 14px;
    color: #1e293b;
}

tbody tr:hover {
    background-color: #f8fafc;
}

/* Action buttons */
.action-btn {
    padding: 6px 8px;
    margin: 0 2px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.15s ease-in-out;
}

.action-btn:hover {
    background-color: #f1f5f9;
}

.action-btn i {
    font-size: 14px;
}

.action-btn.edit i {
    color: #3b82f6;
}

.action-btn.delete i {
    color: #ef4444;
}

/* Pagination styles */
.pagination-btn {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 14px;
    background-color: #ffffff;
    color: #374151;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
}

.pagination-btn:hover:not(.disabled) {
    background-color: #f9fafb;
    border-color: #9ca3af;
}

.pagination-btn.active {
    background-color: #3b82f6;
    color: #ffffff;
    border-color: #3b82f6;
}

.pagination-btn.disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

/* Status badges */
.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

/* Modal improvements */
.modal-content {
    max-width: 400px;
    width: 90%;
}

/* Responsive design */
@media (max-width: 768px) {
    .flex.flex-wrap {
        flex-direction: column;
        align-items: stretch;
    }
    
    .form-input-compact {
        width: 100%;
    }
    
    .pagination-btn {
        padding: 4px 8px;
        font-size: 12px;
    }
}
</style>

<script>
// JavaScript functions
function openCreateModal() {
    document.getElementById('modalTitle').textContent = 'Add New Table';
    document.getElementById('formAction').value = 'create';
    document.getElementById('tableForm').reset();
    document.getElementById('tableModal').classList.remove('hidden');
}

function editTable(id) {
    document.getElementById('modalTitle').textContent = 'Edit Table';
    document.getElementById('formAction').value = 'update';
    
    // Fetch table data
    fetch('', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `action=get&id=${id}`
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('tableId').value = data.id;
        document.getElementById('namaCabang').value = data.nama_cabang;
        document.getElementById('noMeja').value = data.no_meja;
        document.getElementById('lantai').value = data.lantai;
        document.getElementById('kursi').value = data.kursi;
        document.getElementById('status').value = data.status;
        document.getElementById('tableModal').classList.remove('hidden');
    });
}

function deleteTable(id) {
    if (confirm('Are you sure you want to delete this table?')) {
        fetch('', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `action=delete&id=${id}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        });
    }
}

function closeModal() {
    document.getElementById('tableModal').classList.add('hidden');
}

function applyFilter() {
    const filter = document.getElementById('filterStatus').value;
    const search = document.getElementById('searchInput').value;
    const entries = document.getElementById('showEntries').value;
    window.location.href = `?module=master-meja&filter=${encodeURIComponent(filter)}&search=${encodeURIComponent(search)}&entries=${entries}&page=1`;
}

function handleSearch(event) {
    if (event.key === 'Enter') {
        applyFilter();
    }
}

function changeShowEntries() {
    const showEntries = document.getElementById('showEntries').value;
    const filter = document.getElementById('filterStatus').value;
    const search = document.getElementById('searchInput').value;
    window.location.href = `?module=master-meja&filter=${encodeURIComponent(filter)}&search=${encodeURIComponent(search)}&entries=${showEntries}&page=1`;
}

function goToPage(page) {
    const filter = document.getElementById('filterStatus').value;
    const search = document.getElementById('searchInput').value;
    const entries = document.getElementById('showEntries').value;
    const currentPage = getCurrentPage();
    const totalPages = <?= $totalPages ?>;
    
    // Handle different page types
    let targetPage = 1;
    if (page === 'first') targetPage = 1;
    else if (page === 'last') targetPage = totalPages;
    else if (page === 'prev') targetPage = Math.max(1, currentPage - 1);
    else if (page === 'next') targetPage = Math.min(totalPages, currentPage + 1);
    else targetPage = page;
    
    // Update URL with pagination
    window.location.href = `?module=master-meja&filter=${encodeURIComponent(filter)}&search=${encodeURIComponent(search)}&entries=${entries}&page=${targetPage}&sort=<?= $sortColumn ?>&dir=<?= $sortDirection ?>`;
}

function getCurrentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('page')) || 1;
}

function sortTable(column) {
    const filter = document.getElementById('filterStatus').value;
    const search = document.getElementById('searchInput').value;
    const entries = document.getElementById('showEntries').value;
    const page = getCurrentPage();
    
    // Toggle sort direction
    const currentSort = localStorage.getItem('sortColumn');
    const currentDir = localStorage.getItem('sortDirection') || 'asc';
    const newDir = (currentSort === column && currentDir === 'asc') ? 'desc' : 'asc';
    
    localStorage.setItem('sortColumn', column);
    localStorage.setItem('sortDirection', newDir);
    
    window.location.href = `?module=master-meja&filter=${encodeURIComponent(filter)}&search=${encodeURIComponent(search)}&entries=${entries}&page=${page}&sort=${column}&dir=${newDir}`;
}

// Form submission
document.getElementById('tableForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    fetch('', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeModal();
            location.reload();
        } else {
            alert('Error: ' + data.message);
        }
    });
});

// Close modal when clicking outside
document.getElementById('tableModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});
</script>
