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
                        <button className="btn-table-action" title="Edit Details">Edit</button>
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
    </Layout>
  );
};

export default AllReservationPage;