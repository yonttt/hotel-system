<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: index.php");
    exit();
}
?>

<div class="content-area">
    <div class="content-header">
        <h1>Linen Exchange</h1>
        <p>Manage linen exchange operations</p>
    </div>
    
    <div class="content-body">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Penerimaan Linen -->
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-4">Penerimaan Linen</h3>
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                        <input type="date" class="w-full p-2 border border-gray-300 rounded-md">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Linen</label>
                        <select class="w-full p-2 border border-gray-300 rounded-md">
                            <option>Pilih Jenis Linen</option>
                            <option>Bed Sheet</option>
                            <option>Pillow Case</option>
                            <option>Towel</option>
                            <option>Bath Towel</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                        <input type="number" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter quantity">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Kondisi</label>
                        <select class="w-full p-2 border border-gray-300 rounded-md">
                            <option>Bersih</option>
                            <option>Kotor</option>
                            <option>Rusak</option>
                        </select>
                    </div>
                    <button type="submit" class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                        Save Penerimaan
                    </button>
                </form>
            </div>
            
            <!-- Pengiriman Linen -->
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-4">Pengiriman Linen</h3>
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                        <input type="date" class="w-full p-2 border border-gray-300 rounded-md">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tujuan</label>
                        <select class="w-full p-2 border border-gray-300 rounded-md">
                            <option>Pilih Tujuan</option>
                            <option>Laundry External</option>
                            <option>Housekeeping</option>
                            <option>Room Service</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Linen</label>
                        <select class="w-full p-2 border border-gray-300 rounded-md">
                            <option>Pilih Jenis Linen</option>
                            <option>Bed Sheet</option>
                            <option>Pillow Case</option>
                            <option>Towel</option>
                            <option>Bath Towel</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                        <input type="number" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter quantity">
                    </div>
                    <button type="submit" class="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
                        Save Pengiriman
                    </button>
                </form>
            </div>
        </div>
        
        <!-- Stok Opname Laundry -->
        <div class="bg-white p-6 rounded-lg shadow mt-6">
            <h3 class="text-lg font-semibold mb-4">Stok Opname Laundry</h3>
            <div class="overflow-x-auto">
                <table class="min-w-full table-auto">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Linen</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Awal</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masuk</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keluar</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Akhir</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">Bed Sheet</td>
                            <td class="px-6 py-4 whitespace-nowrap">100</td>
                            <td class="px-6 py-4 whitespace-nowrap">20</td>
                            <td class="px-6 py-4 whitespace-nowrap">15</td>
                            <td class="px-6 py-4 whitespace-nowrap">105</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">Pillow Case</td>
                            <td class="px-6 py-4 whitespace-nowrap">200</td>
                            <td class="px-6 py-4 whitespace-nowrap">30</td>
                            <td class="px-6 py-4 whitespace-nowrap">25</td>
                            <td class="px-6 py-4 whitespace-nowrap">205</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
