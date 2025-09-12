<?php
// Modul Refresh Room Status
// Kategori: FRONTOFFICE
// Sub-Kategori: FORM

// Periksa apakah user sudah login
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

// Include koneksi database
require_once $_SERVER['DOCUMENT_ROOT'] . '/hotel-system/config/database.php';

$db = new Database();
$conn = $db->getConnection();

// Handle form submission for room status refresh
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (isset($_POST['refresh_all'])) {
            // Refresh all room statuses
            $stmt = $conn->prepare("UPDATE rooms SET status = 'available' WHERE status = 'dirty'");
            $stmt->execute();
            $success_message = "All room statuses refreshed successfully!";
        }
    } catch (Exception $e) {
        $error_message = "Error updating room status: " . $e->getMessage();
    }
}
?>

<style>
/* Enhanced fonts for better readability */
.enhanced-form {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.enhanced-form label {
    font-size: 13px !important;
    font-weight: 600 !important;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
}
.enhanced-form input, .enhanced-form select, .enhanced-form textarea {
    font-size: 13px !important;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
}
.enhanced-form h2 {
    font-size: 16px !important;
    font-weight: 600 !important;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
}
.enhanced-form button {
    font-size: 13px !important;
    font-weight: 600 !important;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
}
</style>

<?php if (isset($success_message)): ?>
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        <?= htmlspecialchars($success_message) ?>
    </div>
<?php endif; ?>
    
<?php if (isset($error_message)): ?>
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <?= htmlspecialchars($error_message) ?>
    </div>
<?php endif; ?>

<div class="border border-gray-300 bg-white enhanced-form">
    <div class="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-300">
        <h2 class="text-xs font-semibold text-gray-800">REFRESH ROOM STATUS</h2>
        <button type="button" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">
            Room Management
        </button>
    </div>

    <div class="p-6">
        <div class="text-center">
            <h3 class="text-lg font-medium text-gray-700 mb-4">Refresh All Dirty Rooms to Available</h3>
            <form method="POST" class="inline">
                <button type="submit" name="refresh_all" class="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-base font-medium shadow-lg">
                    Refresh All Room Status
                </button>
            </form>
            <p class="text-sm text-gray-600 mt-3">This will change all rooms with "Dirty" status to "Available" status.</p>
        </div>
    </div>
</div>