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

const GroupBookingRooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    guest_name: '',
    room_number: '',
    room_type: '',
    mobile_phone: '',
    check_in_date: '',
    check_out_date: '',
    rate: '',
    room_status: '',
    notes: ''
  });
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchGroupBookingRooms();
  }, []);

  const fetchGroupBookingRooms = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGroupBookingRooms();
      console.log('Group Booking Rooms Response:', response.data);
      setRooms(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch group booking rooms: ' + (err.response?.data?.detail || err.message));
      console.error('Error fetching group booking rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    filteredItems: filteredRooms, currentData: currentRooms,
    totalPages, startIndex: indexOfFirstItem, endIndex: indexOfLastItem
  } = usePaginatedTable(rooms, {
    searchFields: ['group_name', 'guest_name', 'room_number', 'reservation_no', 'room_type', 'group_booking_id']
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

  // Check if user has edit permission
  const canEdit = () => {
    return ['admin', 'manager', 'frontoffice'].includes(user?.role);
  };

  const getStatusPill = (status) => {
    switch (status?.toLowerCase()) {
      case 'checked in': return 'status-pill--approved';
      case 'checked out': return 'status-pill--completed';
      case 'cancelled': return 'status-pill--rejected';
      case 'reserved': return 'status-pill--pending';
      default: return 'status-pill--default';
    }
  };

  // Handle edit click
  const handleEditClick = (room) => {
    if (!canEdit()) return;
    setEditingItem(room);
    setEditFormData({
      guest_name: room.guest_name || '',
      room_number: room.room_number || '',
      room_type: room.room_type || '',
      mobile_phone: room.mobile_phone || '',
      check_in_date: room.check_in_date ? room.check_in_date.split('T')[0] : '',
      check_out_date: room.check_out_date ? room.check_out_date.split('T')[0] : '',
      rate: room.rate || '',
      room_status: room.room_status || 'Reserved',
      notes: room.notes || ''
    });
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editFormData.guest_name) {
      alert('Guest name is required');
      return;
    }
    setProcessing(true);
    try {
      // Update via reservation API if reservation_no exists
      if (editingItem.reservation_no) {
        await apiService.updateHotelReservation(editingItem.reservation_id || editingItem.id, {
          guest_name: editFormData.guest_name,
          room_number: editFormData.room_number,
          mobile_phone: editFormData.mobile_phone,
          arrival_date: editFormData.check_in_date,
          departure_date: editFormData.check_out_date,
          notes: editFormData.notes
        });
      }
      setSuccessMessage('Room booking updated successfully!');
      setShowEditModal(false);
      setEditingItem(null);
      fetchGroupBookingRooms();
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
          title="GROUP BOOKING ROOMS"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by group, guest, room number..."
          showEntries={showEntries}
          onEntriesChange={setShowEntries}
        />

        {/* Table Section */}
        <DataTable
          data={currentRooms}
          loading={loading}
          error={error}
          emptyText="No group booking rooms found"
          rowKey={(r) => r.id}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '60px',
              render: (_r, i) => indexOfFirstItem + i + 1 },
            { key: 'group_id', header: 'Group ID',
              render: (r) => <span style={{ fontWeight: 500 }}>{r.group_booking_id || 'N/A'}</span> },
            { key: 'group_name', header: 'Group Name',
              render: (r) => <span style={{ fontWeight: 500 }}>{r.group_name || 'N/A'}</span> },
            { key: 'res_no', header: 'Reservation No', render: (r) => r.reservation_no || 'N/A' },
            { key: 'room_no', header: 'Room Number', align: 'center', render: (r) => r.room_number || 'N/A' },
            { key: 'room_type', header: 'Room Type', render: (r) => r.room_type || 'N/A' },
            { key: 'guest', header: 'Guest Name', render: (r) => r.guest_name || 'N/A' },
            { key: 'phone', header: 'Mobile Phone', render: (r) => r.mobile_phone || 'N/A' },
            { key: 'checkin', header: 'Check In', render: (r) => formatDate(r.check_in_date) },
            { key: 'checkout', header: 'Check Out', render: (r) => formatDate(r.check_out_date) },
            { key: 'nights', header: 'Nights', align: 'center', render: (r) => r.nights || 0 },
            { key: 'guests', header: 'Guests', align: 'center',
              render: (r) => `M:${r.guest_count_male || 0} F:${r.guest_count_female || 0} C:${r.guest_count_child || 0}` },
            { key: 'rate', header: 'Rate', align: 'right', render: (r) => formatCurrencyIDRSymbol(r.rate) },
            { key: 'subtotal', header: 'Subtotal', align: 'right', render: (r) => formatCurrencyIDRSymbol(r.subtotal) },
            { key: 'status', header: 'Status', align: 'center',
              render: (r) => <span className={`status-pill ${getStatusPill(r.room_status)}`}>{r.room_status || 'Reserved'}</span> },
            ...(canEdit() ? [{
              key: 'action', header: 'Action', align: 'center', width: '100px',
              render: (r) => <Button variant="ghost" size="sm" onClick={() => handleEditClick(r)}>Edit</Button>
            }] : [])
          ]}
        />

        <UnifiedTableFooter
          startIndex={indexOfFirstItem}
          endIndex={indexOfLastItem}
          total={filteredRooms.length}
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
              Edit Room Booking: {editingItem.reservation_no || editingItem.id}
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Guest Name *</label>
              <input
                type="text"
                value={editFormData.guest_name}
                onChange={(e) => setEditFormData({...editFormData, guest_name: e.target.value})}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">Room Number</label>
                <input
                  type="text"
                  value={editFormData.room_number}
                  onChange={(e) => setEditFormData({...editFormData, room_number: e.target.value})}
                  className="form-input"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Room Type</label>
                <input
                  type="text"
                  value={editFormData.room_type}
                  onChange={(e) => setEditFormData({...editFormData, room_type: e.target.value})}
                  className="form-input"
                  disabled
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Mobile Phone</label>
              <input
                type="text"
                value={editFormData.mobile_phone}
                onChange={(e) => setEditFormData({...editFormData, mobile_phone: e.target.value})}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">Check-in Date</label>
                <input
                  type="date"
                  value={editFormData.check_in_date}
                  onChange={(e) => setEditFormData({...editFormData, check_in_date: e.target.value})}
                  className="form-input"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Check-out Date</label>
                <input
                  type="date"
                  value={editFormData.check_out_date}
                  onChange={(e) => setEditFormData({...editFormData, check_out_date: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">Rate</label>
                <input
                  type="number"
                  value={editFormData.rate}
                  onChange={(e) => setEditFormData({...editFormData, rate: e.target.value})}
                  className="form-input"
                  disabled
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Status</label>
                <select
                  value={editFormData.room_status}
                  onChange={(e) => setEditFormData({...editFormData, room_status: e.target.value})}
                  className="form-input"
                >
                  <option value="Reserved">Reserved</option>
                  <option value="Checked In">Checked In</option>
                  <option value="Checked Out">Checked Out</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
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

export default GroupBookingRooms;
