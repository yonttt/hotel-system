<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: index.php");
    exit();
}
?>

<div class="content-area">
    <div class="content-header">
        <h1>Laundry Order</h1>
        <p>Stok Opname Laundry Management</p>
    </div>
    
    <div class="content-body">
        <!-- Filter Section -->
        <div class="bg-white p-6 rounded-lg shadow mb-6">
            <h3 class="text-lg font-semibold mb-4">Filter Stok Opname</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Periode Dari</label>
                    <input type="date" class="w-full p-2 border border-gray-300 rounded-md">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Periode Sampai</label>
                    <input type="date" class="w-full p-2 border border-gray-300 rounded-md">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <select class="w-full p-2 border border-gray-300 rounded-md">
                        <option>Semua Kategori</option>
                        <option>Linen</option>
                        <option>Amenities</option>
                        <option>Cleaning Supplies</option>
                    </select>
                </div>
                <div class="flex items-end">
                    <button class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                        Filter
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Stok Opname Table -->
        <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Stok Opname Laundry</h3>
                <button class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
                    + Add New Item
                </button>
            </div>
            
            <div class="overflow-x-auto">
                <table class="min-w-full table-auto">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Sistem</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Fisik</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selisih</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">2024-01-15</td>
                            <td class="px-6 py-4 whitespace-nowrap">Bed Sheet King Size</td>
                            <td class="px-6 py-4 whitespace-nowrap">Linen</td>
                            <td class="px-6 py-4 whitespace-nowrap">100</td>
                            <td class="px-6 py-4 whitespace-nowrap">98</td>
                            <td class="px-6 py-4 whitespace-nowrap text-red-600">-2</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Pending
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button class="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                                <button class="text-green-600 hover:text-green-900">Approve</button>
                            </td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">2024-01-15</td>
                            <td class="px-6 py-4 whitespace-nowrap">Bath Towel</td>
                            <td class="px-6 py-4 whitespace-nowrap">Linen</td>
                            <td class="px-6 py-4 whitespace-nowrap">150</td>
                            <td class="px-6 py-4 whitespace-nowrap">152</td>
                            <td class="px-6 py-4 whitespace-nowrap text-green-600">+2</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Approved
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button class="text-blue-600 hover:text-blue-900 mr-2">View</button>
                                <button class="text-gray-600 hover:text-gray-900">Print</button>
                            </td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">2024-01-14</td>
                            <td class="px-6 py-4 whitespace-nowrap">Shampoo Bottle</td>
                            <td class="px-6 py-4 whitespace-nowrap">Amenities</td>
                            <td class="px-6 py-4 whitespace-nowrap">200</td>
                            <td class="px-6 py-4 whitespace-nowrap">200</td>
                            <td class="px-6 py-4 whitespace-nowrap text-gray-600">0</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Approved
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button class="text-blue-600 hover:text-blue-900 mr-2">View</button>
                                <button class="text-gray-600 hover:text-gray-900">Print</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            <div class="flex items-center justify-between mt-4">
                <div class="text-sm text-gray-700">
                    Showing 1 to 3 of 15 results
                </div>
                <div class="flex space-x-2">
                    <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">Previous</button>
                    <button class="px-3 py-1 bg-blue-500 text-white rounded-md">1</button>
                    <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">2</button>
                    <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">3</button>
                    <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">Next</button>
                </div>
            </div>
        </div>
    </div>
</div>
