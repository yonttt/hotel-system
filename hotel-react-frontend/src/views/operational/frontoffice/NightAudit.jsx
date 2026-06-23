import { useState, useEffect } from 'react';
import { apiService } from '../../../api/api';
import Layout from '../../../ui/Layout';
import Button from '../../../ui/Button';
import DataTable from '../../../ui/DataTable';
import UnifiedTableHeader from '../../../ui/UnifiedTableHeader';
import UnifiedTableFooter from '../../../ui/UnifiedTableFooter';
import { useAuth } from '../../../state/AuthContext';
import useHotels from '../../../logic/useHotels';
import usePaginatedTable from '../../../logic/usePaginatedTable';
import { formatCurrencyIDR } from '../../../utils/formatters';
import { useNotification } from '../../../state/NotificationContext';

const NightAudit = () => {
  useAuth();
  const { hotels } = useHotels();
  const { showNotification } = useNotification();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Add/Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    audit_date: '',
    hotel_name: '',
    room_number: '',
    guest_name: '',
    extra_bed: 0,
    extra_bill: 0,
    late_charge: 0,
    discount: 0,
    meeting_room: 0,
    add_meeting_room: 0,
    cash: 0,
    debet: 0,
    transfer: 0,
    voucher: 0,
    creditcard: 0,
    guest_ledger_minus: 0,
    guest_ledger_plus: 0,
    notes: ''
  });
  const [processing, setProcessing] = useState(false);

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    selectedHotel, setSelectedHotel,
    filteredItems: filteredAudits, currentData,
    totalPages, startIndex, endIndex
  } = usePaginatedTable(audits, {
    searchFields: ['room_number', 'guest_name'],
    initialShowEntries: 20
  });

  useEffect(() => {
    fetchAuditData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedHotel]);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getNightAudits(selectedDate, selectedHotel);
      setAudits(response.data || []);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setAudits([]);
        setError(null);
      } else {
        setError('Failed to fetch night audit data: ' + (err.response?.data?.detail || err.message));
        console.error('Error fetching night audit data:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      audit_date: selectedDate,
      hotel_name: selectedHotel !== 'ALL' ? selectedHotel : (hotels.length > 0 ? hotels[0].name : ''),
      room_number: '',
      guest_name: '',
      extra_bed: 0,
      extra_bill: 0,
      late_charge: 0,
      discount: 0,
      meeting_room: 0,
      add_meeting_room: 0,
      cash: 0,
      debet: 0,
      transfer: 0,
      voucher: 0,
      creditcard: 0,
      guest_ledger_minus: 0,
      guest_ledger_plus: 0,
      notes: ''
    });
    setShowModal(true);
  };

  // Handle edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      audit_date: item.audit_date,
      hotel_name: item.hotel_name || '',
      room_number: item.room_number || '',
      guest_name: item.guest_name || '',
      extra_bed: item.extra_bed || 0,
      extra_bill: item.extra_bill || 0,
      late_charge: item.late_charge || 0,
      discount: item.discount || 0,
      meeting_room: item.meeting_room || 0,
      add_meeting_room: item.add_meeting_room || 0,
      cash: item.cash || 0,
      debet: item.debet || 0,
      transfer: item.transfer || 0,
      voucher: item.voucher || 0,
      creditcard: item.creditcard || 0,
      guest_ledger_minus: item.guest_ledger_minus || 0,
      guest_ledger_plus: item.guest_ledger_plus || 0,
      notes: item.notes || ''
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete night audit for room ${item.room_number}?`)) {
      return;
    }
    
    try {
      await apiService.deleteNightAudit(item.id);
      showNotification('success', `Night audit for room ${item.room_number} deleted successfully`);
      fetchAuditData();
    } catch (err) {
      showNotification('error', 'Failed to delete: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!formData.room_number) {
      showNotification('error', 'Please enter room number');
      return;
    }
    
    setProcessing(true);
    try {
      if (editingItem) {
        await apiService.updateNightAudit(editingItem.id, formData);
        showNotification('success', 'Night audit updated successfully');
      } else {
        await apiService.createNightAudit(formData);
        showNotification('success', 'Night audit created successfully');
      }
      setShowModal(false);
      setEditingItem(null);
      fetchAuditData();
    } catch (err) {
      showNotification('error', 'Failed to save: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessNightAudit = async () => {
    setProcessing(true);
    try {
      const response = await apiService.processNightAudit({
        audit_date: selectedDate,
        hotel_name: selectedHotel
      });
      showNotification('success', response.data.message || 'Night audit processed successfully');
      fetchAuditData();
    } catch (err) {
      showNotification('error', 'Failed to process night audit: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle form change
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
        {/* Error Message */}
        {error && (
          <div className="alert alert--error">{error}</div>
        )}

        <UnifiedTableHeader
          title="Night Audit History"
          actions={(
            <>
              <Button variant="primary" size="sm" onClick={handleAddNew}>+ Tambah Data</Button>
              <Button variant="warning" size="sm" onClick={handleProcessNightAudit} disabled={processing}>
                {processing ? 'Processing...' : 'Process Night Audit'}
              </Button>
            </>
          )}
          topRightExtra={(
            <>
              <div className="date-select" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label>Date :</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '13px'
                  }}
                />
              </div>
              <div className="hotel-select">
                <label>Hotel :</label>
                <select
                  className="header-hotel-select"
                  value={selectedHotel}
                  onChange={(e) => setSelectedHotel(e.target.value)}
                >
                  <option value="ALL">ALL</option>
                  {hotels.map(hotel => (
                    <option key={hotel.id} value={hotel.name}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showEntries={showEntries}
          onEntriesChange={setShowEntries}
        />

        <DataTable
          data={currentData}
          loading={loading}
          emptyText="No data available in table"
          rowKey={(item) => item.id}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '50px',
              render: (_i, idx) => startIndex + idx + 1 },
            { key: 'room', header: 'Room', render: (i) => i.room_number || '-' },
            { key: 'extra_bed', header: 'Extra Bed', align: 'right', render: (i) => formatCurrencyIDR(i.extra_bed) },
            { key: 'extra_bill', header: 'Extra Bill', align: 'right', render: (i) => formatCurrencyIDR(i.extra_bill) },
            { key: 'late_charge', header: 'Late Charge', align: 'right', render: (i) => formatCurrencyIDR(i.late_charge) },
            { key: 'discount', header: 'Discount', align: 'right', render: (i) => formatCurrencyIDR(i.discount) },
            { key: 'meeting_room', header: 'Meeting Room', align: 'right', render: (i) => formatCurrencyIDR(i.meeting_room) },
            { key: 'add_meeting_room', header: 'Add. Meeting Room', align: 'right', render: (i) => formatCurrencyIDR(i.add_meeting_room) },
            { key: 'cash', header: 'Cash', align: 'right', render: (i) => formatCurrencyIDR(i.cash) },
            { key: 'debet', header: 'Debet', align: 'right', render: (i) => formatCurrencyIDR(i.debet) },
            { key: 'transfer', header: 'Transfer', align: 'right', render: (i) => formatCurrencyIDR(i.transfer) },
            { key: 'voucher', header: 'Voucher', align: 'right', render: (i) => formatCurrencyIDR(i.voucher) },
            { key: 'creditcard', header: 'Creditcard', align: 'right', render: (i) => formatCurrencyIDR(i.creditcard) },
            { key: 'gl_minus', header: 'Guest Ledger -', align: 'right', render: (i) => formatCurrencyIDR(i.guest_ledger_minus) },
            { key: 'gl_plus', header: 'Guest Ledger +', align: 'right', render: (i) => formatCurrencyIDR(i.guest_ledger_plus) },
            { key: 'action', header: 'Action', align: 'center', width: '140px',
              render: (i) => (
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(i)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(i)}>Del</Button>
                </div>
              ) }
          ]}
        />

        <UnifiedTableFooter
          startIndex={startIndex}
          endIndex={endIndex}
          total={filteredAudits.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showFirstLast={false}
        />

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="app-modal-overlay">
            <div className="app-modal-card" style={{ maxWidth: '700px' }}>
              <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                {editingItem ? 'Edit Night Audit' : 'Tambah Data Night Audit'}
              </h3>

              {/* Basic Info */}
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Date <span style={{color: 'red'}}>*</span></label>
                  <input
                    type="date"
                    value={formData.audit_date}
                    onChange={(e) => handleFormChange('audit_date', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Hotel <span style={{color: 'red'}}>*</span></label>
                  <select
                    value={formData.hotel_name}
                    onChange={(e) => handleFormChange('hotel_name', e.target.value)}
                    className="form-input"
                  >
                    {hotels.map(hotel => (
                      <option key={hotel.id} value={hotel.name}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Room Number <span style={{color: 'red'}}>*</span></label>
                  <input
                    type="text"
                    value={formData.room_number}
                    onChange={(e) => handleFormChange('room_number', e.target.value)}
                    placeholder="Enter room number"
                    className="form-input"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Guest Name</label>
                  <input
                    type="text"
                    value={formData.guest_name}
                    onChange={(e) => handleFormChange('guest_name', e.target.value)}
                    placeholder="Enter guest name"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Revenue Items Section */}
              <h4 style={{ marginTop: '20px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px', color: '#333' }}>Revenue Items</h4>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Extra Bed</label>
                  <input
                    type="number"
                    value={formData.extra_bed}
                    onChange={(e) => handleFormChange('extra_bed', parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Extra Bill</label>
                  <input
                    type="number"
                    value={formData.extra_bill}
                    onChange={(e) => handleFormChange('extra_bill', parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Late Charge</label>
                  <input
                    type="number"
                    value={formData.late_charge}
                    onChange={(e) => handleFormChange('late_charge', parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Discount</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => handleFormChange('discount', parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Meeting Room</label>
                  <input
                    type="number"
                    value={formData.meeting_room}
                    onChange={(e) => handleFormChange('meeting_room', parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Add. Meeting Room</label>
                  <input
                    type="number"
                    value={formData.add_meeting_room}
                    onChange={(e) => handleFormChange('add_meeting_room', parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Payment Methods Section */}
              <h4 style={{ marginTop: '20px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px', color: '#333' }}>Payment Methods</h4>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Cash</label>
                  <input
                    type="number"
                    value={formData.cash}
                    onChange={(e) => handleFormChange('cash', parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Debet</label>
                  <input
                    type="number"
                    value={formData.debet}
                    onChange={(e) => handleFormChange('debet', parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Transfer</label>
                  <input
                    type="number"
                    value={formData.transfer}
                    onChange={(e) => handleFormChange('transfer', parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Voucher</label>
                  <input
                    type="number"
                    value={formData.voucher}
                    onChange={(e) => handleFormChange('voucher', parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Creditcard</label>
                  <input
                    type="number"
                    value={formData.creditcard}
                    onChange={(e) => handleFormChange('creditcard', parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                </div>
                <div style={{ flex: 1 }}></div>
              </div>

              {/* Guest Ledger Section */}
              <h4 style={{ marginTop: '20px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px', color: '#333' }}>Guest Ledger</h4>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Guest Ledger - (Minus)</label>
                  <input
                    type="number"
                    value={formData.guest_ledger_minus}
                    onChange={(e) => handleFormChange('guest_ledger_minus', parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Guest Ledger + (Plus)</label>
                  <input
                    type="number"
                    value={formData.guest_ledger_plus}
                    onChange={(e) => handleFormChange('guest_ledger_plus', parseFloat(e.target.value) || 0)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '20px' }}>
                <label className="field-label">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  rows="3"
                  placeholder="Enter notes..."
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button variant="success" onClick={handleSave} disabled={processing}>
                  {processing ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NightAudit;

