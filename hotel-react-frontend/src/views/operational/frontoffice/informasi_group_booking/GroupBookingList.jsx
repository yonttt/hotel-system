import { useState, useEffect } from 'react';
import { apiService } from '../../../../api/api';
import Layout from '../../../../ui/Layout';
import Button from '../../../../ui/Button';
import DataTable from '../../../../ui/DataTable';
import UnifiedTableHeader from '../../../../ui/UnifiedTableHeader';
import UnifiedTableFooter from '../../../../ui/UnifiedTableFooter';
import { useAuth } from '../../../../state/AuthContext';
import usePaginatedTable from '../../../../logic/usePaginatedTable';
import { formatCurrencyIDRSymbol } from '../../../../utils/formatters';

const GroupBookingList = () => {
  const { user } = useAuth();
  const [groupBookings, setGroupBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    group_name: '',
    group_pic: '',
    pic_phone: '',
    arrival_date: '',
    arrival_time: '',
    departure_date: '',
    total_rooms: '',
    market_segment: '',
    payment_method: '',
    total_amount: '',
    notes: ''
  });
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [marketSegments, setMarketSegments] = useState([]);

  useEffect(() => {
    fetchGroupBookings();
    fetchMarketSegments();
  }, []);

  const fetchMarketSegments = async () => {
    try {
      const response = await apiService.getMarketSegments();
      setMarketSegments(response.data?.data || response.data || []);
    } catch (err) {
      console.error('Error fetching market segments:', err);
    }
  };

  const fetchGroupBookings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGroupBookings();
      console.log('Group Bookings Response:', response.data);
      setGroupBookings(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch group bookings: ' + (err.response?.data?.detail || err.message));
      console.error('Error fetching group bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    filteredItems: filteredBookings, currentData: currentBookings,
    totalPages, startIndex: indexOfFirstItem, endIndex: indexOfLastItem
  } = usePaginatedTable(groupBookings, {
    searchFields: ['group_name', 'group_pic', 'pic_phone', 'payment_method']
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Check if user has edit permission
  const canEdit = () => {
    return ['admin', 'manager', 'frontoffice'].includes(user?.role);
  };

  // Handle edit click
  const handleEditClick = (booking) => {
    if (!canEdit()) return;
    setEditingItem(booking);
    setEditFormData({
      group_name: booking.group_name || '',
      group_pic: booking.group_pic || '',
      pic_phone: booking.pic_phone || '',
      arrival_date: booking.arrival_date ? booking.arrival_date.split('T')[0] : '',
      arrival_time: booking.arrival_time || '',
      departure_date: booking.departure_date ? booking.departure_date.split('T')[0] : '',
      total_rooms: booking.total_rooms || '',
      market_segment: booking.market_segment || 'Normal',
      payment_method: booking.payment_method || '',
      total_amount: booking.total_amount || '',
      notes: booking.notes || ''
    });
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editFormData.group_name) {
      alert('Group name is required');
      return;
    }
    setProcessing(true);
    try {
      await apiService.updateGroupBooking(editingItem.id, {
        group_name: editFormData.group_name,
        group_pic: editFormData.group_pic,
        pic_phone: editFormData.pic_phone,
        arrival_date: editFormData.arrival_date,
        arrival_time: editFormData.arrival_time,
        departure_date: editFormData.departure_date,
        market_segment: editFormData.market_segment,
        total_rooms: parseInt(editFormData.total_rooms) || 0,
        payment_method: editFormData.payment_method,
        total_amount: parseFloat(editFormData.total_amount) || 0,
        notes: editFormData.notes
      });
      setSuccessMessage('Group booking updated successfully!');
      setShowEditModal(false);
      setEditingItem(null);
      fetchGroupBookings();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to update: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
        <UnifiedTableHeader
          title="GROUP BOOKING LIST"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by group name, PIC, phone..."
          showEntries={showEntries}
          onEntriesChange={setShowEntries}
        />

        {/* Table Section */}
        <DataTable
          data={currentBookings}
          loading={loading}
          error={error}
          emptyText="No group bookings found"
          rowKey={(b) => b.id}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '60px',
              render: (_b, i) => indexOfFirstItem + i + 1 },
            { key: 'group_id', header: 'Group ID',
              render: (b) => <span style={{ fontWeight: 500 }}>GB-{b.id}</span> },
            { key: 'group_name', header: 'Group Name',
              render: (b) => <span style={{ fontWeight: 500 }}>{b.group_name || 'N/A'}</span> },
            { key: 'pic', header: 'PIC Name', render: (b) => b.group_pic || 'N/A' },
            { key: 'phone', header: 'Phone', render: (b) => b.pic_phone || 'N/A' },
            { key: 'checkin', header: 'Check-in', render: (b) => formatDate(b.arrival_date) },
            { key: 'checkout', header: 'Check-out', render: (b) => formatDate(b.departure_date) },
            { key: 'nights', header: 'Nights', align: 'center',
              render: (b) => calculateNights(b.arrival_date, b.departure_date) },
            { key: 'rooms', header: 'Rooms', align: 'center', render: (b) => b.total_rooms || 0 },
            { key: 'payment', header: 'Payment Method', render: (b) => b.payment_method || 'N/A' },
            { key: 'total', header: 'Total Amount', align: 'right', render: (b) => formatCurrencyIDRSymbol(b.total_amount) },
            { key: 'booking_date', header: 'Booking Date', render: (b) => formatDate(b.created_at) },
            ...(canEdit() ? [{
              key: 'action', header: 'Action', align: 'center', width: '100px',
              render: (b) => <Button variant="ghost" size="sm" onClick={() => handleEditClick(b)}>Edit</Button>
            }] : [])
          ]}
        />

        <UnifiedTableFooter
          startIndex={indexOfFirstItem}
          endIndex={indexOfLastItem}
          total={filteredBookings.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showPageNumbers
          pageWindowSize={5}
        />
      </div>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '4px',
          zIndex: 1001,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          {successMessage}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="app-modal-overlay">
          <div className="app-modal-card" style={{ maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              Edit Group Booking: GB-{editingItem.id}
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Group Name *</label>
              <input
                type="text"
                value={editFormData.group_name}
                onChange={(e) => setEditFormData({...editFormData, group_name: e.target.value})}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">PIC Name</label>
                <input
                  type="text"
                  value={editFormData.group_pic}
                  onChange={(e) => setEditFormData({...editFormData, group_pic: e.target.value})}
                  className="form-input"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">PIC Phone</label>
                <input
                  type="text"
                  value={editFormData.pic_phone}
                  onChange={(e) => setEditFormData({...editFormData, pic_phone: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">Arrival Date</label>
                <input
                  type="date"
                  value={editFormData.arrival_date}
                  onChange={(e) => setEditFormData({...editFormData, arrival_date: e.target.value})}
                  className="form-input"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Departure Date</label>
                <input
                  type="date"
                  value={editFormData.departure_date}
                  onChange={(e) => setEditFormData({...editFormData, departure_date: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">Arrival Time</label>
                <input
                  type="text"
                  value={editFormData.arrival_time}
                  onChange={(e) => setEditFormData({...editFormData, arrival_time: e.target.value})}
                  className="form-input"
                  readOnly
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Market Segment</label>
                <select
                  value={editFormData.market_segment}
                  onChange={(e) => setEditFormData({...editFormData, market_segment: e.target.value})}
                  className="form-input"
                >
                  <option value="Normal">Normal</option>
                  {marketSegments.map(segment => (
                    <option key={segment.id || segment.name} value={segment.name}>
                      {segment.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">Total Rooms</label>
                <input
                  type="number"
                  value={editFormData.total_rooms}
                  onChange={(e) => setEditFormData({...editFormData, total_rooms: e.target.value})}
                  className="form-input"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Payment Method</label>
                <input
                  type="text"
                  value={editFormData.payment_method}
                  onChange={(e) => setEditFormData({...editFormData, payment_method: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Total Amount</label>
              <input
                type="number"
                value={editFormData.total_amount}
                onChange={(e) => setEditFormData({...editFormData, total_amount: e.target.value})}
                className="form-input"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="field-label">Notes</label>
              <textarea
                value={editFormData.notes}
                onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                className="form-input"
                style={{ minHeight: '60px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
              <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="success" onClick={handleSaveEdit} disabled={processing}>
                {processing ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default GroupBookingList;
