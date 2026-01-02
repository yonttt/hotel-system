import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';

const CheckOutToday = () => {
  const { user } = useAuth();
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntries, setShowEntries] = useState(100);
  const [successMessage, setSuccessMessage] = useState(null);

  // Master data
  const [hotelOptions, setHotelOptions] = useState([]);

  // Checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchMasterData();
    fetchCheckoutData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showEntries, selectedHotel]);

  const fetchMasterData = async () => {
    try {
      const hotelResponse = await apiService.getHotels();
      setHotelOptions(hotelResponse.data || []);
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCheckoutToday();
      setCheckouts(response.data || []);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setCheckouts([]);
        setError(null);
      } else {
        setError('Failed to fetch checkout data: ' + (err.response?.data?.detail || err.message));
        console.error('Error fetching checkout data:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter checkouts
  const filteredCheckouts = checkouts.filter(item => {
    // Filter by hotel
    if (selectedHotel !== 'ALL' && item.hotel_name !== selectedHotel) {
      return false;
    }
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        item.guest_name?.toLowerCase().includes(search) ||
        item.room_number?.toLowerCase().includes(search) ||
        item.market_segment?.toLowerCase().includes(search) ||
        String(item.registration_no).includes(search)
      );
    }
    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCheckouts.length / showEntries));
  const startIndex = (currentPage - 1) * showEntries;
  const endIndex = startIndex + showEntries;
  const currentData = filteredCheckouts.slice(startIndex, endIndex);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '0.0000';
    return parseFloat(amount).toFixed(4);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  };

  // Calculate balance
  const calculateBalance = (totalCharge, totalDeposit) => {
    const charge = parseFloat(totalCharge || 0);
    const deposit = parseFloat(totalDeposit || 0);
    return charge - deposit;
  };

  // Handle checkout action
  const handleCheckout = (guest) => {
    setSelectedGuest(guest);
    setShowCheckoutModal(true);
  };

  const processCheckout = async () => {
    if (!selectedGuest) return;
    
    setProcessing(true);
    try {
      await apiService.processCheckout(selectedGuest.id);
      setSuccessMessage(`Successfully checked out ${selectedGuest.guest_name}`);
      setShowCheckoutModal(false);
      setSelectedGuest(null);
      fetchCheckoutData();
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to process checkout: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
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
              <div className="header-title">
                <span>CHECK OUT TODAY</span>
              </div>
            </div>
            <div className="unified-header-right">
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

        <div className="unified-table-wrapper">
          <table className="reservation-table">
            <colgroup>
              <col style={{ width: '60px' }} />   {/* No */}
              <col style={{ width: '180px' }} />  {/* Name */}
              <col style={{ width: '120px' }} />  {/* Market */}
              <col style={{ width: '80px' }} />   {/* Nights */}
              <col style={{ width: '110px' }} />  {/* Booking Date */}
              <col style={{ width: '100px' }} />  {/* Type */}
              <col style={{ width: '80px' }} />   {/* Room */}
              <col style={{ width: '110px' }} />  {/* Arrival Date */}
              <col style={{ width: '110px' }} />  {/* Departure Date */}
              <col style={{ width: '120px' }} />  {/* Total Charge */}
              <col style={{ width: '120px' }} />  {/* Total Deposit */}
              <col style={{ width: '100px' }} />  {/* Balance */}
              <col style={{ width: '120px' }} />  {/* C/O By */}
              <col style={{ width: '100px' }} />  {/* Action */}
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Market</th>
                <th>Nights</th>
                <th>Booking Date</th>
                <th>Type</th>
                <th>Room</th>
                <th>Arrival Date</th>
                <th>Departure Date</th>
                <th>Total Charge</th>
                <th>Total Deposit</th>
                <th>Balance</th>
                <th>C/O By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="14" className="no-data">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="14" className="no-data">{error}</td></tr>
              ) : currentData.length === 0 ? (
                <tr><td colSpan="14" className="no-data">No data available in table</td></tr>
              ) : (
                currentData.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{startIndex + index + 1}</td>
                    <td title={item.guest_name || 'N/A'}>{item.guest_name || 'N/A'}</td>
                    <td title={item.market_segment || 'N/A'}>{item.market_segment || 'N/A'}</td>
                    <td className="align-center">{item.nights || 0}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td title={item.guest_type || 'N/A'}>{item.guest_type || 'N/A'}</td>
                    <td className="align-center" title={item.room_number || 'N/A'}>{item.room_number || '-'}</td>
                    <td>{formatDate(item.arrival_date)}</td>
                    <td>{formatDate(item.departure_date)}</td>
                    <td className="align-right">{formatCurrency(item.payment_amount || 0)}</td>
                    <td className="align-right">{formatCurrency(item.deposit || 0)}</td>
                    <td className="align-right">{formatCurrency(calculateBalance(item.payment_amount, item.deposit))}</td>
                    <td title={item.transaction_by || '-'}>{item.transaction_by || '-'}</td>
                    <td className="align-center">
                      <button 
                        className="btn-table-action btn-checkout" 
                        title="Process Check Out"
                        onClick={() => handleCheckout(item)}
                      >
                        Check Out
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="unified-footer">
          <div className="entries-info">
            {`Showing ${filteredCheckouts.length > 0 ? startIndex + 1 : 0} to ${Math.min(endIndex, filteredCheckouts.length)} of ${filteredCheckouts.length} entries`}
          </div>
          <div className="pagination">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First</button>
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</button>
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
          </div>
        </div>

        {/* Checkout Confirmation Modal */}
        {showCheckoutModal && selectedGuest && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
              <div className="modal-header">
                <h3>Confirm Check Out</h3>
                <button className="modal-close" onClick={() => {
                  setShowCheckoutModal(false);
                  setSelectedGuest(null);
                }}>×</button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to check out the following guest?</p>
                <div style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '15px', 
                  borderRadius: '4px',
                  marginTop: '15px'
                }}>
                  <p style={{ margin: '5px 0' }}><strong>Name:</strong> {selectedGuest.guest_name}</p>
                  <p style={{ margin: '5px 0' }}><strong>Room:</strong> {selectedGuest.room_number}</p>
                  <p style={{ margin: '5px 0' }}><strong>Total Charge:</strong> Rp {formatCurrency(selectedGuest.payment_amount)}</p>
                  <p style={{ margin: '5px 0' }}><strong>Deposit:</strong> Rp {formatCurrency(selectedGuest.deposit)}</p>
                  <p style={{ margin: '5px 0' }}><strong>Balance:</strong> Rp {formatCurrency(calculateBalance(selectedGuest.payment_amount, selectedGuest.deposit))}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowCheckoutModal(false);
                    setSelectedGuest(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary btn-checkout"
                  onClick={processCheckout}
                  disabled={processing}
                  style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                >
                  {processing ? 'Processing...' : 'Confirm Check Out'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .btn-checkout {
          background-color: #28a745 !important;
          border-color: #28a745 !important;
          color: white !important;
        }
        .btn-checkout:hover {
          background-color: #218838 !important;
          border-color: #1e7e34 !important;
        }
      `}</style>
    </Layout>
  );
};

export default CheckOutToday;
