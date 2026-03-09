import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

const AccountReceivablePage = () => {
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
    invoice_no: '',
    guest_name: '',
    room_number: '',
    registration_no: '',
    description: '',
    amount: 0,
    paid_amount: 0,
    balance: 0,
    due_date: '',
    status: 'Outstanding',
    payment_method: '',
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
      const response = await apiService.getAccountReceivables();
      setRecords(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch records: ' + (err.response?.data?.detail || err.message));
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
      record.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.invoice_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchTerm.toLowerCase());

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
    if (field === 'amount' || field === 'paid_amount') {
      updated.balance = (parseFloat(updated.amount) || 0) - (parseFloat(updated.paid_amount) || 0);
      if (updated.balance <= 0) {
        updated.status = 'Paid';
      } else if (parseFloat(updated.paid_amount) > 0) {
        updated.status = 'Partial';
      } else {
        updated.status = 'Outstanding';
      }
    }
    setFormData(updated);
  };

  const handleAddClick = async () => {
    let nextInvoice = '';
    try {
      const res = await apiService.getNextInvoiceNumber();
      nextInvoice = res.data?.next_invoice_no || '';
    } catch (err) {
      console.error('Error getting next invoice:', err);
    }
    setFormData({
      hotel_name: hotels.length > 0 ? hotels[0].name : '',
      invoice_no: nextInvoice,
      guest_name: '',
      room_number: '',
      registration_no: '',
      description: '',
      amount: 0,
      paid_amount: 0,
      balance: 0,
      due_date: '',
      status: 'Outstanding',
      payment_method: '',
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleAddSave = async () => {
    if (!formData.guest_name) {
      alert('Guest name is required');
      return;
    }
    try {
      setProcessing(true);
      await apiService.createAccountReceivable(formData);
      setShowAddModal(false);
      setSuccessMessage('Account receivable created successfully!');
      fetchRecords();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Error creating record: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({
      hotel_name: item.hotel_name || '',
      invoice_no: item.invoice_no || '',
      guest_name: item.guest_name || '',
      room_number: item.room_number || '',
      registration_no: item.registration_no || '',
      description: item.description || '',
      amount: item.amount || 0,
      paid_amount: item.paid_amount || 0,
      balance: item.balance || 0,
      due_date: item.due_date ? new Date(item.due_date).toISOString().split('T')[0] : '',
      status: item.status || 'Outstanding',
      payment_method: item.payment_method || '',
      notes: item.notes || ''
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editingItem) return;
    try {
      setProcessing(true);
      await apiService.updateAccountReceivable(editingItem.id, formData);
      setShowEditModal(false);
      setEditingItem(null);
      setSuccessMessage('Account receivable updated successfully!');
      fetchRecords();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Error updating record: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete invoice "${item.invoice_no}" for "${item.guest_name}"?`)) return;
    try {
      await apiService.deleteAccountReceivable(item.id);
      setSuccessMessage('Account receivable deleted successfully!');
      fetchRecords();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Error deleting record: ' + (err.response?.data?.detail || err.message));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Outstanding': 'bg-red-100 text-red-800',
      'Partial': 'bg-yellow-100 text-yellow-800',
      'Paid': 'bg-green-100 text-green-800',
      'Overdue': 'bg-red-200 text-red-900'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Summary calculations
  const totalAmount = filteredRecords.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
  const totalPaid = filteredRecords.reduce((sum, r) => sum + parseFloat(r.paid_amount || 0), 0);
  const totalBalance = filteredRecords.reduce((sum, r) => sum + parseFloat(r.balance || 0), 0);

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.invoice_no}
                onChange={(e) => handleFormChange('invoice_no', e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.room_number}
                onChange={(e) => handleFormChange('room_number', e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.due_date}
                onChange={(e) => handleFormChange('due_date', e.target.value)}
              />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.amount}
                onChange={(e) => handleFormChange('amount', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.paid_amount}
                onChange={(e) => handleFormChange('paid_amount', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                value={formData.balance}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.payment_method}
                onChange={(e) => handleFormChange('payment_method', e.target.value)}
              >
                <option value="">Select Method</option>
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit">Debit</option>
                <option value="Voucher">Voucher</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={formData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
              >
                <option value="Outstanding">Outstanding</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
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
          <h1 className="page-title">💰 Account Receivable</h1>
          <p className="page-subtitle">Manage outstanding payments and receivables</p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">{successMessage}</div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-xl font-bold text-gray-800">Rp {formatCurrency(totalAmount)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Total Paid</p>
            <p className="text-xl font-bold text-green-700">Rp {formatCurrency(totalPaid)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <p className="text-sm text-gray-600">Outstanding Balance</p>
            <p className="text-xl font-bold text-red-700">Rp {formatCurrency(totalBalance)}</p>
          </div>
        </div>

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
                <option value="Outstanding">Outstanding</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input type="text" placeholder="Search..." className="border border-gray-300 rounded px-3 py-1 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              {canEdit() && (
                <button onClick={handleAddClick} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">+ Add Invoice</button>
              )}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading records...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">No</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Invoice</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Hotel</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Guest</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Room</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Description</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Amount</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Paid</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Balance</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Due Date</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                    {canEdit() && <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.length === 0 ? (
                    <tr><td colSpan={canEdit() ? 12 : 11} className="text-center py-8 text-gray-500">No records found</td></tr>
                  ) : (
                    currentRecords.map((record, index) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{indexOfFirstItem + index + 1}</td>
                        <td className="px-4 py-3 font-medium">{record.invoice_no || '-'}</td>
                        <td className="px-4 py-3">{record.hotel_name || '-'}</td>
                        <td className="px-4 py-3">{record.guest_name || '-'}</td>
                        <td className="px-4 py-3">{record.room_number || '-'}</td>
                        <td className="px-4 py-3 max-w-[200px] truncate">{record.description || '-'}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(record.amount)}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(record.paid_amount)}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(record.balance)}</td>
                        <td className="px-4 py-3">{formatDate(record.due_date)}</td>
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
        {showAddModal && renderFormModal('Add Account Receivable', handleAddSave, () => setShowAddModal(false))}
        {showEditModal && renderFormModal('Edit Account Receivable', handleEditSave, () => { setShowEditModal(false); setEditingItem(null); })}
      </div>
    </Layout>
  );
};

export default AccountReceivablePage;