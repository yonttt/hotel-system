import { useState, useEffect } from 'react';
import { apiService } from '../../../../api/api';
import Layout from '../../../../ui/Layout';
import UnifiedTableHeader from '../../../../ui/UnifiedTableHeader';
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
        <div className="unified-table-wrapper">
          <table className="reservation-table">
            <colgroup>
              <col style={{ width: '60px' }} />   {/* No */}
              <col style={{ width: '100px' }} />  {/* Group ID */}
              <col style={{ width: '180px' }} />  {/* Group Name */}
              <col style={{ width: '150px' }} />  {/* PIC Name */}
              <col style={{ width: '120px' }} />  {/* Phone */}
              <col style={{ width: '110px' }} />  {/* Check-in */}
              <col style={{ width: '110px' }} />  {/* Check-out */}
              <col style={{ width: '80px' }} />   {/* Nights */}
              <col style={{ width: '80px' }} />   {/* Rooms */}
              <col style={{ width: '140px' }} />  {/* Payment Method */}
              <col style={{ width: '130px' }} />  {/* Total Amount */}
              <col style={{ width: '110px' }} />  {/* Booking Date */}
              <col style={{ width: '100px' }} />  {/* Action */}
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>Group ID</th>
                <th>Group Name</th>
                <th>PIC Name</th>
                <th>Phone</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Nights</th>
                <th>Rooms</th>
                <th>Payment Method</th>
                <th className="align-right">Total Amount</th>
                <th>Booking Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="13" className="no-data">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="13" className="no-data">{error}</td>
                </tr>
              ) : currentBookings.length === 0 ? (
                <tr>
                  <td colSpan="13" className="no-data">No group bookings found</td>
                </tr>
              ) : (
                currentBookings.map((booking, index) => (
                  <tr key={booking.id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td style={{ fontWeight: '500' }}>GB-{booking.id}</td>
                    <td style={{ fontWeight: '500' }}>{booking.group_name || 'N/A'}</td>
                    <td>{booking.group_pic || 'N/A'}</td>
                    <td>{booking.pic_phone || 'N/A'}</td>
                    <td>{formatDate(booking.arrival_date)}</td>
                    <td>{formatDate(booking.departure_date)}</td>
                    <td className="align-center">
                      {calculateNights(booking.arrival_date, booking.departure_date)}
                    </td>
                    <td className="align-center">{booking.total_rooms || 0}</td>
                    <td>{booking.payment_method || 'N/A'}</td>
                    <td className="align-right">{formatCurrencyIDRSymbol(booking.total_amount)}</td>
                    <td>{formatDate(booking.created_at)}</td>
                    <td className="align-center">
                      {canEdit() && (
                        <button className="btn-table-action" title="Edit Details" onClick={() => handleEditClick(booking)}>Edit</button>
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
            {`Showing ${filteredBookings.length > 0 ? indexOfFirstItem + 1 : 0} to ${Math.min(indexOfLastItem, filteredBookings.length)} of ${filteredBookings.length} entries`}
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
              Edit Group Booking: GB-{editingItem.id}
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Group Name *</label>
              <input
                type="text"
                value={editFormData.group_name}
                onChange={(e) => setEditFormData({...editFormData, group_name: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>PIC Name</label>
                <input
                  type="text"
                  value={editFormData.group_pic}
                  onChange={(e) => setEditFormData({...editFormData, group_pic: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>PIC Phone</label>
                <input
                  type="text"
                  value={editFormData.pic_phone}
                  onChange={(e) => setEditFormData({...editFormData, pic_phone: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Arrival Date</label>
                <input
                  type="date"
                  value={editFormData.arrival_date}
                  onChange={(e) => setEditFormData({...editFormData, arrival_date: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Departure Date</label>
                <input
                  type="date"
                  value={editFormData.departure_date}
                  onChange={(e) => setEditFormData({...editFormData, departure_date: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Arrival Time</label>
                <input
                  type="text"
                  value={editFormData.arrival_time}
                  onChange={(e) => setEditFormData({...editFormData, arrival_time: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}
                  readOnly
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Market Segment</label>
                <select
                  value={editFormData.market_segment}
                  onChange={(e) => setEditFormData({...editFormData, market_segment: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white' }}
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Total Rooms</label>
                <input
                  type="number"
                  value={editFormData.total_rooms}
                  onChange={(e) => setEditFormData({...editFormData, total_rooms: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Payment Method</label>
                <input
                  type="text"
                  value={editFormData.payment_method}
                  onChange={(e) => setEditFormData({...editFormData, payment_method: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Total Amount</label>
              <input
                type="number"
                value={editFormData.total_amount}
                onChange={(e) => setEditFormData({...editFormData, total_amount: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
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

export default GroupBookingList;
