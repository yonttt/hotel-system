import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import useHotels from '../../hooks/useHotels';

const LaundryPage = () => {
  const { user } = useAuth();
  const { hotels } = useHotels();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    hotel_name: '',
    room_number: '',
    guest_name: '',
    registration_no: '',
    order_date: new Date().toISOString().split('T')[0],
    item_name: '',
    quantity: 1,
    unit_price: 0,
    total_price: 0,
    status: 'Pending',
    notes: ''
  });
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showEntries, selectedHotel, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLaundryOrders();
      setOrders(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch laundry orders: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Filter data
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.registration_no?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesHotel = selectedHotel === 'ALL' || order.hotel_name === selectedHotel;
    const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus;

    return matchesSearch && matchesHotel && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * showEntries;
  const indexOfFirstItem = indexOfLastItem - showEntries;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / showEntries));

  const canEdit = () => ['admin', 'manager'].includes(user?.role?.toLowerCase());

  const formatCurrency = (amount) => {
    if (!amount) return '0';
    return parseFloat(amount).toLocaleString('id-ID');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  };

  // Calculate total price when quantity or unit_price changes
  const handleFormChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    if (field === 'quantity' || field === 'unit_price') {
      updated.total_price = (parseFloat(updated.quantity) || 0) * (parseFloat(updated.unit_price) || 0);
    }
    setFormData(updated);
  };

  const handleAddClick = () => {
    setFormData({
      hotel_name: hotels.length > 0 ? hotels[0].name : '',
      room_number: '',
      guest_name: '',
      registration_no: '',
      order_date: new Date().toISOString().split('T')[0],
      item_name: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      status: 'Pending',
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleAddSave = async () => {
    if (!formData.item_name || !formData.guest_name) {
      alert('Item name and guest name are required');
      return;
    }
    try {
      setProcessing(true);
      await apiService.createLaundryOrder(formData);
      setShowAddModal(false);
      setSuccessMessage('Laundry order created successfully!');
      fetchOrders();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Error creating order: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({
      hotel_name: item.hotel_name || '',
      room_number: item.room_number || '',
      guest_name: item.guest_name || '',
      registration_no: item.registration_no || '',
      order_date: item.order_date ? new Date(item.order_date).toISOString().split('T')[0] : '',
      item_name: item.item_name || '',
      quantity: item.quantity || 1,
      unit_price: item.unit_price || 0,
      total_price: item.total_price || 0,
      status: item.status || 'Pending',
      notes: item.notes || ''
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editingItem) return;
    try {
      setProcessing(true);
      await apiService.updateLaundryOrder(editingItem.id, formData);
      setShowEditModal(false);
      setEditingItem(null);
      setSuccessMessage('Laundry order updated successfully!');
      fetchOrders();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Error updating order: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete laundry order for "${item.guest_name}" - ${item.item_name}?`)) return;
    try {
      await apiService.deleteLaundryOrder(item.id);
      setSuccessMessage('Laundry order deleted successfully!');
      fetchOrders();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Error deleting order: ' + (err.response?.data?.detail || err.message));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Form modal component
  const renderFormModal = (title, onSave, onClose) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hotel</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.hotel_name}
                onChange={(e) => handleFormChange('hotel_name', e.target.value)}
              >
                <option value="">Select Hotel</option>
                {hotels.map(h => (
                  <option key={h.id} value={h.name}>{h.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.room_number}
                onChange={(e) => handleFormChange('room_number', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.guest_name}
                onChange={(e) => handleFormChange('guest_name', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration No</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.registration_no}
                onChange={(e) => handleFormChange('registration_no', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.order_date}
                onChange={(e) => handleFormChange('order_date', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.item_name}
                onChange={(e) => handleFormChange('item_name', e.target.value)}
                placeholder="e.g. Kemeja, Celana, Bed Sheet"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.quantity}
                onChange={(e) => handleFormChange('quantity', parseInt(e.target.value) || 1)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.unit_price}
                onChange={(e) => handleFormChange('unit_price', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                value={formData.total_price}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows="2"
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">🧺 Laundry Management</h1>
          <p className="page-subtitle">Manage laundry service orders</p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">{successMessage}</div>
        )}

        <div className="content-card">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Show</label>
                <select
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  value={showEntries}
                  onChange={(e) => setShowEntries(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>

              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
              >
                <option value="ALL">All Hotels</option>
                {hotels.map(h => (
                  <option key={h.id} value={h.name}>{h.name}</option>
                ))}
              </select>

              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded px-3 py-1 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {canEdit() && (
                <button
                  onClick={handleAddClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  + Add Order
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading laundry orders...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">No</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Hotel</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Room</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Guest</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Item</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Qty</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Price</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Total</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                    {canEdit() && <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={canEdit() ? 11 : 10} className="text-center py-8 text-gray-500">
                        No laundry orders found
                      </td>
                    </tr>
                  ) : (
                    currentOrders.map((order, index) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{indexOfFirstItem + index + 1}</td>
                        <td className="px-4 py-3">{order.hotel_name || '-'}</td>
                        <td className="px-4 py-3">{order.room_number || '-'}</td>
                        <td className="px-4 py-3 font-medium">{order.guest_name || '-'}</td>
                        <td className="px-4 py-3">{formatDate(order.order_date)}</td>
                        <td className="px-4 py-3">{order.item_name}</td>
                        <td className="px-4 py-3 text-right">{order.quantity}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(order.unit_price)}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(order.total_price)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        {canEdit() && (
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleEditClick(order)}
                              className="text-blue-600 hover:text-blue-800 mr-2 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(order)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>
              Showing {filteredOrders.length === 0 ? 0 : indexOfFirstItem + 1} to{' '}
              {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} entries
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-blue-600 text-white' : ''}`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showAddModal && renderFormModal('Add Laundry Order', handleAddSave, () => setShowAddModal(false))}
        {showEditModal && renderFormModal('Edit Laundry Order', handleEditSave, () => { setShowEditModal(false); setEditingItem(null); })}
      </div>
    </Layout>
  );
};

export default LaundryPage;