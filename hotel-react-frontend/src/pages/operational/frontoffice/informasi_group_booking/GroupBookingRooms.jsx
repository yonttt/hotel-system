import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import Layout from '../../../../components/Layout';
import { useAuth } from '../../../../context/AuthContext';

const GroupBookingRooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filter data based on search
  const filteredRooms = rooms.filter(room => 
    room.group_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.reservation_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.room_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.group_booking_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * showEntries;
  const indexOfFirstItem = indexOfLastItem - showEntries;
  const currentRooms = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRooms.length / showEntries);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Check if user has edit permission
  const canEdit = () => {
    return ['admin', 'manager', 'frontoffice'].includes(user?.role);
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
        {/* Header Controls */}
        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <h2 className="header-title">GROUP BOOKING ROOMS</h2>
            </div>
          </div>

          <div className="header-row header-row-bottom">
            <div className="unified-header-left">
              <div className="search-section">
                <label>Search:</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by group, guest, room number..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div className="unified-header-right">
              <div className="entries-control">
                <span className="entries-label">Show entries:</span>
                <select
                  className="entries-select"
                  value={showEntries}
                  onChange={(e) => {
                    setShowEntries(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="unified-table-wrapper">
          <table className="reservation-table">
            <colgroup>
              <col style={{ width: '60px' }} />   {/* No */}
              <col style={{ width: '120px' }} />  {/* Group ID */}
              <col style={{ width: '180px' }} />  {/* Group Name */}
              <col style={{ width: '110px' }} />  {/* Reservation No */}
              <col style={{ width: '100px' }} />  {/* Room Number */}
              <col style={{ width: '130px' }} />  {/* Room Type */}
              <col style={{ width: '180px' }} />  {/* Guest Name */}
              <col style={{ width: '130px' }} />  {/* Mobile Phone */}
              <col style={{ width: '110px' }} />  {/* Check In */}
              <col style={{ width: '110px' }} />  {/* Check Out */}
              <col style={{ width: '80px' }} />   {/* Nights */}
              <col style={{ width: '100px' }} />  {/* Guests */}
              <col style={{ width: '130px' }} />  {/* Rate */}
              <col style={{ width: '130px' }} />  {/* Subtotal */}
              <col style={{ width: '110px' }} />  {/* Status */}
              <col style={{ width: '100px' }} />  {/* Action */}
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>Group ID</th>
                <th>Group Name</th>
                <th>Reservation No</th>
                <th>Room Number</th>
                <th>Room Type</th>
                <th>Guest Name</th>
                <th>Mobile Phone</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Nights</th>
                <th>Guests</th>
                <th className="align-right">Rate</th>
                <th className="align-right">Subtotal</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="16" className="no-data">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="16" className="no-data">{error}</td>
                </tr>
              ) : currentRooms.length === 0 ? (
                <tr>
                  <td colSpan="16" className="no-data">No group booking rooms found</td>
                </tr>
              ) : (
                currentRooms.map((room, index) => (
                  <tr key={room.id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td style={{ fontWeight: '500' }}>{room.group_booking_id || 'N/A'}</td>
                    <td style={{ fontWeight: '500' }}>{room.group_name || 'N/A'}</td>
                    <td>{room.reservation_no || 'N/A'}</td>
                    <td className="align-center">{room.room_number || 'N/A'}</td>
                    <td>{room.room_type || 'N/A'}</td>
                    <td>{room.guest_name || 'N/A'}</td>
                    <td>{room.mobile_phone || 'N/A'}</td>
                    <td>{formatDate(room.check_in_date)}</td>
                    <td>{formatDate(room.check_out_date)}</td>
                    <td className="align-center">{room.nights || 0}</td>
                    <td className="align-center">
                      M:{room.guest_count_male || 0} F:{room.guest_count_female || 0} C:{room.guest_count_child || 0}
                    </td>
                    <td className="align-right">{formatCurrency(room.rate)}</td>
                    <td className="align-right">{formatCurrency(room.subtotal)}</td>
                    <td>
                      <span className={`status-badge status-${room.room_status?.toLowerCase().replace(' ', '-')}`}>
                        {room.room_status || 'Reserved'}
                      </span>
                    </td>
                    <td className="align-center">
                      {canEdit() && (
                        <button className="btn-table-action" title="Edit Details" onClick={() => handleEditClick(room)}>Edit</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="unified-footer">
          <div className="entries-info">
            {`Showing ${filteredRooms.length > 0 ? indexOfFirstItem + 1 : 0} to ${Math.min(indexOfLastItem, filteredRooms.length)} of ${filteredRooms.length} entries`}
          </div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum ? 'active' : ''}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <span key={pageNum}>...</span>;
              }
              return null;
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
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
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '25px',
            width: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              Edit Room Booking: {editingItem.reservation_no || editingItem.id}
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Guest Name *</label>
              <input
                type="text"
                value={editFormData.guest_name}
                onChange={(e) => setEditFormData({...editFormData, guest_name: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Room Number</label>
                <input
                  type="text"
                  value={editFormData.room_number}
                  onChange={(e) => setEditFormData({...editFormData, room_number: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Room Type</label>
                <input
                  type="text"
                  value={editFormData.room_type}
                  onChange={(e) => setEditFormData({...editFormData, room_type: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  disabled
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mobile Phone</label>
              <input
                type="text"
                value={editFormData.mobile_phone}
                onChange={(e) => setEditFormData({...editFormData, mobile_phone: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Check-in Date</label>
                <input
                  type="date"
                  value={editFormData.check_in_date}
                  onChange={(e) => setEditFormData({...editFormData, check_in_date: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Check-out Date</label>
                <input
                  type="date"
                  value={editFormData.check_out_date}
                  onChange={(e) => setEditFormData({...editFormData, check_out_date: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rate</label>
                <input
                  type="number"
                  value={editFormData.rate}
                  onChange={(e) => setEditFormData({...editFormData, rate: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  disabled
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
                <select
                  value={editFormData.room_status}
                  onChange={(e) => setEditFormData({...editFormData, room_status: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="Reserved">Reserved</option>
                  <option value="Checked In">Checked In</option>
                  <option value="Checked Out">Checked Out</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Notes</label>
              <textarea
                value={editFormData.notes}
                onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '8px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={processing}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.7 : 1
                }}
              >
                {processing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default GroupBookingRooms;
