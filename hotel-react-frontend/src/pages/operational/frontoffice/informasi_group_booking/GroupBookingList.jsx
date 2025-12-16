import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import Layout from '../../../../components/Layout';
import { useAuth } from '../../../../context/AuthContext';

const GroupBookingList = () => {
  const { user } = useAuth();
  const [groupBookings, setGroupBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    group_name: '',
    pic_name: '',
    pic_phone: '',
    check_in_date: '',
    check_out_date: '',
    total_rooms: '',
    payment_method: '',
    total_amount: '',
    notes: ''
  });
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchGroupBookings();
  }, []);

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

  // Filter data based on search
  const filteredBookings = groupBookings.filter(booking => 
    booking.group_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.pic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.pic_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.payment_method?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * showEntries;
  const indexOfFirstItem = indexOfLastItem - showEntries;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / showEntries);

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
      pic_name: booking.pic_name || '',
      pic_phone: booking.pic_phone || '',
      check_in_date: booking.check_in_date ? booking.check_in_date.split('T')[0] : '',
      check_out_date: booking.check_out_date ? booking.check_out_date.split('T')[0] : '',
      total_rooms: booking.total_rooms || '',
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
        pic_name: editFormData.pic_name,
        pic_phone: editFormData.pic_phone,
        check_in_date: editFormData.check_in_date,
        check_out_date: editFormData.check_out_date,
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
        {/* Header Controls */}
        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <h2 className="header-title">GROUP BOOKING LIST</h2>
            </div>
          </div>

          <div className="header-row header-row-bottom">
            <div className="unified-header-left">
              <div className="search-section">
                <label>Search:</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by group name, PIC, phone..."
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
                    <td>{booking.pic_name || 'N/A'}</td>
                    <td>{booking.pic_phone || 'N/A'}</td>
                    <td>{formatDate(booking.check_in_date)}</td>
                    <td>{formatDate(booking.check_out_date)}</td>
                    <td className="align-center">
                      {calculateNights(booking.check_in_date, booking.check_out_date)}
                    </td>
                    <td className="align-center">{booking.total_rooms || 0}</td>
                    <td>{booking.payment_method || 'N/A'}</td>
                    <td className="align-right">{formatCurrency(booking.total_amount)}</td>
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
                  value={editFormData.pic_name}
                  onChange={(e) => setEditFormData({...editFormData, pic_name: e.target.value})}
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
