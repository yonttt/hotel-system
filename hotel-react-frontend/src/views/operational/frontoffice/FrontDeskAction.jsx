import { useState, useEffect } from 'react';
import { apiService } from '../../../api/api';
import Layout from '../../../ui/Layout';
import Button from '../../../ui/Button';
import DataTable from '../../../ui/DataTable';
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
    variant: 'primary',
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
    variant: 'success',
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
          <div className="alert alert--success">{successMessage}</div>
        )}

        {error && (
          <div className="alert alert--error">{error}</div>
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

        <DataTable
          data={currentData}
          loading={loading}
          error={error}
          emptyText="No data available in table"
          rowKey={(item) => item.id}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '60px',
              render: (_i, idx) => startIndex + idx + 1 },
            { key: 'name', header: 'Name', render: (i) => i.guest_name || 'N/A' },
            { key: 'market', header: 'Market', render: (i) => i.market_segment || 'N/A' },
            { key: 'nights', header: 'Nights', align: 'center', render: (i) => i.nights || 0 },
            { key: 'booking', header: 'Booking Date', render: (i) => formatDate(i.created_at) },
            { key: 'type', header: 'Type', render: (i) => i.guest_type || 'N/A' },
            { key: 'room', header: 'Room', align: 'center', render: (i) => i.room_number || '-' },
            { key: 'arrival', header: 'Arrival Date', render: (i) => formatDate(i.arrival_date) },
            { key: 'departure', header: 'Departure Date', render: (i) => (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {formatDate(i.departure_date)}
                {i.is_overdue && (
                  <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '9999px', whiteSpace: 'nowrap' }}>
                    OVERDUE
                  </span>
                )}
              </span>
            ) },
            { key: 'charge', header: 'Total Charge', align: 'right', render: (i) => formatCurrencyFixed4(i.payment_amount || 0) },
            { key: 'deposit', header: 'Total Deposit', align: 'right', render: (i) => formatCurrencyFixed4(i.deposit || 0) },
            { key: 'balance', header: 'Balance', align: 'right', render: (i) => formatCurrencyFixed4(calculateBalance(i.payment_amount, i.deposit)) },
            { key: 'registered_by', header: 'Registered By', render: (i) => i.transaction_by || '-' },
            { key: 'action', header: 'Action', align: 'center', width: '120px',
              render: (i) => <Button variant={config.variant} size="sm" onClick={() => handleAction(i)}>{config.actionLabel}</Button> }
          ]}
        />

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
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedGuest(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant={config.variant} onClick={confirmAction} disabled={processing}>
                  {processing ? 'Processing...' : config.confirmLabel}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FrontDeskAction;
