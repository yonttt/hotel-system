<?php
/**
 * Eva Group Hotel Management System - Main Dashboard
 * * This is the main application file that handles:
 * - User authentication and session management
 * - Sidebar navigation and module routing
 * - Dashboard layout and structure
 * * @author Yonttt
 * @version 2.0
 * @since 2025
 */

// Core includes and authentication
require_once 'includes/auth.php';

$auth = new Auth();
$auth->requireLogin();

// User session variables
$username = $_SESSION['username'] ?? 'User';
$userRole = $_SESSION['user_role'] ?? 'guest';

// Handle logout request
if (isset($_GET['logout'])) {
    $auth->logout();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eva Group Hotel Management System - Home</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="js/fast-loader.js" defer></script>
    <script src="js/dashboard-scripts.js" defer></script>
</head>

<body class="dashboard-page">
    <div class="flex h-screen bg-gray-100">
        
        <aside class="sidebar">
            <div class="sidebar-header">
                <h1 class="sidebar-brand">EVA GROUP HOTEL MANAGEMENT</h1>
            </div>

            <nav class="sidebar-nav">
                <ul class="space-y-2">
                    
                    <li class="nav-item">
                        <a href="#" onclick="resetSidebarAndGoHome(); return false;" class="nav-link active">
                            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            HOME
                        </a>
                    </li>
                    
                    <li class="nav-group">
                        <button class="nav-group-header" onclick="toggleSubmenu('operational')">
                            <div style="display: flex; align-items: center;">
                                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                </svg>
                                OPERATIONAL
                            </div>
                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                        
                        <ul class="nav-submenu" id="operational-submenu">
                            
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('adjustment')">
                                    <span>Adjustment</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                
                                <ul class="nav-submenu" id="adjustment-submenu">
                                    
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentfoodbeverage')">
                                            <span>Food & Beverage</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentfoodbeverage-submenu">
                                            <li><a href="home.php?module=adjustment/foodbeverage/transaction_history&title=Riwayat Transaksi" class="nav-link">Riwayat Transaksi</a></li>
                                            <li><a href="home.php?module=adjustment/foodbeverage/transaction_history&title=Transaction History" class="nav-link">Transaction History</a></li>
                                        </ul>
                                    </li>
                                    
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentfrontoffice')">
                                            <span>Front Office</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentfrontoffice-submenu">
                                            <li><a href="home.php?module=adjustment/frontoffice/additional_deposit&title=Additional Deposit" class="nav-link">Additional Deposit</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/charge_to_room&title=Charge To Room" class="nav-link">Charge To Room</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/clearance_deposit&title=Clearance Deposit" class="nav-link">Clearance Deposit</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/clearance_deposit_pending&title=Clearance Deposit Pending" class="nav-link">Clearance Deposit Pending</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/double_checkin&title=Double Checkin" class="nav-link">Double Checkin</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/extra_bed&title=Extra Bed" class="nav-link">Extra Bed</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/extrabill&title=Extrabill" class="nav-link">Extrabill</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/guest_ledger&title=Guest Ledger" class="nav-link">Guest Ledger</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/late_checkout&title=Late Checkout" class="nav-link">Late Checkout</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/market_segment&title=Market Segment" class="nav-link">Market Segment</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/night_audit&title=Night Audit" class="nav-link">Night Audit</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/other_extrabill&title=Other Extrabill" class="nav-link">Other Extrabill</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/payment_pending&title=Payment Pending" class="nav-link">Payment Pending</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/payment&title=Pembayaran" class="nav-link">Pembayaran</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/refund&title=Refund" class="nav-link">Refund</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/reprocess_clearance&title=Reprocess Clearance" class="nav-link">Reprocess Clearance</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/room_charge&title=Room Charge" class="nav-link">Room Charge</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/room_status&title=Status Kamar" class="nav-link">Status Kamar</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/upnormal_payment&title=Upnormal Payment" class="nav-link">Upnormal Payment</a></li>
                                        </ul>
                                    </li>
                                    
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentkos')">
                                            <span>Kos</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentkos-submenu">
                                            <li><a href="home.php?module=adjustment/kos/payment&title=Kos Pembayaran" class="nav-link">Pembayaran</a></li>
                                            <li><a href="home.php?module=adjustment/kos/room_charge&title=Kos Room Charge" class="nav-link">Room Charge</a></li>
                                        </ul>
                                    </li>
                                    
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentlaundry')">
                                            <span>Laundry</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentlaundry-submenu">
                                            <li><a href="home.php?module=laundry/form/laundry_order&title=Transaksi Laundry" class="nav-link">Transaksi Laundry</a></li>
                                        </ul>
                                    </li>
                                    
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentmeetingroom')">
                                            <span>Meeting Room</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentmeetingroom-submenu">
                                            <li><a href="home.php?module=adjustment/meetingroom/meeting_room_deposit&title=Meeting Room Deposit" class="nav-link">Meeting Room Deposit</a></li>
                                            <li><a href="home.php?module=adjustment/meetingroom/meeting_room_refund&title=Meeting Room Refund" class="nav-link">Meeting Room Refund</a></li>
                                            <li><a href="home.php?module=adjustment/meetingroom/meeting_room_trans&title=Meeting Room Trans" class="nav-link">Meeting Room Trans</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('foodbeverage')">
                                    <span>Food & Beverage</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="foodbeverage-submenu">
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('foodbeveragechart')">
                                            <span>Chart & Presentase</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="foodbeveragechart-submenu">
                                            <li><a href="home.php?module=foodbeverage/chart/menu_fast_moving&title=Menu Fast Moving" class="nav-link">Menu Fast Moving</a></li>
                                            <li><a href="home.php?module=foodbeverage/chart/menu_slow_moving&title=Menu Slow Moving" class="nav-link">Menu Slow Moving</a></li>
                                            <li><a href="home.php?module=foodbeverage/chart/sales_chart&title=Penjualan" class="nav-link">Penjualan</a></li>
                                            <li><a href="home.php?module=foodbeverage/chart/sales_by_category&title=Penjualan Perkategori" class="nav-link">Penjualan Perkategori</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('foodbeverageform')">
                                            <span>Form Transaksi</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="foodbeverageform-submenu">
                                            <li><a href="home.php?module=foodbeverage/form/direct_purchase&title=F&B Pembelian Langsung" class="nav-link">F&B Pembelian Langsung</a></li>
                                            <li><a href="home.php?module=foodbeverage/form/stock_request&title=Permintaan Stok F & B" class="nav-link">Permintaan Stok F & B</a></li>
                                            <li><a href="home.php?module=foodbeverage/form/external_guest&title=Tamu Luar" class="nav-link">Tamu Luar</a></li>
                                            <li><a href="home.php?module=foodbeverage/form/event_menu_setup&title=Atur Event Menu" class="nav-link">Atur Event Menu</a></li>
                                            <li><a href="home.php?module=foodbeverage/form/sales_transaction&title=Transaksi Penjualan" class="nav-link">Transaksi Penjualan</a></li>
                                            <li><a href="home.php?module=foodbeverage/form/pending_transaction&title=Transaksi Pending" class="nav-link">Transaksi Pending</a></li>
                                            <li><a href="home.php?module=foodbeverage/form/item_usage&title=Pemakaian Barang F&B" class="nav-link">Pemakaian Barang F&B</a></li>
                                            <li><a href="home.php?module=foodbeverage/form/expired_damaged_items&title=Barang Expire / Rusak F&B" class="nav-link">Barang Expire / Rusak F&B</a></li>
                                            <li><a href="home.php?module=foodbeverage/form/restaurant_stock_taking&title=Stok Opname Resto" class="nav-link">Stok Opname Resto</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('foodbeverageinfo')">
                                            <span>Informasi</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="foodbeverageinfo-submenu">
                                            <li><a href="home.php?module=foodbeverage/info/stock_request_info&title=Info Permintaan Stok F&B" class="nav-link">Info Permintaan Stok F&B</a></li>
                                            <li><a href="home.php?module=foodbeverage/info/today_transaction&title=Transaksi Hari ini" class="nav-link">Transaksi Hari ini</a></li>
                                            <li><a href="home.php?module=foodbeverage/info/room_service_request&title=Permintaan Room Service" class="nav-link">Permintaan Room Service</a></li>
                                            <li><a href="home.php?module=foodbeverage/info/receivable_info&title=Info Piutang F&B" class="nav-link">Info Piutang F&B</a></li>
                                            <li><a href="home.php?module=foodbeverage/info/item_stock_info&title=Info Stok Barang F&B" class="nav-link">Info Stok Barang F&B</a></li>
                                            <li><a href="home.php?module=foodbeverage/info/stock_card&title=Kartu Stok F&B" class="nav-link">Kartu Stok F&B</a></li>
                                            <li><a href="home.php?module=foodbeverage/info/banquet_receivable&title=Piutang Banquet" class="nav-link">Piutang Banquet</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('foodbeveragelaporan')">
                                            <span>Laporan</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="foodbeveragelaporan-submenu">
                                            <li><a href="home.php?module=foodbeverage/laporan/night_audit_fnb&title=Night Audit F&B" class="nav-link">Night Audit F&B</a></li>
                                            <li><a href="home.php?module=foodbeverage/laporan/restaurant_sales_per_item&title=Penjualan Resto Per Item" class="nav-link">Penjualan Resto Per Item</a></li>
                                            <li><a href="home.php?module=foodbeverage/laporan/restaurant_sales&title=Penjualan Restaurant" class="nav-link">Penjualan Restaurant</a></li>
                                            <li><a href="home.php?module=foodbeverage/laporan/shift_report&title=Shift Report" class="nav-link">Shift Report</a></li>
                                            <li><a href="home.php?module=foodbeverage/laporan/restaurant_guest_report&title=Lap Tamu Resto" class="nav-link">Lap Tamu Resto</a></li>
                                            <li><a href="home.php?module=foodbeverage/laporan/restaurant_stocktaking_history&title=Riwayat S/O Resto" class="nav-link">Riwayat S/O Resto</a></li>
                                            <li><a href="home.php?module=foodbeverage/laporan/restaurant_shift_report&title=Resto Shift Report" class="nav-link">Resto Shift Report</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('foodbeveragemaster')">
                                            <span>Master Data</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="foodbeveragemaster-submenu">
                                            <li><a href="home.php?module=foodbeverage/master/master_discount&title=Master Discount" class="nav-link">Master Discount</a></li>
                                            <li><a href="home.php?module=foodbeverage/master/table_master&title=Master Meja" class="nav-link">Master Meja</a></li>
                                            <li><a href="home.php?module=foodbeverage/master/restaurant_menu_master&title=Master Menu Resto" class="nav-link">Master Menu Resto</a></li>
                                            <li><a href="home.php?module=foodbeverage/master/restaurant_menu_category&title=Kategori Menu Resto" class="nav-link">Kategori Menu Resto</a></li>
                                            <li><a href="home.php?module=foodbeverage/master/restaurant_menu_type&title=Jenis Menu Resto" class="nav-link">Jenis Menu Resto</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('frontoffice')">
                                    <span>Front Office</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="frontoffice-submenu">
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficechart')">
                                            <span>Chart & Presentase</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficechart-submenu">
                                            <li><a href="home.php?module=frontoffice/chart/monthly_room_chart&title=Chart Kamar Per Bulan" class="nav-link">Guest By City</a></li>
                                            <li><a href="home.php?module=frontoffice/chart/monthly_revenue_chart&title=Chart Pendapatan Bulanan" class="nav-link">Guest By Nation</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficeform')">
                                            <span>Form Transaksi</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficeform-submenu">
                                            <li><a href="home.php?module=frontoffice/form/direct_purchase_fo&title=Check In Tamu" class="nav-link">Direct Purchase FO</a></li>
                                            <li><a href="home.php?module=frontoffice/form/refresh_room_status&title=Check Out Tamu" class="nav-link">Refresh Room Status</a></li>
                                            <li><a href="home.php?module=frontoffice/form/group_registration&title=Buat Reservasi" class="nav-link">Registrasi Group</a></li>
                                            <li><a href="home.php?module=frontoffice/form/laundry_transaction&title=Ubah Reservasi" class="nav-link">Transaksi Laundry</a></li>
                                            <li><a href="home.php?module=frontoffice/form/reservation&title=Batal Reservasi" class="nav-link">Form Reservasi Kamar</a></li>
                                            <li><a href="home.php?module=frontoffice/form/registration&title=Extend Stay" class="nav-link">Form Registrasi Kamar</a></li>
                                            <li><a href="home.php?module=frontoffice/form/kost_registration&title=Early Check Out" class="nav-link">Form Registrasi Kost</a></li>
                                            <li><a href="home.php?module=frontoffice/form/kost_reservation&title=Room Move" class="nav-link">Form Reservasi Kost</a></li>
                                            <li><a href="home.php?module=frontoffice/form/meeting_room_transaction&title=Split Room" class="nav-link">Transaksi Meeting Room</a></li>
                                            <li><a href="home.php?module=frontoffice/form/extrabill_form&title=Join Room" class="nav-link">Form Extrabill</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficeinfo')">
                                            <span>Info Reservasi</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficeinfo-submenu">
                                            <li><a href="home.php?module=frontoffice/informasi_reservasi/reservation_today&title=Reservation Today" class="nav-link">Reservation Today</a></li>
                                            <li><a href="home.php?module=frontoffice/informasi_reservasi/reservation_by_deposit&title=Reservation By Deposit" class="nav-link">Reservation By Deposit</a></li>
                                            <li><a href="home.php?module=frontoffice/informasi_reservasi/all_reservation&title=All Reservation List" class="nav-link">All Reservation</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficeinformasi')">
                                            <span>Informasi</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficeinformasi-submenu">
                                            <li><a href="home.php?module=frontoffice/info/room_availability_info&title=Info Kamar Available" class="nav-link">Info Stock Extrabill</a></li>
                                            <li><a href="home.php?module=frontoffice/info/inhouse_guest_info&title=Guest History" class="nav-link">Group List</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficeinformasitamu')">
                                            <span>Informasi Tamu</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficeinformasitamu-submenu">
                                            <li><a href="home.php?module=frontoffice/informasi_tamu/guest_research&title=Guest Research" class="nav-link">Guest Research</a></li>
                                            <li><a href="home.php?module=frontoffice/informasi_tamu/today_checkin_info&title=Check In Today" class="nav-link">Check in Today</a></li>
                                            <li><a href="home.php?module=frontoffice/informasi_tamu/early_checkin_info&title=Early Checkin" class="nav-link">Early Checkin</a></li>
                                            <li><a href="home.php?module=frontoffice/informasi_tamu/pending_checkout_info&title=Expected Departure" class="nav-link">Expected Departure</a></li>
                                            <li><a href="home.php?module=frontoffice/informasi_tamu/meeting_room_info&title=Meeting Room Info" class="nav-link">Meeting Room Info</a></li>
                                            <li><a href="home.php?module=frontoffice/informasi_tamu/today_checkout_info&title=Checkout Today" class="nav-link">Checkout Today</a></li>
                                            <li><a href="home.php?module=frontoffice/informasi_tamu/room_move_info&title=Change Room" class="nav-link">Change Room</a></li>
                                            <li><a href="home.php?module=frontoffice/informasi_tamu/no_show_report&title=Cancellation Today" class="nav-link">Cancellation Today</a></li>
                                            <li><a href="home.php?module=adjustment/frontoffice/refund&title=Refund Deposit" class="nav-link">Refund</a></li>
                                            <li><a href="home.php?module=frontoffice/informasi_tamu/blacklist_guest&title=Skipper" class="nav-link">Skipper</a></li>
                                            <li><a href="home.php?module=frontoffice/informasi_tamu/guest_history&title=Guest History" class="nav-link">Guest History</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficelaporan')">
                                            <span>Laporan</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficelaporan-submenu">
                                            <li><a href="home.php?module=frontoffice/laporan/actual_shift_report&title=Actual Shift Report" class="nav-link">Actual Shift Report</a></li>
                                            <li><a href="home.php?module=frontoffice/master/blacklist_management&title=Blacklist Management" class="nav-link">Daftar Blacklist</a></li>
                                            <li><a href="home.php?module=frontoffice/laporan/night_audit_report&title=Night Audit Report" class="nav-link">Shift Report</a></li>
                                            <li><a href="home.php?module=frontoffice/laporan/room_revenue_report&title=Room Revenue Report" class="nav-link">Lap Aktivitas User</a></li>
                                            <li><a href="home.php?module=frontoffice/laporan/occupancy_report&title=Occupancy Report" class="nav-link">Lost & Found</a></li>
                                            <li><a href="home.php?module=frontoffice/laporan/adr_revpar_report&title=ADR RevPAR Report" class="nav-link">Extrabed</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficemasterdata')">
                                            <span>Master Data</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficemasterdata-submenu">
                                            <li><a href="home.php?module=frontoffice/status/room_maintenance_status&title=Room Maintenance Status" class="nav-link">Ubah Status Kamar</a></li>
                                            <li><a href="home.php?module=frontoffice/master/room_rate_master&title=Master Rate Kamar" class="nav-link">Master Harga Kamar</a></li>
                                            <li><a href="home.php?module=frontoffice/master/master_charge_code&title=Master Charge Code" class="nav-link">Add Charge Meeting Room</a></li>
                                            <li><a href="home.php?module=frontoffice/master/master_package&title=Master Package" class="nav-link">Additional Meeting Room</a></li>
                                            <li><a href="home.php?module=frontoffice/master/master_voucher&title=Master Voucher" class="nav-link">Meeting Room Package</a></li>
                                            <li><a href="home.php?module=frontoffice/laporan/market_segment_analysis&title=Market Segment Analysis" class="nav-link">Meeting Room Segment</a></li>
                                            <li><a href="home.php?module=frontoffice/master/master_guest&title=Master Guest" class="nav-link">Pengaturan Admin</a></li>
                                            <li><a href="home.php?module=frontoffice/master/master_charge_code&title=Master Charge Code" class="nav-link">Master Extra Bill</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficestatuskamar')">
                                            <span>Status Kamar</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficestatuskamar-submenu">
                                            <li><a href="home.php?module=frontoffice/status/room_status_realtime&title=Room Status Real Time" class="nav-link">Status Kamar FO</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('housekeeping')">
                                    <span>Housekeeping</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="housekeeping-submenu">
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('housekeepingchart')">
                                            <span>Chart & Presentase</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="housekeepingchart-submenu">
                                            <li><a href="home.php?module=housekeeping/chart/chart_room_cleaning&title=Chart Room Cleaning" class="nav-link">Out Of Order Room</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('housekeepingform')">
                                            <span>Form Transaksi</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="housekeepingform-submenu">
                                            <li><a href="home.php?module=housekeeping/form/room_assignment&title=Room Assignment" class="nav-link">Form Kamar OO</a></li>
                                            <li><a href="home.php?module=housekeeping/form/cleaning_schedule&title=Cleaning Schedule" class="nav-link">HK Pembelian Langsung</a></li>
                                            <li><a href="home.php?module=laundry/form/linen_exchange&title=Linen Exchange" class="nav-link">Penerimaan Linen</a></li>
                                            <li><a href="home.php?module=laundry/form/linen_exchange&title=Linen Exchange" class="nav-link">Pengiriman Linen</a></li>
                                            <li><a href="home.php?module=housekeeping/form/inventory_request&title=Inventory Request" class="nav-link">Permintaan Stok HK</a></li>
                                            <li><a href="home.php?module=housekeeping/form/maintenance_request_hk&title=Maintenance Request" class="nav-link">Form O O Request</a></li>
                                            <li><a href="home.php?module=housekeeping/form/amenities_restock&title=Amenities Restock" class="nav-link">Form Pemakaian Barang</a></li>
                                            <li><a href="home.php?module=housekeeping/form/lost_found_entry&title=Lost & Found Entry" class="nav-link">Form Loan</a></li>
                                            <li><a href="home.php?module=housekeeping/form/room_inspection&title=Room Inspection" class="nav-link">Form Tarik Extrabed</a></li>
                                            <li><a href="home.php?module=housekeeping/form/lost_found_entry&title=Lost & Found Entry" class="nav-link">Form Lose & Fund</a></li>
                                            <li><a href="home.php?module=housekeeping/form/deep_cleaning_schedule&title=Deep Cleaning Schedule" class="nav-link">Barang Rusak/Expire HK</a></li>
                                            <li><a href="home.php?module=housekeeping/form/inventory_request&title=Inventory Request" class="nav-link">Atur Par Stok</a></li>
                                            <li><a href="home.php?module=housekeeping/form/public_area_cleaning&title=Public Area Cleaning" class="nav-link">Stok Opname HK</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('housekeepinginformasi')">
                                            <span>Informasi</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="housekeepinginformasi-submenu">
                                            <li><a href="home.php?module=housekeeping/info/cleaning_progress&title=Cleaning Progress" class="nav-link">Info Direct Purchase</a></li>
                                            <li><a href="home.php?module=housekeeping/info/inventory_level&title=Inventory Level" class="nav-link">Info Permintaan Stok HK</a></li>
                                            <li><a href="home.php?module=housekeeping/info/linen_status&title=Linen Status" class="nav-link">Informasi In/Out Linen</a></li>
                                            <li><a href="home.php?module=housekeeping/info/equipment_status&title=Equipment Status" class="nav-link">Penggunaan Extrabed</a></li>
                                            <li><a href="home.php?module=housekeeping/info/room_status_hk&title=Room Status Housekeeping" class="nav-link">Laporan Kamar OO</a></li>
                                            <li><a href="home.php?module=housekeeping/info/staff_assignment&title=Staff Assignment" class="nav-link">Log Kamar</a></li>
                                            <li><a href="home.php?module=housekeeping/info/amenities_stock&title=Amenities Stock" class="nav-link">Info Stok Barang HK</a></li>
                                            <li><a href="home.php?module=housekeeping/info/room_discrepancy&title=Room Discrepancy" class="nav-link">Riwayat Stok Opname HK</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('housekeepinglaporan')">
                                            <span>Laporan</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="housekeepinglaporan-submenu">
                                            <li><a href="home.php?module=housekeeping/laporan/linen_par_level&title=Linen Par Level" class="nav-link">Laporan Stok Linen</a></li>
                                            <li><a href="home.php?module=housekeeping/laporan/room_productivity_report&title=Room Productivity Report" class="nav-link">Room Count Sheet</a></li>
                                            <li><a href="home.php?module=housekeeping/laporan/maintenance_summary&title=Maintenance Summary" class="nav-link">Riwayat Perbaikan Kamar</a></li>
                                            <li><a href="home.php?module=housekeeping/laporan/daily_housekeeping_report&title=Daily Housekeeping Report" class="nav-link">Occupancy Room</a></li>
                                            <li><a href="home.php?module=housekeeping/laporan/lost_found_report&title=Lost & Found Report" class="nav-link">Laporan Kamar OO</a></li>
                                            <li><a href="home.php?module=housekeeping/laporan/inventory_usage_report&title=Inventory Usage Report" class="nav-link">Lap Penggunaan Supplies</a></li>
                                            <li><a href="home.php?module=housekeeping/laporan/room_cleaning_report&title=Room Cleaning Report" class="nav-link">Lap Pembersihan Kamar</a></li>
                                            <li><a href="home.php?module=housekeeping/laporan/room_maintenance_history&title=Room Maintenance History" class="nav-link">Riwayat Perawatan kamar</a></li>
                                            <li><a href="home.php?module=housekeeping/laporan/extra_bed_history&title=Extra Bed History" class="nav-link">Riwayat Ext Bed</a></li>
                                            <li><a href="home.php?module=housekeeping/laporan/inspection_report&title=Inspection Report" class="nav-link">Cetak Kartu Stok HK</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('housekeepingmasterdata')">
                                            <span>Master Data</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="housekeepingmasterdata-submenu">
                                            <li><a href="home.php?module=housekeeping/info/maintenance_status&title=Maintenance Status" class="nav-link">Master Operasional</a></li>
                                            <li><a href="home.php?module=housekeeping/info/room_status_hk&title=Room Status Housekeeping" class="nav-link">Master Room Type</a></li>
                                            <li><a href="home.php?module=housekeeping/form/room_assignment&title=Room Assignment" class="nav-link">Management Room</a></li>
                                            <li><a href="home.php?module=housekeeping/form/deep_cleaning_schedule&title=Deep Cleaning Schedule" class="nav-link">Master General Cleaning</a></li>
                                            <li><a href="home.php?module=housekeeping/form/cleaning_schedule&title=Cleaning Schedule" class="nav-link">Daftar Kamar GC</a></li>
                                            <li><a href="home.php?module=housekeeping/form/room_inspection&title=Room Inspection" class="nav-link">Master Kamar OO</a></li>
                                            <li><a href="home.php?module=housekeeping/form/maintenance_request_hk&title=Maintenance Request" class="nav-link">Jadwal Maintenance</a></li>
                                            <li><a href="home.php?module=frontoffice/master/room_type_master&title=Room Type Kost" class="nav-link">Room Type Kost</a></li>
                                            <li><a href="home.php?module=frontoffice/master/room_master&title=Master Room Kost" class="nav-link">Master Room Kost</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('housekeepingstatuskamar')">
                                            <span>Status Kamar</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="housekeepingstatuskamar-submenu">
                                            <li><a href="home.php?module=housekeeping/info/room_status_hk&title=Room Status Housekeeping" class="nav-link">Status Kamar</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('laundry')">
                                    <span>Laundry</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="laundry-submenu">
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('laundryform')">
                                            <span>Form Transaksi</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="laundryform-submenu">
                                            <li><a href="home.php?module=laundry/form/linen_exchange&title=Linen Exchange" class="nav-link">Penerimaan Linen</a></li>
                                            <li><a href="home.php?module=laundry/form/linen_exchange&title=Linen Exchange" class="nav-link">Pengiriman Linen</a></li>
                                            <li><a href="home.php?module=laundry/form/laundry_order&title=Laundry Order" class="nav-link">Stok Opname Laundry</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('laundrylaporan')">
                                            <span>Laporan</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="laundrylaporan-submenu">
                                            <li><a href="home.php?module=housekeeping/info/linen_status&title=Linen Status" class="nav-link">In/Out Linen</a></li>
                                            <li><a href="home.php?module=laundry/laporan/laundry_report&title=Laundry Report" class="nav-link">Lap Stok Opname Laundry</a></li>
                                            <li><a href="home.php?module=housekeeping/laporan/linen_par_level&title=Linen In Progress" class="nav-link">Linen In Progress</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('laundrymasterdata')">
                                            <span>Master Data</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="laundrymasterdata-submenu">
                                            <li><a href="home.php?module=housekeeping/info/amenities_stock&title=Laundry Amenities Stock" class="nav-link">Master Barang Laundry</a></li>
                                            <li><a href="home.php?module=housekeeping/info/linen_status&title=Linen Status" class="nav-link">Master Barang Linen</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    
                    <li class="nav-group">
                        <button class="nav-group-header" onclick="toggleSubmenu('hrd')">
                            <div style="display: flex; align-items: center;">
                                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                HRD
                            </div>
                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                        
                        <ul class="nav-submenu" id="hrd-submenu">
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('accountreceivable')">
                                    <span>Account Receivable</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="accountreceivable-submenu">
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('ar-laporan')">
                                            <span>Laporan</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="ar-laporan-submenu">
                                            <li><a href="home.php?module=hrd/accountreceivable/laporan/laporan_pershift&title=Laporan Pershift" class="nav-link">Laporan Pershift</a></li>
                                            <li><a href="home.php?module=hrd/accountreceivable/laporan/laporan_night_audit&title=Laporan Night Audit" class="nav-link">Laporan Night Audit</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('accounting')">
                                    <span>Accounting</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="accounting-submenu">
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('accounting-laporan')">
                                            <span>Laporan Global</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="accounting-laporan-submenu">
                                            <li><a href="home.php?module=hrd/accounting/laporan/global_report&title=Laporan Global" class="nav-link">Laporan Global</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('administration')">
                                    <span>Administration</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="administration-submenu">
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('admin-masterdata')">
                                            <span>Master Data</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="admin-masterdata-submenu">
                                            <li><a href="home.php?module=hrd/administration/masterdata/hotel_profile&title=Profil Hotel" class="nav-link">Profil Hotel</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </aside>

        <div class="main-container" style="min-width: 0;">
            <header class="top-header">
                <div class="header-left">
                    <button class="header-btn header-btn-secondary">TRAVELSINU</button>
                </div>

                <div class="header-right">
                    <a href="#" class="header-btn header-btn-secondary">Info Karyawan</a>
                    <a href="#" class="header-btn header-btn-secondary">Login Web Mail</a>
                    
                    <div class="dropdown">
                        <button class="dropdown-btn" onclick="toggleDropdown()">
                            <?php echo strtoupper(htmlspecialchars($username)); ?>
                            <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7 7"/>
                            </svg>
                        </button>
                        <div class="dropdown-content" id="adminDropdown">
                            <div class="dropdown-header">ANDA LOGIN SEBAGAI</div>
                            <div class="dropdown-username"><?php echo strtoupper(htmlspecialchars($username)); ?></div>
                            <a href="#" class="dropdown-item">Lihat Akun</a>
                        </div>
                    </div>
                    
                    <a href="?logout=1" class="header-btn header-btn-danger">Logout</a>
                </div>
            </header>

            <main class="main-content">
                <?php
                // Get the module parameter from URL
                $module = $_GET['module'] ?? 'dashboard';
                $ref = $_GET['ref'] ?? null;

                // Module handling with organized folder structure
                switch ($module) {
                    // Adjustment - Food Beverage modules
                    
                    // Adjustment - Front Office modules
                    
                    // Adjustment - Kos modules
                    
                    // Adjustment - Laundry modules
                    
                    // Adjustment - Meeting Room modules
                    
                    // Food & Beverage - Chart modules
                    
                    // Food & Beverage - Form modules
                    
                    // Food & Beverage - Info modules
                    
                    // Food & Beverage - Laporan modules
                    
                    // Food & Beverage - Master Data modules
                    
                    // Front Office - Chart modules
                    
                    // Front Office - Form modules
                    case 'frontoffice/form/refresh_room_status':
                        include 'modules/frontoffice/form/refresh_room_status.php';
                        break;
                    case 'frontoffice/form/reservation':
                        include 'modules/frontoffice/form/reservation.php';
                        break;
                    case 'frontoffice/form/registration':
                        include 'modules/frontoffice/form/registration.php';
                        break;
                    
                    // Front Office - Informasi reservasi modules
                    case 'frontoffice/informasi_reservasi/reservation_today':
                        include 'modules/frontoffice/informasi_reservasi/reservation_today.php';
                        break;
                    case 'frontoffice/informasi_reservasi/reservation_by_deposit':
                        include 'modules/frontoffice/informasi_reservasi/reservation_by_deposit.php';
                        break;
                    case 'frontoffice/informasi_reservasi/all_reservation':
                        include 'modules/frontoffice/informasi_reservasi/all_reservation.php';
                        break;
                    
                    // Front Office - Informasi modules
                    
                    // Front Office - Master Data modules
                    
                    // Housekeeping - Chart modules

                    // Housekeeping - Form modules
                    
                    // Housekeeping - Informasi modules
                    
                    // Housekeeping - Laporan modules
                    
                    // Housekeeping - Master Data modules
                    case 'housekeeping/info/maintenance_status':
                        include 'modules/housekeeping/info/maintenance_status.php';
                        break;
                    
                    // HRD - Account Receivable modules
                    
                    // HRD - Accounting modules
                    
                    // HRD - Administration modules
 
                        // Default dashboard content
                        echo '<div class="content-card">
                                <h1 class="page-title">Eva Group Hotel Management System</h1>
                                <p>Welcome to Eva Group Hotel Management System. Your comprehensive solution for managing all hotel operations efficiently and effectively.</p>
                                </div>';
                        break;
                    default:
                        // No handler for missing modules; optionally show a 404 or error message
                        echo '<div class="content-card"><h2>Module not found</h2><p>The requested module does not exist.</p></div>';
                        break;
                }
                ?>
            </main>
        </div>
    </div>

    <script>
        /**
         * Eva Group Hotel Management System - Frontend Scripts
         * Handles sidebar navigation, module routing, and state management
         */
        
        // ===== CONFIGURATION =====
        
        // Get current module from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const currentModule = urlParams.get('module');
        
        // Define all submenu identifiers for comprehensive state management
        const allSubmenus = [
            // Main categories
            'operational',
            'adjustment',
            
            // Adjustment sub-categories
            'adjustmentfoodbeverage',
            'adjustmentfrontoffice', 
            'adjustmentkos',
            'adjustmentlaundry',
            'adjustmentmeetingroom',
            
            // Food & Beverage Department
            'foodbeverage',
            'foodbeveragechart',
            'foodbeverageform',
            'foodbeverageinfo',
            'foodbeveragelaporan',
            'foodbeveragemaster',
            
            // Front Office Department
            'frontoffice',
            'frontofficechart',
            'frontofficeform',
            'frontofficeinfo',
            'frontofficeinformasi',
            'frontofficeinformasitamu',
            'frontofficelaporan',
            'frontofficemasterdata',
            'frontofficestatuskamar',
            
            // Housekeeping Department
            'housekeeping',
            'housekeepingchart',
            'housekeepingform',
            'housekeepinginformasi',
            'housekeepinglaporan',
            'housekeepingmasterdata',
            'housekeepingstatuskamar',
            
            // Laundry Department
            'laundry',
            'laundryform',
            'laundrylaporan',
            'laundrymasterdata',
            
            // HRD Department
            'hrd',
            'accountreceivable',
            'ar-laporan',
            'accounting',
            'accounting-laporan',
            'administration',
            'admin-masterdata'
        ];
        
        // ===== CORE FUNCTIONS =====
        
        /**
         * Toggle submenu visibility with state persistence
         * @param {string} menuName - The submenu identifier to toggle
         */
        function toggleSubmenu(menuName) {
            const submenu = document.getElementById(menuName + '-submenu');
            const button = event.target.closest('.nav-group-header');
            const chevron = button.querySelector('.chevron-icon');
            
            if (!submenu || !button) return;
            
            // Toggle visual states
            submenu.classList.toggle('show');
            chevron.classList.toggle('rotated');
            button.classList.toggle('active');
            
            // Persist state to localStorage
            const isOpen = submenu.classList.contains('show');
            localStorage.setItem('submenu-' + menuName, isOpen);
        }
        
        // ==========================================
        // SIDEBAR STATE MANAGEMENT FUNCTIONS
        // ==========================================
        
        /**
         * Restore sidebar state from localStorage for all submenus
         * Called on page load to maintain user's sidebar preferences
         */
        function restoreSidebarState() {
            allSubmenus.forEach(submenuName => {
                const isOpen = localStorage.getItem('submenu-' + submenuName) === 'true';
                
                if (isOpen) {
                    const submenu = document.getElementById(submenuName + '-submenu');
                    const button = document.querySelector(`[onclick="toggleSubmenu('${submenuName}')"]`);
                    const chevron = button?.querySelector('.chevron-icon');
                    
                    if (submenu && button) {
                        submenu.classList.add('show');
                        button.classList.add('active');
                        if (chevron) {
                            chevron.classList.add('rotated');
                        }
                    }
                }
            });
        }
        
        /**
         * Clear all submenu states (utility function)
         * Used for resetting the sidebar to default state
         */
        function clearAllSubmenuStates() {
            // Clear localStorage for all submenus
            allSubmenus.forEach(submenuName => {
                localStorage.removeItem('submenu-' + submenuName);
            });
            
            // Reset all submenus to closed state visually
            allSubmenus.forEach(submenuName => {
                const submenu = document.getElementById(submenuName + '-submenu');
                const button = document.querySelector(`[onclick="toggleSubmenu('${submenuName}')"]`);
                const chevron = button?.querySelector('.chevron-icon');
                
                if (submenu && button) {
                    submenu.classList.remove('show');
                    button.classList.remove('active');
                    if (chevron) {
                        chevron.classList.remove('rotated');
                    }
                }
            });
        }
        
        // ===== SAVE & RESTORE SIDEBAR SCROLL POSITION (IMPROVED) =====

// Before the page unloads, save the current scroll position.
window.addEventListener('beforeunload', function() {
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (sidebarNav) {
        sessionStorage.setItem('sidebarScrollPos', sidebarNav.scrollTop);
    }
});

/**
 * Restores the sidebar's scroll position.
 * This function will be called after the sidebar has been initialized.
 */
function restoreScrollPosition() {
    const scrollPos = sessionStorage.getItem('sidebarScrollPos');
    if (scrollPos) {
        const sidebarNav = document.querySelector('.sidebar-nav');
        if (sidebarNav) {
            // Apply the saved scroll position.
            sidebarNav.scrollTop = parseInt(scrollPos, 10);
        }
    }
}
        
        // ==========================================
        // NAVIGATION ACTIVE STATE MANAGEMENT
        // ==========================================
        
        /**
         * Set active navigation item based on current module
         * Automatically highlights the correct menu item on page load
         */
        function setActiveNavByModule() {
            // Remove active class from all nav-links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Set active based on current module
            if (currentModule) {
                // Find the link that contains the current module in its href
                const activeLink = document.querySelector(`a[href*="module=${currentModule}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            } else {
                // No module means we're on homepage - activate home button
                const homeButton = document.querySelector('a[href="home.php"]:not([href*="module="])');
                if (homeButton) {
                    homeButton.classList.add('active');
                }
            }
        }
        
        /**
         * Enhanced active state management for navigation
         * Handles click events on navigation items
         */
        function setActiveNavItem(clickedElement) {
            // Remove active class from all nav-links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });

            // Add active class to clicked element
            if (clickedElement.classList.contains('nav-link')) {
                clickedElement.classList.add('active');
            }

            // Persist sidebar submenu state except for home button
            if (!clickedElement.href.endsWith('home.php')) {
                // Find the closest nav-group-header and get its submenu name
                const navGroupHeader = clickedElement.closest('.nav-group')?.querySelector('.nav-group-header');
                if (navGroupHeader) {
                    const match = navGroupHeader.getAttribute('onclick').match(/toggleSubmenu\('(.+?)'\)/);
                    if (match) {
                        const menuName = match[1];
                        localStorage.setItem('submenu-' + menuName, true);
                    }
                }
            }
        }
        
        /**
         * Reset sidebar and go to homepage - ONLY FOR HOME BUTTON
         * Special function that clears all states when returning to home
         */
        function resetSidebarAndGoHome() {
            // Clear all submenu states - ONLY when home button is clicked
            clearAllSubmenuStates();
            
            // Remove active class from all nav-links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Set home button as active
            const homeButton = document.querySelector('a[href="home.php"]:not([href*="module="])');
            if (homeButton) {
                homeButton.classList.add('active');
            }
            
            // Navigate to homepage (without any module parameter)
            window.location.href = 'home.php';
        }
        
        // ==========================================
        // PAGE INITIALIZATION & EVENT HANDLERS
        // ==========================================
        
        /**
         * Initialize the application on page load
         * Sets up sidebar state, navigation, and event listeners
         */
        document.addEventListener('DOMContentLoaded', function() {
            // ===== SAFETY CHECKS =====
            // Ensure sidebar buttons are clickable
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.style.pointerEvents = 'auto';
                sidebar.style.zIndex = '100';
            }
            
            // Restore sidebar state for all submenus
            restoreSidebarState();
            
            // Set active navigation item based on current module
            setActiveNavByModule();

            // We use setTimeout to ensure this runs after the sidebar is fully expanded.
            setTimeout(restoreScrollPosition, 0);
            
            // Add click listeners to all nav-links for active state management
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    // Handle active state for module links and regular links
                    if (this.href.includes('module=') || !this.href.includes('home.php') || this.href === 'home.php') {
                        setActiveNavItem(this);
                    }
                });
            });
            
            // Optional: Add keyboard shortcuts for sidebar management
            document.addEventListener('keydown', function(e) {
                // Ctrl + Shift + C to clear all submenu states
                if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                    e.preventDefault();
                    clearAllSubmenuStates();
                    console.log('All submenu states cleared');
                }
            });
        });
        
        // ==========================================
        // DROPDOWN FUNCTIONALITY
        // ==========================================
        
        /**
         * Toggle admin dropdown menu
         * Handles opening/closing of user account dropdown
         */
        function toggleDropdown() {
            const dropdown = document.getElementById('adminDropdown');
            const dropdownContainer = dropdown.parentElement;
            
            dropdown.classList.toggle('show');
            dropdownContainer.classList.toggle('active');
        }
        
        /**
         * Close dropdown when clicking outside
         * Enhances UX by auto-closing dropdown on outside clicks
         */
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('adminDropdown');
            const dropdownBtn = document.querySelector('.dropdown-btn');
            
            if (!dropdownBtn.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
                dropdown.parentElement.classList.remove('active');
            }
        });

        // ==========================================
        // LOADING SYSTEM
        // ==========================================
        
        // Performance optimized loading configuration
        window.FastLoaderConfig = {
            duration: 300,        // Faster completion (300ms instead of 600ms)
            minDisplay: 50,       // Shorter minimum display time (50ms instead of 100ms)
            updateInterval: 8,    // More frequent updates (8ms instead of 16ms)
            fadeOutDuration: 100  // Faster fade out (100ms instead of 150ms)
        };
        
        // Loading system is now handled by fast-loader.js
        // Initialize loading for navigation links
        document.addEventListener('DOMContentLoaded', function() {
            // Add loading to all navigation links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (window.fastLoader) {
                        window.fastLoader.show();
                    }
                });
            });
        });
    </script>
</body>
</html>