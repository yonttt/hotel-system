import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { apiService } from '../../../../services/api';
import Layout from '../../../../components/Layout';

const AllReservationPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
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
    market_segment: '',
    arrival_date: '',
    departure_date: '',
    transaction_by: '',
    payment_method: '',
    deposit: '',
    notes: ''
  });
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showEntries]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getHotelReservations(0, 100);
      setReservations(response.data || []);
    } catch (err) {
      console.error('Error loading reservations:', err);
      setError('Failed to load reservations data from database');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredReservations = reservations.filter(reservation =>
    reservation.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.reservation_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.market_segment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.transaction_by?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredReservations.length / showEntries));
  const startIndex = (currentPage - 1) * showEntries;
  const endIndex = startIndex + showEntries;
  const currentReservations = filteredReservations.slice(startIndex, endIndex);

  const formatCurrency = (amount) => {
    // Format to match the image - just numbers without currency symbol
    if (!amount || amount === 0) return '0.0000';
    return parseFloat(amount).toFixed(4);
  };

  const formatDate = (dateString) => {
    // A simple date format as shown in the image
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  };

  // Check if user has edit permission
  const canEdit = () => {
    return ['admin', 'manager', 'frontoffice'].includes(user?.role);
  };

  // Handle edit click
  const handleEditClick = (reservation) => {
    if (!canEdit()) return;
    setEditingItem(reservation);
    setEditFormData({
      guest_name: reservation.guest_name || '',
      market_segment: reservation.market_segment || '',
      arrival_date: reservation.arrival_date ? reservation.arrival_date.split('T')[0] : '',
      departure_date: reservation.departure_date ? reservation.departure_date.split('T')[0] : '',
      transaction_by: reservation.transaction_by || '',
      payment_method: reservation.payment_method || '',
      deposit: reservation.deposit || '',
      notes: reservation.notes || ''
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
      await apiService.updateHotelReservation(editingItem.id, {
        guest_name: editFormData.guest_name,
        market_segment: editFormData.market_segment,
        arrival_date: editFormData.arrival_date,
        departure_date: editFormData.departure_date,
        transaction_by: editFormData.transaction_by,
        payment_method: editFormData.payment_method,
        deposit: parseFloat(editFormData.deposit) || 0,
        notes: editFormData.notes
      });
      setSuccessMessage('Reservation updated successfully!');
      setShowEditModal(false);
      setEditingItem(null);
      loadReservations();
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

  if (loading && reservations.length === 0) {
    return (
      <Layout>
        <div className="unified-reservation-container">
          <div className="loading-spinner">Loading reservation data...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="unified-reservation-container">
          <div className="error-message">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="unified-reservation-container">
        {/* Header: top row (title + hotel), bottom row (search left, entries right) */}
        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <div className="header-title">
                <span>ALL RESERVATION LIST</span>
              </div>
            </div>
            <div className="unified-header-right">
              <div className="hotel-select">
                <label>Hotel :</label>
                <select className="header-hotel-select">
                  <option>ALL</option>
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
                <span className="entries-label">Show entries:</span>
                <select
                  className="entries-select"
                  value={showEntries}
                  onChange={(e) => setShowEntries(Number(e.target.value))}
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
              <col style={{ width: '180px' }} />  {/* Name */}
              <col style={{ width: '120px' }} />  {/* Market */}
              <col style={{ width: '140px' }} />  {/* Booking */}
              <col style={{ width: '110px' }} />  {/* Arrival */}
              <col style={{ width: '110px' }} />  {/* Departure */}
              <col style={{ width: '130px' }} />  {/* Reserved By */}
              <col style={{ width: '130px' }} />  {/* Deposit By */}
              <col style={{ width: '100px' }} />  {/* Deposit */}
              <col style={{ width: '80px' }} />   {/* Guest */}
              <col style={{ width: '100px' }} />  {/* Action */}
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Market</th>
                <th>Booking</th>
                <th>Arrival</th>
                <th>Departure</th>
                <th>Reserved By</th>
                <th>Deposit By</th>
                <th>Deposit</th>
                <th>Guest</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" className="no-data">Loading...</td>
                </tr>
              ) : currentReservations.length === 0 ? (
                <tr>
                  <td colSpan="11" className="no-data">
                    No data available in table
                  </td>
                </tr>
              ) : (
                 currentReservations.map((reservation, index) => (
                  <tr key={reservation.id}>
                    <td>{startIndex + index + 1}</td>
                    <td title={reservation.guest_name || 'N/A'}>{reservation.guest_name || 'N/A'}</td>
                    <td title={reservation.market_segment || 'N/A'}>{reservation.market_segment || 'N/A'}</td>
                    <td className="mono" title={reservation.reservation_no || 'N/A'}>{reservation.reservation_no || 'N/A'}</td>
                    <td>{formatDate(reservation.arrival_date)}</td>
                    <td>{formatDate(reservation.departure_date)}</td>
                    <td title={reservation.transaction_by || 'N/A'}>{reservation.transaction_by || 'N/A'}</td>
                    <td title={reservation.payment_method || 'N/A'}>{reservation.payment_method || 'N/A'}</td>
                    <td className="align-right">{formatCurrency(reservation.deposit || 0)}</td>
                    <td className="align-center">{(reservation.guest_count_male || 0) + (reservation.guest_count_female || 0) + (reservation.guest_count_child || 0)}</td>
                    <td className="align-center">
                      {canEdit() && (
                        <button className="btn-table-action" title="Edit Details" onClick={() => handleEditClick(reservation)}>Edit</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="unified-footer">
          <div className="entries-info">
            {`Showing ${filteredReservations.length > 0 ? startIndex + 1 : 0} to ${Math.min(endIndex, filteredReservations.length)} of ${filteredReservations.length} entries`}
          </div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || filteredReservations.length === 0}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || filteredReservations.length === 0}
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
              Edit Reservation: {editingItem.reservation_no}
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

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Market Segment</label>
              <input
                type="text"
                value={editFormData.market_segment}
                onChange={(e) => setEditFormData({...editFormData, market_segment: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Reserved By</label>
                <input
                  type="text"
                  value={editFormData.transaction_by}
                  onChange={(e) => setEditFormData({...editFormData, transaction_by: e.target.value})}
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
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Deposit</label>
              <input
                type="number"
                value={editFormData.deposit}
                onChange={(e) => setEditFormData({...editFormData, deposit: e.target.value})}
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

export default AllReservationPage;