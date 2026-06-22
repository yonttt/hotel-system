import { useState, useEffect } from 'react';
import { apiService } from '../../../api/api';
import Layout from '../../../ui/Layout';
import UnifiedTableHeader from '../../../ui/UnifiedTableHeader';
import UnifiedTableFooter from '../../../ui/UnifiedTableFooter';
import { useAuth } from '../../../state/AuthContext';
import useHotels from '../../../logic/useHotels';
import usePaginatedTable from '../../../logic/usePaginatedTable';
import { formatDate, formatCurrencyFixed4, calculateBalance } from '../../../utils/formatters';

/**
 * Shared "today's pending check-in / check-out" action page.
 * Props:
 *  - mode: 'checkin' | 'checkout'
 */
const MODE_CONFIG = {
  checkin: {
    headerTitle: 'PROCESS CHECK IN',
    fetchData: () => apiService.getCheckinToday(),
    processAction: (id) => apiService.processCheckin(id),
    actionLabel: 'Check In',
    colorClass: 'btn-checkin',
    modalTitle: 'Confirm Check In',
    confirmLabel: 'Confirm Check In',
    successMessage: (guest) => `Successfully checked in ${guest.guest_name}`,
    showStayDates: true
  },
  checkout: {
    headerTitle: 'PROCESS CHECK OUT',
    fetchData: () => apiService.getCheckoutToday(),
    processAction: (id) => apiService.processCheckout(id),
    actionLabel: 'Check Out',
    colorClass: 'btn-checkout',
    modalTitle: 'Confirm Check Out',
    confirmLabel: 'Confirm Check Out',
    successMessage: () => 'Pembayaran berhasil dikonfirmasi',
    showStayDates: false
  }
};

const FrontDeskAction = ({ mode }) => {
  useAuth();
  const config = MODE_CONFIG[mode];
  const { hotels } = useHotels();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [processing, setProcessing] = useState(false);

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    selectedHotel, setSelectedHotel,
    filteredItems, currentData,
    totalPages, startIndex, endIndex
  } = usePaginatedTable(items, {
    searchFields: ['guest_name', 'room_number', 'market_segment', 'registration_no'],
    initialShowEntries: 100
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await config.fetchData();
      setItems(response.data || []);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setItems([]);
        setError(null);
      } else {
        setError('Failed to fetch data: ' + (err.response?.data?.detail || err.message));
        console.error('Error fetching front desk data:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (guest) => {
    setSelectedGuest(guest);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    if (!selectedGuest) return;

    setProcessing(true);
    try {
      await config.processAction(selectedGuest.id);
      setSuccessMessage(config.successMessage(selectedGuest));
      setShowConfirmModal(false);
      setSelectedGuest(null);
      fetchData();

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(`Failed to process ${mode}: ` + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
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

        <UnifiedTableHeader
          title={config.headerTitle}
          hotels={hotels}
          selectedHotel={selectedHotel}
          onHotelChange={setSelectedHotel}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showEntries={showEntries}
          onEntriesChange={setShowEntries}
        />

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
              <col style={{ width: '120px' }} />  {/* Registered By */}
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
                <th>Registered By</th>
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
                    <td className="align-right">{formatCurrencyFixed4(item.payment_amount || 0)}</td>
                    <td className="align-right">{formatCurrencyFixed4(item.deposit || 0)}</td>
                    <td className="align-right">{formatCurrencyFixed4(calculateBalance(item.payment_amount, item.deposit))}</td>
                    <td title={item.transaction_by || '-'}>{item.transaction_by || '-'}</td>
                    <td className="align-center">
                      <button
                        className={`btn-table-action ${config.colorClass}`}
                        title={`Process ${config.actionLabel}`}
                        onClick={() => handleAction(item)}
                      >
                        {config.actionLabel}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <UnifiedTableFooter
          startIndex={startIndex}
          endIndex={endIndex}
          total={filteredItems.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {showConfirmModal && selectedGuest && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
              <div className="modal-header">
                <h3>{config.modalTitle}</h3>
                <button className="modal-close" onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedGuest(null);
                }}>×</button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to {mode === 'checkin' ? 'check in' : 'check out'} the following guest?</p>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '4px',
                  marginTop: '15px'
                }}>
                  <p style={{ margin: '5px 0' }}><strong>Name:</strong> {selectedGuest.guest_name}</p>
                  <p style={{ margin: '5px 0' }}><strong>Room:</strong> {selectedGuest.room_number}</p>
                  {config.showStayDates && (
                    <>
                      <p style={{ margin: '5px 0' }}><strong>Arrival:</strong> {formatDate(selectedGuest.arrival_date)}</p>
                      <p style={{ margin: '5px 0' }}><strong>Departure:</strong> {formatDate(selectedGuest.departure_date)}</p>
                      <p style={{ margin: '5px 0' }}><strong>Nights:</strong> {selectedGuest.nights}</p>
                    </>
                  )}
                  <p style={{ margin: '5px 0' }}><strong>Total Charge:</strong> Rp {formatCurrencyFixed4(selectedGuest.payment_amount)}</p>
                  <p style={{ margin: '5px 0' }}><strong>Deposit:</strong> Rp {formatCurrencyFixed4(selectedGuest.deposit)}</p>
                  <p style={{ margin: '5px 0' }}><strong>Balance:</strong> Rp {formatCurrencyFixed4(calculateBalance(selectedGuest.payment_amount, selectedGuest.deposit))}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedGuest(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className={`btn-primary ${config.colorClass}`}
                  onClick={confirmAction}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : config.confirmLabel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .btn-checkin {
          background-color: #007bff !important;
          border-color: #007bff !important;
          color: white !important;
        }
        .btn-checkin:hover {
          background-color: #0069d9 !important;
          border-color: #0062cc !important;
        }
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

export default FrontDeskAction;
