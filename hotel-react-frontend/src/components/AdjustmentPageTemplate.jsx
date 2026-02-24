import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';

/**
 * Reusable Adjustment Page component for all adjustment categories.
 * Props:
 *  - category: string (food_beverage, inventory, kos, laundry, meeting_room, petty_cash)
 *  - title: string
 *  - subtitle: string
 *  - icon: string (emoji)
 *  - adjTypes: string[] (list of adjustment types for dropdown)
 */
const AdjustmentPageTemplate = ({ category, title, subtitle, icon, adjTypes = [] }) => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [hotels, setHotels] = useState([]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    hotel_name: '',
    adj_date: new Date().toISOString().split('T')[0],
    adj_type: adjTypes.length > 0 ? adjTypes[0] : '',
    category: category,
    reference_no: '',
    description: '',
    guest_name: '',
    room_number: '',
    item_name: '',
    original_amount: 0,
    adjusted_amount: 0,
    difference: 0,
    reason: '',
    status: 'Pending',
    notes: ''
  });
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRecords();
    fetchHotels();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showEntries, selectedHotel, selectedStatus]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdjustmentsByCategory(category);
      setRecords(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch adjustments: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await apiService.getHotels(true);
      setHotels(response.data || []);
    } catch (err) {
      console.error('Error fetching hotels:', err);
    }
  };

  // Filter data
  const filteredRecords = records.filter(record => {
    const matchesSearch =
      record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.reference_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.reason?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesHotel = selectedHotel === 'ALL' || record.hotel_name === selectedHotel;
    const matchesStatus = selectedStatus === 'ALL' || record.status === selectedStatus;

    return matchesSearch && matchesHotel && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * showEntries;
  const indexOfFirstItem = indexOfLastItem - showEntries;
  const currentRecords = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / showEntries));

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

  const handleFormChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    if (field === 'original_amount' || field === 'adjusted_amount') {
      updated.difference = (parseFloat(updated.adjusted_amount) || 0) - (parseFloat(updated.original_amount) || 0);
    }
    setFormData(updated);
  };

  const handleAddClick = () => {
    setFormData({
      hotel_name: hotels.length > 0 ? hotels[0].name : '',
      adj_date: new Date().toISOString().split('T')[0],
      adj_type: adjTypes.length > 0 ? adjTypes[0] : '',
      category: category,
      reference_no: '',
      description: '',
      guest_name: '',
      room_number: '',
      item_name: '',
      original_amount: 0,
      adjusted_amount: 0,
      difference: 0,
      reason: '',
      status: 'Pending',
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleAddSave = async () => {
    if (!formData.description && !formData.item_name) {
      alert('Description or item name is required');
      return;
    }
    try {
      setProcessing(true);
      await apiService.createAdjustment({ ...formData, category });
      setShowAddModal(false);
      setSuccessMessage('Adjustment created successfully!');
      fetchRecords();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Error creating adjustment: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({
      hotel_name: item.hotel_name || '',
      adj_date: item.adj_date ? new Date(item.adj_date).toISOString().split('T')[0] : '',
      adj_type: item.adj_type || '',
      category: category,
      reference_no: item.reference_no || '',
      description: item.description || '',
      guest_name: item.guest_name || '',
      room_number: item.room_number || '',
      item_name: item.item_name || '',
      original_amount: item.original_amount || 0,
      adjusted_amount: item.adjusted_amount || 0,
      difference: item.difference || 0,
      reason: item.reason || '',
      status: item.status || 'Pending',
      notes: item.notes || ''
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editingItem) return;
    try {
      setProcessing(true);
      await apiService.updateAdjustment(editingItem.id, formData);
      setShowEditModal(false);
      setEditingItem(null);
      setSuccessMessage('Adjustment updated successfully!');
      fetchRecords();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Error updating adjustment: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete adjustment "${item.reference_no || item.description}"?`)) return;
    try {
      await apiService.deleteAdjustment(item.id);
      setSuccessMessage('Adjustment deleted successfully!');
      fetchRecords();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Error deleting adjustment: ' + (err.response?.data?.detail || err.message));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Completed': 'bg-blue-100 text-blue-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const renderFormModal = (modalTitle, onSave, onClose) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{modalTitle}</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.adj_date}
                onChange={(e) => handleFormChange('adj_date', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Type</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.adj_type}
                onChange={(e) => handleFormChange('adj_type', e.target.value)}
              >
                <option value="">Select Type</option>
                {adjTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference No</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.reference_no}
                onChange={(e) => handleFormChange('reference_no', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.guest_name}
                onChange={(e) => handleFormChange('guest_name', e.target.value)}
              />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.item_name}
                onChange={(e) => handleFormChange('item_name', e.target.value)}
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
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Amount</label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.original_amount}
                onChange={(e) => handleFormChange('original_amount', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adjusted Amount</label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.adjusted_amount}
                onChange={(e) => handleFormChange('adjusted_amount', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difference</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                value={formData.difference}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.reason}
                onChange={(e) => handleFormChange('reason', e.target.value)}
              />
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
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={onSave} disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
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
          <h1 className="page-title">{icon} {title}</h1>
          <p className="page-subtitle">{subtitle}</p>
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
                <select className="border border-gray-300 rounded px-2 py-1 text-sm" value={showEntries} onChange={(e) => setShowEntries(Number(e.target.value))}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>

              <select className="border border-gray-300 rounded px-2 py-1 text-sm" value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}>
                <option value="ALL">All Hotels</option>
                {hotels.map(h => (<option key={h.id} value={h.name}>{h.name}</option>))}
              </select>

              <select className="border border-gray-300 rounded px-2 py-1 text-sm" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="ALL">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input type="text" placeholder="Search..." className="border border-gray-300 rounded px-3 py-1 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              {canEdit() && (
                <button onClick={handleAddClick} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">+ Add Adjustment</button>
              )}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading adjustments...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">No</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Hotel</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Ref No</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Description</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Original</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Adjusted</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Diff</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                    {canEdit() && <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.length === 0 ? (
                    <tr><td colSpan={canEdit() ? 11 : 10} className="text-center py-8 text-gray-500">No adjustments found</td></tr>
                  ) : (
                    currentRecords.map((record, index) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{indexOfFirstItem + index + 1}</td>
                        <td className="px-4 py-3">{formatDate(record.adj_date)}</td>
                        <td className="px-4 py-3">{record.hotel_name || '-'}</td>
                        <td className="px-4 py-3">{record.adj_type || '-'}</td>
                        <td className="px-4 py-3">{record.reference_no || '-'}</td>
                        <td className="px-4 py-3 max-w-[200px] truncate">{record.description || record.item_name || '-'}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(record.original_amount)}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(record.adjusted_amount)}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          <span className={parseFloat(record.difference) >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {parseFloat(record.difference) >= 0 ? '+' : ''}{formatCurrency(record.difference)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(record.status)}`}>{record.status}</span>
                        </td>
                        {canEdit() && (
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => handleEditClick(record)} className="text-blue-600 hover:text-blue-800 mr-2 text-xs">Edit</button>
                            <button onClick={() => handleDelete(record)} className="text-red-600 hover:text-red-800 text-xs">Delete</button>
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
            <span>Showing {filteredRecords.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRecords.length)} of {filteredRecords.length} entries</span>
            <div className="flex gap-1">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (page > totalPages) return null;
                return (<button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-blue-600 text-white' : ''}`}>{page}</button>);
              })}
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showAddModal && renderFormModal(`Add ${title}`, handleAddSave, () => setShowAddModal(false))}
        {showEditModal && renderFormModal(`Edit ${title}`, handleEditSave, () => { setShowEditModal(false); setEditingItem(null); })}
      </div>
    </Layout>
  );
};

export default AdjustmentPageTemplate;
