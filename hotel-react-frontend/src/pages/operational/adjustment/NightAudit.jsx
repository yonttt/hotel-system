import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';

const NightAudit = () => {
  const { user } = useAuth();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntries, setShowEntries] = useState(20);
  const [successMessage, setSuccessMessage] = useState(null);

  // Master data
  const [hotelOptions, setHotelOptions] = useState([]);

  // Add/Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    audit_date: '',
    hotel_name: 'HOTEL NEW IDOLA',
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

  useEffect(() => {
    fetchMasterData();
    fetchAuditData();
  }, [selectedDate, selectedHotel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showEntries]);

  const fetchMasterData = async () => {
    try {
      const hotelResponse = await apiService.getHotels();
      setHotelOptions(hotelResponse.data || []);
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

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

  // Filter audits
  const filteredAudits = audits.filter(item => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        item.room_number?.toLowerCase().includes(search) ||
        item.guest_name?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAudits.length / showEntries));
  const startIndex = (currentPage - 1) * showEntries;
  const endIndex = startIndex + showEntries;
  const currentData = filteredAudits.slice(startIndex, endIndex);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      audit_date: selectedDate,
      hotel_name: selectedHotel !== 'ALL' ? selectedHotel : 'HOTEL NEW IDOLA',
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
      hotel_name: item.hotel_name || 'HOTEL NEW IDOLA',
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
      setSuccessMessage(`Night audit for room ${item.room_number} deleted successfully`);
      fetchAuditData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to delete: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!formData.room_number) {
      alert('Please enter room number');
      return;
    }
    
    setProcessing(true);
    try {
      if (editingItem) {
        await apiService.updateNightAudit(editingItem.id, formData);
        setSuccessMessage('Night audit updated successfully');
      } else {
        await apiService.createNightAudit(formData);
        setSuccessMessage('Night audit created successfully');
      }
      setShowModal(false);
      setEditingItem(null);
      fetchAuditData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to save: ' + (err.response?.data?.detail || err.message));
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
        {/* Success Message */}
        {successMessage && (
          <div style={{
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            color: '#155724',
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span>Night Audit History</span>
                <button
                  onClick={handleAddNew}
                  style={{
                    padding: '6px 16px',
                    backgroundColor: '#337ab7',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Tambah Data
                </button>
              </div>
            </div>
            <div className="unified-header-right" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
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
                  {hotelOptions.map((hotel, index) => (
                    <option key={index} value={hotel.name || hotel}>
                      {hotel.name || hotel}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="header-row header-row-bottom">
            <div className="unified-header-left">
              <div className="search-section">
                <label>Search :</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="unified-header-right">
              <div className="entries-control">
                <span className="entries-label">Show</span>
                <select 
                  className="entries-select" 
                  value={showEntries} 
                  onChange={(e) => setShowEntries(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="entries-label">entries</span>
              </div>
            </div>
          </div>
        </div>

        <div className="unified-table-wrapper">
          <table className="reservation-table">
            <colgroup>
              <col style={{ width: '50px' }} />   {/* No */}
              <col style={{ width: '70px' }} />   {/* Room */}
              <col style={{ width: '80px' }} />   {/* Extra Bed */}
              <col style={{ width: '80px' }} />   {/* Extra Bill */}
              <col style={{ width: '90px' }} />   {/* Late Charge */}
              <col style={{ width: '80px' }} />   {/* Discount */}
              <col style={{ width: '100px' }} />  {/* Meeting Room */}
              <col style={{ width: '110px' }} />  {/* Add. Meeting Room */}
              <col style={{ width: '80px' }} />   {/* Cash */}
              <col style={{ width: '70px' }} />   {/* Debet */}
              <col style={{ width: '80px' }} />   {/* Transfer */}
              <col style={{ width: '80px' }} />   {/* Voucher */}
              <col style={{ width: '90px' }} />   {/* Creditcard */}
              <col style={{ width: '100px' }} />  {/* Guest Ledger - */}
              <col style={{ width: '100px' }} />  {/* Guest Ledger + */}
              <col style={{ width: '80px' }} />   {/* Action */}
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>Room</th>
                <th>Extra Bed</th>
                <th>Extra Bill</th>
                <th>Late Charge</th>
                <th>Discount</th>
                <th>Meeting Room</th>
                <th>Add. Meeting Room</th>
                <th>Cash</th>
                <th>Debet</th>
                <th>Transfer</th>
                <th>Voucher</th>
                <th>Creditcard</th>
                <th>Guest Ledger -</th>
                <th>Guest Ledger +</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="16" className="no-data">Loading...</td></tr>
              ) : currentData.length === 0 ? (
                <tr><td colSpan="16" className="no-data">No data available in table</td></tr>
              ) : (
                currentData.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{startIndex + index + 1}</td>
                    <td title={item.room_number || '-'}>{item.room_number || '-'}</td>
                    <td className="align-right">{formatCurrency(item.extra_bed)}</td>
                    <td className="align-right">{formatCurrency(item.extra_bill)}</td>
                    <td className="align-right">{formatCurrency(item.late_charge)}</td>
                    <td className="align-right">{formatCurrency(item.discount)}</td>
                    <td className="align-right">{formatCurrency(item.meeting_room)}</td>
                    <td className="align-right">{formatCurrency(item.add_meeting_room)}</td>
                    <td className="align-right">{formatCurrency(item.cash)}</td>
                    <td className="align-right">{formatCurrency(item.debet)}</td>
                    <td className="align-right">{formatCurrency(item.transfer)}</td>
                    <td className="align-right">{formatCurrency(item.voucher)}</td>
                    <td className="align-right">{formatCurrency(item.creditcard)}</td>
                    <td className="align-right">{formatCurrency(item.guest_ledger_minus)}</td>
                    <td className="align-right">{formatCurrency(item.guest_ledger_plus)}</td>
                    <td className="align-center">
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        <button 
                          className="btn-table-action"
                          title="Edit"
                          onClick={() => handleEdit(item)}
                          style={{ padding: '3px 8px', fontSize: '11px' }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-table-action"
                          title="Delete"
                          onClick={() => handleDelete(item)}
                          style={{ 
                            padding: '3px 8px', 
                            fontSize: '11px',
                            backgroundColor: '#dc3545',
                            borderColor: '#dc3545'
                          }}
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="unified-footer">
          <div className="entries-info">
            {`Showing ${filteredAudits.length > 0 ? startIndex + 1 : 0} to ${Math.min(endIndex, filteredAudits.length)} of ${filteredAudits.length} entries`}
          </div>
          <div className="pagination">
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</button>
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
              <div className="modal-header">
                <h3>{editingItem ? 'Edit Night Audit' : 'Add Night Audit'}</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={formData.audit_date}
                      onChange={(e) => handleFormChange('audit_date', e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Hotel</label>
                    <select
                      value={formData.hotel_name}
                      onChange={(e) => handleFormChange('hotel_name', e.target.value)}
                      className="form-control"
                    >
                      {hotelOptions.map((hotel, index) => (
                        <option key={index} value={hotel.name || hotel}>
                          {hotel.name || hotel}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Room Number *</label>
                    <input
                      type="text"
                      value={formData.room_number}
                      onChange={(e) => handleFormChange('room_number', e.target.value)}
                      className="form-control"
                      placeholder="Enter room number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Guest Name</label>
                    <input
                      type="text"
                      value={formData.guest_name}
                      onChange={(e) => handleFormChange('guest_name', e.target.value)}
                      className="form-control"
                      placeholder="Enter guest name"
                    />
                  </div>
                </div>

                <h4 style={{ marginTop: '20px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Revenue Items</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Extra Bed</label>
                    <input
                      type="number"
                      value={formData.extra_bed}
                      onChange={(e) => handleFormChange('extra_bed', parseFloat(e.target.value) || 0)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Extra Bill</label>
                    <input
                      type="number"
                      value={formData.extra_bill}
                      onChange={(e) => handleFormChange('extra_bill', parseFloat(e.target.value) || 0)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Late Charge</label>
                    <input
                      type="number"
                      value={formData.late_charge}
                      onChange={(e) => handleFormChange('late_charge', parseFloat(e.target.value) || 0)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Discount</label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => handleFormChange('discount', parseFloat(e.target.value) || 0)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Meeting Room</label>
                    <input
                      type="number"
                      value={formData.meeting_room}
                      onChange={(e) => handleFormChange('meeting_room', parseFloat(e.target.value) || 0)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Add. Meeting Room</label>
                    <input
                      type="number"
                      value={formData.add_meeting_room}
                      onChange={(e) => handleFormChange('add_meeting_room', parseFloat(e.target.value) || 0)}
                      className="form-control"
                    />
                  </div>
                </div>

                <h4 style={{ marginTop: '20px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Payment Methods</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Cash</label>
                    <input
                      type="number"
                      value={formData.cash}
                      onChange={(e) => handleFormChange('cash', parseFloat(e.target.value) || 0)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Debet</label>
                    <input
                      type="number"
                      value={formData.debet}
                      onChange={(e) => handleFormChange('debet', parseFloat(e.target.value) || 0)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Transfer</label>
                    <input
                      type="number"
                      value={formData.transfer}
                      onChange={(e) => handleFormChange('transfer', parseFloat(e.target.value) || 0)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Voucher</label>
                    <input
                      type="number"
                      value={formData.voucher}
                      onChange={(e) => handleFormChange('voucher', parseFloat(e.target.value) || 0)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Creditcard</label>
                    <input
                      type="number"
                      value={formData.creditcard}
                      onChange={(e) => handleFormChange('creditcard', parseFloat(e.target.value) || 0)}
                      className="form-control"
                    />
                  </div>
                </div>

                <h4 style={{ marginTop: '20px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Guest Ledger</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Guest Ledger - (Minus)</label>
                    <input
                      type="number"
                      value={formData.guest_ledger_minus}
                      onChange={(e) => handleFormChange('guest_ledger_minus', parseFloat(e.target.value) || 0)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Guest Ledger + (Plus)</label>
                    <input
                      type="number"
                      value={formData.guest_ledger_plus}
                      onChange={(e) => handleFormChange('guest_ledger_plus', parseFloat(e.target.value) || 0)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '15px' }}>
                  <label>Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
                    className="form-control"
                    rows="3"
                    placeholder="Enter notes..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleSave}
                  disabled={processing}
                >
                  {processing ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NightAudit;
