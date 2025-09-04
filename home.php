<?php
/**
 * Eva Group Hotel Management System - Main Dashboard
 * 
 * This is the main application file that handles:
 * - User authentication and session management
 * - Sidebar navigation and module routing
 * - Dashboard layout and structure
 * 
 * @author Yonttt
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
        
        <!-- ===== SIDEBAR NAVIGATION ===== -->
        <aside class="sidebar">
            <!-- Sidebar Header -->
            <div class="sidebar-header">
                <h1 class="sidebar-brand">EVA GROUP HOTEL MANAGEMENT</h1>
            </div>

            <!-- Main Navigation Menu -->
            <nav class="sidebar-nav">
                <ul class="space-y-2">
                    
                    <!-- ===== HOME NAVIGATION ===== -->
                    <li class="nav-item">
                        <a href="#" onclick="resetSidebarAndGoHome(); return false;" class="nav-link active">
                            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            HOME
                        </a>
                    </li>
                    
                    <!-- ===== OPERATIONAL MODULES ===== -->
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
                            
                            <!-- ===== ADJUSTMENT DEPARTMENT ===== -->
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('adjustment')">
                                    <span>Adjustment</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                
                                <ul class="nav-submenu" id="adjustment-submenu">
                                    
                                    <!-- === Food & Beverage === -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentfoodbeverage')">
                                            <span>Food & Beverage</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentfoodbeverage-submenu">
                                            <li><a href="home.php?module=fnb-riwayat-transaksi" class="nav-link">Riwayat Transaksi</a></li>
                                               <li><a href="home.php?module=fnb-transaction-history" class="nav-link">Transaction History</a></li>
                                        </ul>
                                    </li>
                                        <li class="nav-group">
                                            <button class="nav-group-header" onclick="toggleSubmenu('adjustmentfoodbeverage')">
                                                <span>Food & Beverage</span>
                                                <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                                </svg>
                                            </button>
                                            <ul class="nav-submenu" id="adjustmentfoodbeverage-submenu">
                                                <li><a href="home.php?module=fnb-riwayat-transaksi" class="nav-link">Riwayat Transaksi</a></li>
                                            </ul>
                                        </li>
                                    
                                    <!-- === Front Office === -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentfrontoffice')">
                                            <span>Front Office</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentfrontoffice-submenu">
                                            <li><a href="home.php?module=additional-deposit&title=Additional Deposit" class="nav-link">Additional Deposit</a></li>
                                            <li><a href="home.php?module=charge-to-room&title=Charge To Room" class="nav-link">Charge To Room</a></li>
                                            <li><a href="home.php?module=clearance-deposit&title=Clearance Deposit" class="nav-link">Clearance Deposit</a></li>
                                            <li><a href="home.php?module=clearance-deposit-pending&title=Clearance Deposit Pending" class="nav-link">Clearance Deposit Pending</a></li>
                                            <li><a href="home.php?module=double-checkin&title=Double Checkin" class="nav-link">Double Checkin</a></li>
                                            <li><a href="home.php?module=extra-bed&title=Extra Bed" class="nav-link">Extra Bed</a></li>
                                            <li><a href="home.php?module=extrabill&title=Extrabill" class="nav-link">Extrabill</a></li>
                                            <li><a href="home.php?module=guest-folio&title=Guest Folio" class="nav-link">Guest Folio</a></li>
                                            <li><a href="home.php?module=guest-ledger&title=Guest Ledger" class="nav-link">Guest Ledger</a></li>
                                            <li><a href="home.php?module=late-checkout&title=Late Checkout" class="nav-link">Late Checkout</a></li>
                                            <li><a href="home.php?module=market-segment&title=Market Segment" class="nav-link">Market Segment</a></li>
                                            <li><a href="home.php?module=night-audit&title=Night Audit" class="nav-link">Night Audit</a></li>
                                            <li><a href="home.php?module=other-extrabill&title=Other Extrabill" class="nav-link">Other Extrabill</a></li>
                                            <li><a href="home.php?module=payment-pending&title=Payment Pending" class="nav-link">Payment Pending</a></li>
                                            <li><a href="home.php?module=pembayaran&title=Pembayaran" class="nav-link">Pembayaran</a></li>
                                            <li><a href="home.php?module=refund&title=Refund" class="nav-link">Refund</a></li>
                                            <li><a href="home.php?module=reprocess-clearance&title=Reprocess Clearance" class="nav-link">Reprocess Clearance</a></li>
                                            <li><a href="home.php?module=room-charge&title=Room Charge" class="nav-link">Room Charge</a></li>
                                            <li><a href="home.php?module=status-kamar&title=Status Kamar" class="nav-link">Status Kamar</a></li>
                                            <li><a href="home.php?module=upnormal-payment&title=Upnormal Payment" class="nav-link">Upnormal Payment</a></li>
                                        </ul>
                                    </li>
                                    
                                    <!-- === Kos === -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentkos')">
                                            <span>Kos</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentkos-submenu">
                                            <li><a href="home.php?module=kos-pembayaran&title=Kos Pembayaran" class="nav-link">Pembayaran</a></li>
                                            <li><a href="home.php?module=kos-room-charge&title=Kos Room Charge" class="nav-link">Room Charge</a></li>
                                        </ul>
                                    </li>
                                    
                                    <!-- === Laundry === -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentlaundry')">
                                            <span>Laundry</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentlaundry-submenu">
                                            <li><a href="home.php?module=transaksi-laundry&title=Transaksi Laundry" class="nav-link">Transaksi Laundry</a></li>
                                        </ul>
                                    </li>
                                    
                                    <!-- === Meeting Room === -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentmeetingroom')">
                                            <span>Meeting Room</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentmeetingroom-submenu">
                                            <li><a href="home.php?module=meeting-room-deposit&title=Meeting Room Deposit" class="nav-link">Meeting Room Deposit</a></li>
                                            <li><a href="home.php?module=meeting-room-refund&title=Meeting Room Refund" class="nav-link">Meeting Room Refund</a></li>
                                            <li><a href="home.php?module=meeting-room-trans&title=Meeting Room Trans" class="nav-link">Meeting Room Trans</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <!-- Food & Beverage -->
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
                                            <li><a href="home.php?module=menu-fast-moving&title=Menu Fast Moving" class="nav-link">Menu Fast Moving</a></li>
                                            <li><a href="home.php?module=menu-slow-moving&title=Menu Slow Moving" class="nav-link">Menu Slow Moving</a></li>
                                            <li><a href="home.php?module=penjualan&title=Penjualan" class="nav-link">Penjualan</a></li>
                                            <li><a href="home.php?module=penjualan-perkategori&title=Penjualan Perkategori" class="nav-link">Penjualan Perkategori</a></li>
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
                                            <li><a href="home.php?module=fnb-pembelian-langsung&title=F&B Pembelian Langsung" class="nav-link">F&B Pembelian Langsung</a></li>
                                            <li><a href="home.php?module=permintaan-stok-fnb&title=Permintaan Stok F & B" class="nav-link">Permintaan Stok F & B</a></li>
                                            <li><a href="home.php?module=tamu-luar&title=Tamu Luar" class="nav-link">Tamu Luar</a></li>
                                            <li><a href="home.php?module=atur-event-menu&title=Atur Event Menu" class="nav-link">Atur Event Menu</a></li>
                                            <li><a href="home.php?module=transaksi-penjualan&title=Transaksi Penjualan" class="nav-link">Transaksi Penjualan</a></li>
                                            <li><a href="home.php?module=transaksi-pending&title=Transaksi Pending" class="nav-link">Transaksi Pending</a></li>
                                            <li><a href="home.php?module=pemakaian-barang-fnb&title=Pemakaian Barang F&B" class="nav-link">Pemakaian Barang F&B</a></li>
                                            <li><a href="home.php?module=barang-expire-rusak-fnb&title=Barang Expire / Rusak F&B" class="nav-link">Barang Expire / Rusak F&B</a></li>
                                            <li><a href="home.php?module=stok-opname-resto&title=Stok Opname Resto" class="nav-link">Stok Opname Resto</a></li>
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
                                            <li><a href="home.php?module=info-permintaan-stok-fnb&title=Info Permintaan Stok F&B" class="nav-link">Info Permintaan Stok F&B</a></li>
                                            <li><a href="home.php?module=transaksi-hari-ini&title=Transaksi Hari ini" class="nav-link">Transaksi Hari ini</a></li>
                                            <li><a href="home.php?module=permintaan-room-service&title=Permintaan Room Service" class="nav-link">Permintaan Room Service</a></li>
                                            <li><a href="home.php?module=info-piutang-fnb&title=Info Piutang F&B" class="nav-link">Info Piutang F&B</a></li>
                                            <li><a href="home.php?module=info-stok-barang-fnb&title=Info Stok Barang F&B" class="nav-link">Info Stok Barang F&B</a></li>
                                            <li><a href="home.php?module=kartu-stok-fnb&title=Kartu Stok F&B" class="nav-link">Kartu Stok F&B</a></li>
                                            <li><a href="home.php?module=piutang-banquet&title=Piutang Banquet" class="nav-link">Piutang Banquet</a></li>
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
                                            <li><a href="home.php?module=night-audit-fnb&title=Night Audit F&B" class="nav-link">Night Audit F&B</a></li>
                                            <li><a href="home.php?module=penjualan-resto-per-item&title=Penjualan Resto Per Item" class="nav-link">Penjualan Resto Per Item</a></li>
                                            <li><a href="home.php?module=penjualan-restaurant&title=Penjualan Restaurant" class="nav-link">Penjualan Restaurant</a></li>
                                            <li><a href="home.php?module=shift-report&title=Shift Report" class="nav-link">Shift Report</a></li>
                                            <li><a href="home.php?module=lap-tamu-resto&title=Lap Tamu Resto" class="nav-link">Lap Tamu Resto</a></li>
                                            <li><a href="home.php?module=riwayat-so-resto&title=Riwayat S/O Resto" class="nav-link">Riwayat S/O Resto</a></li>
                                            <li><a href="home.php?module=resto-shift-report&title=Resto Shift Report" class="nav-link">Resto Shift Report</a></li>
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
                                            <li><a href="home.php?module=master-discount&title=Master Discount" class="nav-link">Master Discount</a></li>
                                            <li><a href="home.php?module=master-meja&title=Master Meja" class="nav-link">Master Meja</a></li>
                                            <li><a href="home.php?module=master-menu-resto&title=Master Menu Resto" class="nav-link">Master Menu Resto</a></li>
                                            <li><a href="home.php?module=kategori-menu-resto&title=Kategori Menu Resto" class="nav-link">Kategori Menu Resto</a></li>
                                            <li><a href="home.php?module=jenis-menu-resto&title=Jenis Menu Resto" class="nav-link">Jenis Menu Resto</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <!-- Front Office -->
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
                                            <li><a href="home.php?module=chart-kamar-perbulan&title=Chart Kamar Per Bulan" class="nav-link">Guest By City</a></li>
                                            <li><a href="home.php?module=chart-pendapatan-bulanan&title=Chart Pendapatan Bulanan" class="nav-link">Guest By Nation</a></li>
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
                                            <li><a href="home.php?module=checkin-tamu&title=Check In Tamu" class="nav-link">Direct Purchase FO</a></li>
                                            <li><a href="home.php?module=checkout-tamu&title=Check Out Tamu" class="nav-link">Refresh Room Status</a></li>
                                            <li><a href="home.php?module=buat-reservasi&title=Buat Reservasi" class="nav-link">Registrasi Group</a></li>
                                            <li><a href="home.php?module=ubah-reservasi&title=Ubah Reservasi" class="nav-link">Transaksi Laundry</a></li>
                                            <li><a href="home.php?module=batal-reservasi&title=Batal Reservasi" class="nav-link">Form Reservasi Kamar</a></li>
                                            <li><a href="home.php?module=extend-stay&title=Extend Stay" class="nav-link">Form Registrasi Kamar</a></li>
                                            <li><a href="home.php?module=early-checkout&title=Early Check Out" class="nav-link">Form Registrasi Kost</a></li>
                                            <li><a href="home.php?module=room-move&title=Room Move" class="nav-link">Form Reservasi Kost</a></li>
                                            <li><a href="home.php?module=split-room&title=Split Room" class="nav-link">Transaksi Meeting Room</a></li>
                                            <li><a href="home.php?module=join-room&title=Join Room" class="nav-link">Form Extrabill</a></li>
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
                                            <li><a href="home.php?module=info-reservasi-hari-ini&title=Info Reservasi Hari Ini" class="nav-link">Reservation Today</a></li>
                                            <li><a href="home.php?module=deposit-report&title=Deposit Report" class="nav-link">Reservation By Deposit</a></li>
                                            <li><a href="home.php?module=group-reservation&title=Group Reservation" class="nav-link">All Reservation</a></li>
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
                                            <li><a href="home.php?module=info-kamar-available&title=Info Kamar Available" class="nav-link">Info Stock Extrabill</a></li>
                                            <li><a href="home.php?module=guest-history&title=Guest History" class="nav-link">Group List</a></li>
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
                                            <li><a href="home.php?module=guest-history&title=Guest History" class="nav-link">Guest Research</a></li>
                                            <li><a href="home.php?module=info-checkout-hari-ini&title=Info Check Out Hari Ini" class="nav-link">Check in Today</a></li>
                                            <li><a href="home.php?module=early-checkout&title=Early Check Out" class="nav-link">Early Checkin</a></li>
                                            <li><a href="home.php?module=info-pending-checkout&title=Info Pending Check Out" class="nav-link">Expected Departure</a></li>
                                            <li><a href="home.php?module=room-status-realtime&title=Room Status Real Time" class="nav-link">Meeting Room Info</a></li>
                                            <li><a href="home.php?module=info-checkout-hari-ini&title=Info Check Out Hari Ini" class="nav-link">Checkout Today</a></li>
                                            <li><a href="home.php?module=room-move&title=Room Move" class="nav-link">Change Room</a></li>
                                            <li><a href="home.php?module=batal-reservasi&title=Batal Reservasi" class="nav-link">Cancellation Today</a></li>
                                            <li><a href="home.php?module=refund-deposit&title=Refund Deposit" class="nav-link">Refund</a></li>
                                            <li><a href="home.php?module=blacklist-guest&title=Blacklist Guest" class="nav-link">Skipper</a></li>
                                            <li><a href="home.php?module=guest-history&title=Guest History" class="nav-link">Guest History</a></li>
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
                                            <li><a href="home.php?module=actual-shift-report&title=Actual Shift Report" class="nav-link">Actual Shift Report</a></li>
                                            <li><a href="home.php?module=blacklist-management&title=Blacklist Management" class="nav-link">Daftar Blacklist</a></li>
                                            <li><a href="home.php?module=night-audit-report&title=Night Audit Report" class="nav-link">Shift Report</a></li>
                                            <li><a href="home.php?module=room-revenue-report&title=Room Revenue Report" class="nav-link">Lap Aktivitas User</a></li>
                                            <li><a href="home.php?module=occupancy-report&title=Occupancy Report" class="nav-link">Lost & Found</a></li>
                                            <li><a href="home.php?module=adr-revpar-report&title=ADR RevPAR Report" class="nav-link">Extrabed</a></li>
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
                                            <li><a href="home.php?module=room-maintenance-status&title=Room Maintenance Status" class="nav-link">Ubah Status Kamar</a></li>
                                            <li><a href="home.php?module=master-rate-kamar&title=Master Rate Kamar" class="nav-link">Master Harga Kamar</a></li>
                                            <li><a href="home.php?module=master-charge-code&title=Master Charge Code" class="nav-link">Add Charge Meeting Room</a></li>
                                            <li><a href="home.php?module=master-package&title=Master Package" class="nav-link">Additional Meeting Room</a></li>
                                            <li><a href="home.php?module=master-voucher&title=Master Voucher" class="nav-link">Meeting Room Package</a></li>
                                            <li><a href="home.php?module=market-segment-analysis&title=Market Segment Analysis" class="nav-link">Meeting Room Segment</a></li>
                                            <li><a href="home.php?module=master-guest&title=Master Guest" class="nav-link">Pengaturan Admin</a></li>
                                            <li><a href="home.php?module=master-charge-code&title=Master Charge Code" class="nav-link">Master Extra Bill</a></li>
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
                                            <li><a href="home.php?module=room-status-realtime&title=Room Status Real Time" class="nav-link">Status Kamar FO</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <!-- Housekeeping -->
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
                                            <li><a href="home.php?module=chart-room-cleaning&title=Chart Room Cleaning" class="nav-link">Out Of Order Room</a></li>
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
                                            <li><a href="home.php?module=room-assignment&title=Room Assignment" class="nav-link">Form Kamar OO</a></li>
                                            <li><a href="home.php?module=cleaning-schedule&title=Cleaning Schedule" class="nav-link">HK Pembelian Langsung</a></li>
                                            <li><a href="home.php?module=linen-exchange&title=Linen Exchange" class="nav-link">Penerimaan Linen</a></li>
                                            <li><a href="home.php?module=linen-exchange&title=Linen Exchange" class="nav-link">Pengiriman Linen</a></li>
                                            <li><a href="home.php?module=inventory-request&title=Inventory Request" class="nav-link">Permintaan Stok HK</a></li>
                                            <li><a href="home.php?module=maintenance-request-hk&title=Maintenance Request" class="nav-link">Form O O Request</a></li>
                                            <li><a href="home.php?module=amenities-restock&title=Amenities Restock" class="nav-link">Form Pemakaian Barang</a></li>
                                            <li><a href="home.php?module=lost-found-entry&title=Lost & Found Entry" class="nav-link">Form Loan</a></li>
                                            <li><a href="home.php?module=room-inspection&title=Room Inspection" class="nav-link">Form Tarik Extrabed</a></li>
                                            <li><a href="home.php?module=lost-found-entry&title=Lost & Found Entry" class="nav-link">Form Lose & Fund</a></li>
                                            <li><a href="home.php?module=deep-cleaning-schedule&title=Deep Cleaning Schedule" class="nav-link">Barang Rusak/Expire HK</a></li>
                                            <li><a href="home.php?module=inventory-request&title=Inventory Request" class="nav-link">Atur Par Stok</a></li>
                                            <li><a href="home.php?module=public-area-cleaning&title=Public Area Cleaning" class="nav-link">Stok Opname HK</a></li>
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
                                            <li><a href="home.php?module=cleaning-progress&title=Cleaning Progress" class="nav-link">Info Direct Purchase</a></li>
                                            <li><a href="home.php?module=inventory-level&title=Inventory Level" class="nav-link">Info Permintaan Stok HK</a></li>
                                            <li><a href="home.php?module=linen-status&title=Linen Status" class="nav-link">Informasi In/Out Linen</a></li>
                                            <li><a href="home.php?module=equipment-status&title=Equipment Status" class="nav-link">Penggunaan Extrabed</a></li>
                                            <li><a href="home.php?module=room-status-hk&title=Room Status Housekeeping" class="nav-link">Laporan Kamar OO</a></li>
                                            <li><a href="home.php?module=staff-assignment&title=Staff Assignment" class="nav-link">Log Kamar</a></li>
                                            <li><a href="home.php?module=amenities-stock&title=Amenities Stock" class="nav-link">Info Stok Barang HK</a></li>
                                            <li><a href="home.php?module=room-discrepancy&title=Room Discrepancy" class="nav-link">Riwayat Stok Opname HK</a></li>
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
                                            <li><a href="home.php?module=linen-par-level&title=Linen Par Level" class="nav-link">Laporan Stok Linen</a></li>
                                            <li><a href="home.php?module=room-productivity-report&title=Room Productivity Report" class="nav-link">Room Count Sheet</a></li>
                                            <li><a href="home.php?module=maintenance-summary&title=Maintenance Summary" class="nav-link">Riwayat Perbaikan Kamar</a></li>
                                            <li><a href="home.php?module=daily-housekeeping-report&title=Daily Housekeeping Report" class="nav-link">Occupancy Room</a></li>
                                            <li><a href="home.php?module=lost-found-report&title=Lost & Found Report" class="nav-link">Laporan Kamar OO</a></li>
                                            <li><a href="home.php?module=inventory-usage-report&title=Inventory Usage Report" class="nav-link">Lap Penggunaan Supplies</a></li>
                                            <li><a href="home.php?module=room-cleaning-report&title=Room Cleaning Report" class="nav-link">Lap Pembersihan Kamar</a></li>
                                            <li><a href="home.php?module=room-maintenance-history&title=Room Maintenance History" class="nav-link">Riwayat Perawatan kamar</a></li>
                                            <li><a href="home.php?module=extra-bed-history&title=Extra Bed History" class="nav-link">Riwayat Ext Bed</a></li>
                                            <li><a href="home.php?module=inspection-report&title=Inspection Report" class="nav-link">Cetak Kartu Stok HK</a></li>
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
                                            <li><a href="home.php?module=maintenance-status&title=Maintenance Status" class="nav-link">Master Operasional</a></li>
                                            <li><a href="home.php?module=room-status-hk&title=Room Status Housekeeping" class="nav-link">Master Room Type</a></li>
                                            <li><a href="home.php?module=room-assignment&title=Room Assignment" class="nav-link">Management Room</a></li>
                                            <li><a href="home.php?module=deep-cleaning-schedule&title=Deep Cleaning Schedule" class="nav-link">Master General Cleaning</a></li>
                                            <li><a href="home.php?module=cleaning-schedule&title=Cleaning Schedule" class="nav-link">Daftar Kamar GC</a></li>
                                            <li><a href="home.php?module=room-inspection&title=Room Inspection" class="nav-link">Master Kamar OO</a></li>
                                            <li><a href="home.php?module=maintenance-request-hk&title=Maintenance Request" class="nav-link">Jadwal Maintenance</a></li>
                                            <li><a href="home.php?module=room-status-hk&title=Room Status Housekeeping" class="nav-link">Room Type Kost</a></li>
                                            <li><a href="home.php?module=room-assignment&title=Room Assignment" class="nav-link">Master Room Kost</a></li>
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
                                            <li><a href="home.php?module=room-status-hk&title=Room Status Housekeeping" class="nav-link">Status Kamar</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <!-- Laundry -->
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
                                            <li><a href="home.php?module=linen-exchange&title=Linen Exchange" class="nav-link">Penerimaan Linen</a></li>
                                            <li><a href="home.php?module=linen-exchange&title=Linen Exchange" class="nav-link">Pengiriman Linen</a></li>
                                            <li><a href="home.php?module=laundry-order&title=Laundry Order" class="nav-link">Stok Opname Laundry</a></li>
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
                                            <li><a href="home.php?module=linen-status&title=Linen Status" class="nav-link">In/Out Linen</a></li>
                                            <li><a href="home.php?module=laundry-report&title=Laundry Report" class="nav-link">Lap Stok Opname Laundry</a></li>
                                            <li><a href="home.php?module=linen-in-progress&title=Linen In Progress" class="nav-link">Linen In Progress</a></li>
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
                                            <li><a href="home.php?module=laundry-amenities-stock&title=Laundry Amenities Stock" class="nav-link">Master Barang Laundry</a></li>
                                            <li><a href="home.php?module=linen-status&title=Linen Status" class="nav-link">Master Barang Linen</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    
                    <!-- ===== HRD MODULES ===== -->
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
                            <!-- Account Receivable -->
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('accountreceivable')">
                                    <span>Account Receivable</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="accountreceivable-submenu">
                                    <!-- Laporan submenu -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('ar-laporan')">
                                            <span>Laporan</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="ar-laporan-submenu">
                                            <li><a href="home.php?module=laporan-pershift&title=Laporan Pershift" class="nav-link">Laporan Pershift</a></li>
                                            <li><a href="home.php?module=laporan-night-audit&title=Laporan Night Audit" class="nav-link">Laporan Night Audit</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <!-- Accounting -->
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('accounting')">
                                    <span>Accounting</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="accounting-submenu">
                                    <!-- Laporan Global submenu -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('accounting-laporan')">
                                            <span>Laporan Global</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="accounting-laporan-submenu">
                                            <li><a href="home.php?module=laporan-global-accounting&title=Laporan Global" class="nav-link">Laporan Global</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <!-- Administration -->
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('administration')">
                                    <span>Administration</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="administration-submenu">
                                    <!-- Master Data submenu -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('admin-masterdata')">
                                            <span>Master Data</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="admin-masterdata-submenu">
                                            <li><a href="home.php?module=profil-hotel&title=Profil Hotel" class="nav-link">Profil Hotel</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Main Content -->
        <div class="main-container">
            <!-- Header -->
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
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
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

            <!-- Main Content Area -->
            <main class="main-content">
                <?php
                // Get the module parameter from URL
                $module = $_GET['module'] ?? 'dashboard';
                $ref = $_GET['ref'] ?? null;

                // Module handling with organized folder structure
                switch ($module) {
                    case 'fnb-riwayat-transaksi':
                        include 'modules/adjustment/foodbeverage/riwayat_transaksi.php';
                        break;
                    
                    // Adjustment - Front Office modules
                    case 'additional-deposit':
                        include 'modules/adjustment/frontoffice/additional_deposit.php';
                        break;
                    case 'charge-to-room':
                        include 'modules/adjustment/frontoffice/charge_to_room.php';
                        break;
                    case 'clearance-deposit':
                        include 'modules/adjustment/frontoffice/clearance_deposit.php';
                        break;
                    case 'clearance-deposit-pending':
                        include 'modules/adjustment/frontoffice/clearance_deposit_pending.php';
                        break;
                    case 'double-checkin':
                        include 'modules/adjustment/frontoffice/double_checkin.php';
                        break;
                    case 'extra-bed':
                        include 'modules/adjustment/frontoffice/extra_bed.php';
                        break;
                    case 'extrabill':
                        include 'modules/adjustment/frontoffice/extrabill.php';
                        break;
                    case 'guest-folio':
                        include 'modules/adjustment/frontoffice/guest_folio.php';
                        break;
                    case 'guest-ledger':
                        include 'modules/adjustment/frontoffice/guest_ledger.php';
                        break;
                    case 'late-checkout':
                        include 'modules/adjustment/frontoffice/late_checkout.php';
                        break;
                    case 'market-segment':
                        include 'modules/adjustment/frontoffice/market_segment.php';
                        break;
                    case 'night-audit':
                        include 'modules/adjustment/frontoffice/night_audit.php';
                        break;
                    case 'other-extrabill':
                        include 'modules/adjustment/frontoffice/other_extrabill.php';
                        break;
                    case 'payment-pending':
                        include 'modules/adjustment/frontoffice/payment_pending.php';
                        break;
                    case 'pembayaran':
                        include 'modules/adjustment/frontoffice/pembayaran.php';
                        break;
                    case 'refund':
                        include 'modules/adjustment/frontoffice/refund.php';
                        break;
                    case 'reprocess-clearance':
                        include 'modules/adjustment/frontoffice/reprocess_clearance.php';
                        break;
                    case 'room-charge':
                        include 'modules/adjustment/frontoffice/room_charge.php';
                        break;
                    case 'status-kamar':
                        include 'modules/adjustment/frontoffice/status_kamar.php';
                        break;
                    case 'upnormal-payment':
                        include 'modules/adjustment/frontoffice/upnormal_payment.php';
                        break;
                    
                    // Adjustment - Kos modules
                    case 'kos-pembayaran':
                        include 'modules/adjustment/kos/pembayaran.php';
                        break;
                    case 'kos-room-charge':
                        include 'modules/adjustment/kos/room_charge.php';
                        break;
                    
                    // Adjustment - Laundry modules
                    case 'transaksi-laundry':
                        include 'modules/adjustment/laundry/transaksi_laundry.php';
                        break;
                    
                    // Adjustment - Meeting Room modules
                    case 'meeting-room-deposit':
                        include 'modules/adjustment/meetingroom/meeting_room_deposit.php';
                        break;
                    case 'meeting-room-refund':
                        include 'modules/adjustment/meetingroom/meeting_room_refund.php';
                        break;
                    case 'meeting-room-trans':
                        include 'modules/adjustment/meetingroom/meeting_room_trans.php';
                        break;
                    
                    // Food & Beverage - Chart modules
                    case 'menu-fast-moving':
                        include 'modules/foodbeverage/chart/menu_fast_moving.php';
                        break;
                    case 'menu-slow-moving':
                        include 'modules/foodbeverage/chart/menu_slow_moving.php';
                        break;
                    case 'penjualan':
                        include 'modules/foodbeverage/chart/penjualan.php';
                        break;
                    case 'penjualan-perkategori':
                        include 'modules/foodbeverage/chart/penjualan_perkategori.php';
                        break;
                    
                    // Food & Beverage - Form modules
                    case 'fnb-pembelian-langsung':
                        include 'modules/foodbeverage/form/pembelian_langsung.php';
                        break;
                    case 'permintaan-stok-fnb':
                        include 'modules/foodbeverage/form/permintaan_stok_fnb.php';
                        break;
                    case 'tamu-luar':
                        include 'modules/foodbeverage/form/tamu_luar.php';
                        break;
                    case 'atur-event-menu':
                        include 'modules/foodbeverage/form/atur_event_menu.php';
                        break;
                    case 'transaksi-penjualan':
                        include 'modules/foodbeverage/form/transaksi_penjualan.php';
                        break;
                    case 'transaksi-pending':
                        include 'modules/foodbeverage/form/transaksi_pending.php';
                        break;
                    case 'pemakaian-barang-fnb':
                        include 'modules/foodbeverage/form/pemakaian_barang_fnb.php';
                        break;
                    case 'barang-expire-rusak-fnb':
                        include 'modules/foodbeverage/form/barang_expire_rusak_fnb.php';
                        break;
                    case 'stok-opname-resto':
                        include 'modules/foodbeverage/form/stok_opname_resto.php';
                        break;
                    
                    // Food & Beverage - Info modules
                    case 'info-permintaan-stok-fnb':
                        include 'modules/foodbeverage/info/info_permintaan_stok_fnb.php';
                        break;
                    case 'transaksi-hari-ini':
                        include 'modules/foodbeverage/info/transaksi_hari_ini.php';
                        break;
                    case 'permintaan-room-service':
                        include 'modules/foodbeverage/info/permintaan_room_service.php';
                        break;
                    case 'info-piutang-fnb':
                        include 'modules/foodbeverage/info/info_piutang_fnb.php';
                        break;
                    case 'info-stok-barang-fnb':
                        include 'modules/foodbeverage/info/info_stok_barang_fnb.php';
                        break;
                    case 'kartu-stok-fnb':
                        include 'modules/foodbeverage/info/kartu_stok_fnb.php';
                        break;
                    case 'piutang-banquet':
                        include 'modules/foodbeverage/info/piutang_banquet.php';
                        break;
                    
                    // Food & Beverage - Laporan modules
                    case 'night-audit-fnb':
                        include 'modules/foodbeverage/laporan/night_audit_fnb.php';
                        break;
                    case 'penjualan-resto-per-item':
                        include 'modules/foodbeverage/laporan/penjualan_resto_per_item.php';
                        break;
                    case 'penjualan-restaurant':
                        include 'modules/foodbeverage/laporan/penjualan_restaurant.php';
                        break;
                    case 'shift-report':
                        include 'modules/foodbeverage/laporan/shift_report.php';
                        break;
                    case 'lap-tamu-resto':
                        include 'modules/foodbeverage/laporan/lap_tamu_resto.php';
                        break;
                    case 'riwayat-so-resto':
                        include 'modules/foodbeverage/laporan/riwayat_so_resto.php';
                        break;
                    case 'resto-shift-report':
                        include 'modules/foodbeverage/laporan/resto_shift_report.php';
                        break;
                    
                    // Food & Beverage - Master Data modules
                    case 'master-discount':
                        include 'modules/foodbeverage/master/master_discount.php';
                        break;
                    case 'master-meja':
                        include 'modules/foodbeverage/master/master_meja.php';
                        break;
                    case 'master-menu-resto':
                        include 'modules/foodbeverage/master/master_menu_resto.php';
                        break;
                    case 'kategori-menu-resto':
                        include 'modules/foodbeverage/master/kategori_menu_resto.php';
                        break;
                    case 'jenis-menu-resto':
                        include 'modules/foodbeverage/master/jenis_menu_resto.php';
                        break;
                    
                    // Front Office - Chart modules
                    case 'chart-kamar-perbulan':
                        include 'modules/frontoffice/chart/chart_kamar_perbulan.php';
                        break;
                    case 'chart-pendapatan-bulanan':
                        include 'modules/frontoffice/chart/chart_pendapatan_bulanan.php';
                        break;
                    case 'chart-okupansi':
                        include 'modules/frontoffice/chart/chart_okupansi.php';
                        break;
                    case 'grafik-revenue':
                        include 'modules/frontoffice/chart/grafik_revenue.php';
                        break;
                    case 'analisa-market-segment':
                        include 'modules/frontoffice/chart/analisa_market_segment.php';
                        break;
                    case 'trend-booking':
                        include 'modules/frontoffice/chart/trend_booking.php';
                        break;
                    case 'perbandingan-tahun':
                        include 'modules/frontoffice/chart/perbandingan_tahun.php';
                        break;
                    
                    // Front Office - Form modules
                    case 'checkin-tamu':
                        include 'modules/frontoffice/form/checkin_tamu.php';
                        break;
                    case 'checkout-tamu':
                        include 'modules/frontoffice/form/checkout_tamu.php';
                        break;
                    case 'buat-reservasi':
                        include 'modules/frontoffice/form/buat_reservasi.php';
                        break;
                    case 'ubah-reservasi':
                        include 'modules/frontoffice/form/ubah_reservasi.php';
                        break;
                    case 'batal-reservasi':
                        include 'modules/frontoffice/form/batal_reservasi.php';
                        break;
                    case 'extend-stay':
                        include 'modules/frontoffice/form/extend_stay.php';
                        break;
                    case 'early-checkout':
                        include 'modules/frontoffice/form/early_checkout.php';
                        break;
                    case 'room-move':
                        include 'modules/frontoffice/form/room_move.php';
                        break;
                    case 'split-room':
                        include 'modules/frontoffice/form/split_room.php';
                        break;
                    case 'join-room':
                        include 'modules/frontoffice/form/join_room.php';
                        break;
                    case 'posting-manual':
                        include 'modules/frontoffice/form/posting_manual.php';
                        break;
                    case 'koreksi-posting':
                        include 'modules/frontoffice/form/koreksi_posting.php';
                        break;
                    case 'deposit-tamu':
                        include 'modules/frontoffice/form/deposit_tamu.php';
                        break;
                    case 'refund-deposit':
                        include 'modules/frontoffice/form/refund_deposit.php';
                        break;
                    case 'komplemen-kamar':
                        include 'modules/frontoffice/form/komplemen_kamar.php';
                        break;
                    case 'house-use':
                        include 'modules/frontoffice/form/house_use.php';
                        break;
                    case 'out-of-order':
                        include 'modules/frontoffice/form/out_of_order.php';
                        break;
                    case 'maintenance-request':
                        include 'modules/frontoffice/form/maintenance_request.php';
                        break;
                    
                    // Front Office - Info modules
                    case 'info-kamar-available':
                        include 'modules/frontoffice/info/info_kamar_available.php';
                        break;
                    case 'info-tamu-inhouse':
                        include 'modules/frontoffice/info/info_tamu_inhouse.php';
                        break;
                    case 'info-reservasi-hari-ini':
                        include 'modules/frontoffice/info/info_reservasi_hari_ini.php';
                        break;
                    case 'info-checkout-hari-ini':
                        include 'modules/frontoffice/info/info_checkout_hari_ini.php';
                        break;
                    case 'info-pending-checkout':
                        include 'modules/frontoffice/info/info_pending_checkout.php';
                        break;
                    case 'room-status-realtime':
                        include 'modules/frontoffice/info/room_status_realtime.php';
                        break;
                    case 'guest-folio':
                        include 'modules/frontoffice/info/guest_folio.php';
                        break;
                    case 'guest-history':
                        include 'modules/frontoffice/info/guest_history.php';
                        break;
                    case 'blacklist-guest':
                        include 'modules/frontoffice/info/blacklist_guest.php';
                        break;
                    case 'vip-guest':
                        include 'modules/frontoffice/info/vip_guest.php';
                        break;
                    case 'walk-in-forecast':
                        include 'modules/frontoffice/info/walk_in_forecast.php';
                        break;
                    case 'no-show-report':
                        include 'modules/frontoffice/info/no_show_report.php';
                        break;
                    case 'late-checkout':
                        include 'modules/frontoffice/info/late_checkout.php';
                        break;
                    case 'credit-limit':
                        include 'modules/frontoffice/info/credit_limit.php';
                        break;
                    case 'group-reservation':
                        include 'modules/frontoffice/info/group_reservation.php';
                        break;
                    
                    // Front Office - Laporan modules
                    case 'actual-shift-report':
                        include 'modules/frontoffice/laporan/actual_shift_report.php';
                        break;
                    case 'night-audit-report':
                        include 'modules/frontoffice/laporan/night_audit_report.php';
                        break;
                    case 'room-revenue-report':
                        include 'modules/frontoffice/laporan/room_revenue_report.php';
                        break;
                    case 'occupancy-report':
                        include 'modules/frontoffice/laporan/occupancy_report.php';
                        break;
                    case 'adr-revpar-report':
                        include 'modules/frontoffice/laporan/adr_revpar_report.php';
                        break;
                    case 'cash-flow-report':
                        include 'modules/frontoffice/laporan/cash_flow_report.php';
                        break;
                    case 'deposit-report':
                        include 'modules/frontoffice/laporan/deposit_report.php';
                        break;
                    case 'ar-aging-report':
                        include 'modules/frontoffice/laporan/ar_aging_report.php';
                        break;
                    case 'guest-registration':
                        include 'modules/frontoffice/laporan/guest_registration.php';
                        break;
                    case 'police-report':
                        include 'modules/frontoffice/laporan/police_report.php';
                        break;
                    case 'city-ledger':
                        include 'modules/frontoffice/laporan/city_ledger.php';
                        break;
                    case 'complimentary-report':
                        include 'modules/frontoffice/laporan/complimentary_report.php';
                        break;
                    case 'house-use-report':
                        include 'modules/frontoffice/laporan/house_use_report.php';
                        break;
                    case 'room-statistics':
                        include 'modules/frontoffice/laporan/room_statistics.php';
                        break;
                    case 'forecasting-report':
                        include 'modules/frontoffice/laporan/forecasting_report.php';
                        break;
                    case 'market-segment-analysis':
                        include 'modules/frontoffice/laporan/market_segment_analysis.php';
                        break;
                    case 'source-business-report':
                        include 'modules/frontoffice/laporan/source_business_report.php';
                        break;
                    case 'nationality-report':
                        include 'modules/frontoffice/laporan/nationality_report.php';
                        break;
                    
                    // Front Office - Master modules
                    case 'master-kamar':
                        include 'modules/frontoffice/master/master_kamar.php';
                        break;
                    case 'master-rate-kamar':
                        include 'modules/frontoffice/master/master_rate_kamar.php';
                        break;
                    case 'master-tipe-kamar':
                        include 'modules/frontoffice/master/master_tipe_kamar.php';
                        break;
                    case 'master-guest':
                        include 'modules/frontoffice/master/master_guest.php';
                        break;
                    case 'master-company':
                        include 'modules/frontoffice/master/master_company.php';
                        break;
                    case 'master-travel-agent':
                        include 'modules/frontoffice/master/master_travel_agent.php';
                        break;
                    case 'master-nationality':
                        include 'modules/frontoffice/master/master_nationality.php';
                        break;
                    case 'master-title':
                        include 'modules/frontoffice/master/master_title.php';
                        break;
                    case 'master-city':
                        include 'modules/frontoffice/master/master_city.php';
                        break;
                    case 'master-country':
                        include 'modules/frontoffice/master/master_country.php';
                        break;
                    case 'master-id-type':
                        include 'modules/frontoffice/master/master_id_type.php';
                        break;
                    case 'master-payment-type':
                        include 'modules/frontoffice/master/master_payment_type.php';
                        break;
                    case 'master-charge-code':
                        include 'modules/frontoffice/master/master_charge_code.php';
                        break;
                    case 'master-package':
                        include 'modules/frontoffice/master/master_package.php';
                        break;
                    case 'master-voucher':
                        include 'modules/frontoffice/master/master_voucher.php';
                        break;
                    case 'room-amenities':
                        include 'modules/frontoffice/master/room_amenities.php';
                        break;
                    case 'blacklist-management':
                        include 'modules/frontoffice/master/blacklist_management.php';
                        break;
                    
                    // Front Office - Status modules
                    case 'room-maintenance-status':
                        include 'modules/frontoffice/status/room_maintenance_status.php';
                        break;
                    case 'housekeeping-status':
                        include 'modules/frontoffice/status/housekeeping_status.php';
                        break;
                    case 'room-block-status':
                        include 'modules/frontoffice/status/room_block_status.php';
                        break;
                    case 'front-desk-log':
                        include 'modules/frontoffice/status/front_desk_log.php';
                        break;
                    case 'shift-handover':
                        include 'modules/frontoffice/status/shift_handover.php';
                        break;
                    case 'daily-checklist':
                        include 'modules/frontoffice/status/daily_checklist.php';
                        break;
                    
                    // Housekeeping - Chart modules
                    case 'chart-room-cleaning':
                        include 'modules/housekeeping/chart/chart_room_cleaning.php';
                        break;
                    case 'chart-maintenance-request':
                        include 'modules/housekeeping/chart/chart_maintenance_request.php';
                        break;
                    case 'chart-laundry-volume':
                        include 'modules/housekeeping/chart/chart_laundry_volume.php';
                        break;
                    case 'productivity-chart':
                        include 'modules/housekeeping/chart/productivity_chart.php';
                        break;
                    case 'amenities-usage':
                        include 'modules/housekeeping/chart/amenities_usage.php';
                        break;
                    
                    // Housekeeping - Form modules
                    case 'room-assignment':
                        include 'modules/housekeeping/form/room_assignment.php';
                        break;
                    case 'cleaning-schedule':
                        include 'modules/housekeeping/form/cleaning_schedule.php';
                        break;
                    case 'maintenance-request-hk':
                        include 'modules/housekeeping/form/maintenance_request_hk.php';
                        break;
                    case 'lost-found-entry':
                        include 'modules/housekeeping/form/lost_found_entry.php';
                        break;
                    case 'inventory-request':
                        include 'modules/housekeeping/form/inventory_request.php';
                        break;
                    case 'amenities-restock':
                        include 'modules/housekeeping/form/amenities_restock.php';
                        break;
                    case 'laundry-order':
                        include 'modules/housekeeping/form/laundry_order.php';
                        break;
                    case 'linen-exchange':
                        include 'modules/housekeeping/form/linen_exchange.php';
                        break;
                    case 'deep-cleaning-schedule':
                        include 'modules/housekeeping/form/deep_cleaning_schedule.php';
                        break;
                    case 'pest-control-log':
                        include 'modules/housekeeping/form/pest_control_log.php';
                        break;
                    case 'room-inspection':
                        include 'modules/housekeeping/form/room_inspection.php';
                        break;
                    case 'public-area-cleaning':
                        include 'modules/housekeeping/form/public_area_cleaning.php';
                        break;
                    
                    // Housekeeping - Info modules
                    case 'room-status-hk':
                        include 'modules/housekeeping/info/room_status_hk.php';
                        break;
                    case 'cleaning-progress':
                        include 'modules/housekeeping/info/cleaning_progress.php';
                        break;
                    case 'maintenance-status':
                        include 'modules/housekeeping/info/maintenance_status.php';
                        break;
                    case 'lost-found-items':
                        include 'modules/housekeeping/info/lost_found_items.php';
                        break;
                    case 'inventory-level':
                        include 'modules/housekeeping/info/inventory_level.php';
                        break;
                    case 'staff-assignment':
                        include 'modules/housekeeping/info/staff_assignment.php';
                        break;
                    case 'room-discrepancy':
                        include 'modules/housekeeping/info/room_discrepancy.php';
                        break;
                    case 'amenities-stock':
                        include 'modules/housekeeping/info/amenities_stock.php';
                        break;
                    case 'linen-status':
                        include 'modules/housekeeping/info/linen_status.php';
                        break;
                    case 'equipment-status':
                        include 'modules/housekeeping/info/equipment_status.php';
                        break;
                    
                    // Housekeeping - Laporan modules (complete)
                    case 'amenities-consumption':
                        include 'modules/housekeeping/laporan/amenities_consumption.php';
                        break;
                    case 'laundry-report':
                        include 'modules/laundry/laporan/laundry_report.php';
                        break;
                    case 'linen-par-level':
                        include 'modules/housekeeping/laporan/linen_par_level.php';
                        break;
                    case 'staff-performance':
                        include 'modules/housekeeping/laporan/staff_performance.php';
                        break;
                    case 'room-productivity-report':
                        include 'modules/housekeeping/laporan/room_productivity_report.php';
                        break;
                    case 'maintenance-summary':
                        include 'modules/housekeeping/laporan/maintenance_summary.php';
                        break;
                    case 'daily-housekeeping-report':
                        include 'modules/housekeeping/laporan/daily_housekeeping_report.php';
                        break;
                    case 'lost-found-report':
                        include 'modules/housekeeping/laporan/lost_found_report.php';
                        break;
                    case 'inventory-usage-report':
                        include 'modules/housekeeping/laporan/inventory_usage_report.php';
                        break;
                    case 'room-cleaning-report':
                        include 'modules/housekeeping/laporan/room_cleaning_report.php';
                        break;
                    case 'room-maintenance-history':
                        include 'modules/housekeeping/laporan/room_maintenance_history.php';
                        break;
                    case 'extra-bed-history':
                        include 'modules/housekeeping/laporan/extra_bed_history.php';
                        break;
                    case 'inspection-report':
                        include 'modules/housekeeping/laporan/inspection_report.php';
                        break;
                    
                    // Laundry - Form modules
                    case 'linen-exchange':
                        include 'modules/laundry/form/linen_exchange.php';
                        break;
                    case 'laundry-order':
                        include 'modules/laundry/form/laundry_order.php';
                        break;
                    
                    // Laundry - Laporan modules
                    case 'linen-status':
                        include 'modules/laundry/laporan/linen_status.php';
                        break;
                    case 'linen-in-progress':
                        include 'modules/laundry/laporan/linen_par_level.php';
                        break;
                    
                    // Laundry - Master Data modules
                    case 'laundry-amenities-stock':
                        include 'modules/laundry/masterdata/amenities_stock.php';
                        break;
                    case 'linen-status-master':
                        include 'modules/laundry/masterdata/linen_status.php';
                        break;
                    
                    // HRD - Account Receivable modules
                    case 'laporan-pershift':
                        include 'modules/hrd/accountreceivable/laporan/laporan_pershift.php';
                        break;
                    case 'laporan-night-audit':
                        include 'modules/hrd/accountreceivable/laporan/laporan_night_audit.php';
                        break;
                    
                    // HRD - Accounting modules
                    case 'laporan-global-accounting':
                        include 'modules/hrd/accounting/laporan/laporan_global.php';
                        break;
                    
                    // HRD - Administration modules
                    case 'profil-hotel':
                        include 'modules/hrd/administration/masterdata/profil_hotel.php';
                        break;

                    case 'dashboard':
                        // Default dashboard content
                        echo '<div class="content-card">
                                <h1 class="page-title">Eva Group Hotel Management System</h1>
                                <p>Welcome to Eva Group Hotel Management System. Your comprehensive solution for managing all hotel operations efficiently and effectively.</p>
                                <!-- Homepage dashboard content here -->
                              </div>';
                        break;
                    default:
                        // Generic module handler for modules without specific files
                        include 'modules/generic_module.php';
                        break;
                }
                ?>
            </main>
        </div>
    </div>

    <!-- ===== JAVASCRIPT SECTION ===== -->
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
        
        <!-- All dashboard scripts moved to js/dashboard-scripts.js -->
    </body>
</html>