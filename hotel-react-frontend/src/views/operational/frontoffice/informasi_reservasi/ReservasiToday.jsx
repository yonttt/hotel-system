import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../state/AuthContext'
import { apiService } from '../../../../api/api'
import Layout from '../../../../ui/Layout'
import Button from '../../../../ui/Button'
import DataTable from '../../../../ui/DataTable'
import UnifiedTableHeader from '../../../../ui/UnifiedTableHeader'
import UnifiedTableFooter from '../../../../ui/UnifiedTableFooter'
import useHotels from '../../../../logic/useHotels'
import usePaginatedTable from '../../../../logic/usePaginatedTable'
import { formatDate, formatCurrencyFixed4 } from '../../../../utils/formatters'

const ReservasiToday = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { hotels } = useHotels()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('Active')

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editFormData, setEditFormData] = useState({
    guest_name: '',
    category_market: '',
    mobile_phone: '',
    room_number: '',
    arrival_date: '',
    departure_date: '',
    payment_method: '',
    deposit: '',
    notes: ''
  })
  const [processing, setProcessing] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getHotelReservations(0, 100)
      const today = new Date().toISOString().split('T')[0]
      const todayReservations = (response.data || []).filter(r => {
        const a = r.arrival_date?.split('T')[0]
        const d = r.departure_date?.split('T')[0]
        return a === today || d === today
      })
      setReservations(todayReservations)
    } catch (e) {
      console.error('Error loading today reservations:', e)
      setError('Failed to load today\'s reservations: ' + (e.response?.data?.detail || e.message))
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  const matchesStatus = (r) => {
    if (statusFilter !== 'Active') return true
    return !['Registered', 'Registration', 'Check-in', 'Check-out', 'Cancelled'].includes(r.transaction_status)
  }

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    selectedHotel, setSelectedHotel,
    filteredItems: filteredReservations, currentData: currentReservations,
    totalPages, startIndex, endIndex
  } = usePaginatedTable(reservations, {
    searchFields: ['guest_name', 'reservation_no', 'category_market', 'transaction_by', 'mobile_phone'],
    extraFilter: matchesStatus
  })

  useEffect(() => {
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  // Check if user has edit permission
  const canEdit = () => {
    return ['admin', 'manager', 'frontoffice'].includes(user?.role);
  }

  // Handle edit click
  const handleEditClick = (reservation) => {
    if (!canEdit()) return;
    setEditingItem(reservation);
    setEditFormData({
      guest_name: reservation.guest_name || '',
      category_market: reservation.category_market || '',
      mobile_phone: reservation.mobile_phone || '',
      room_number: reservation.room_number || '',
      arrival_date: reservation.arrival_date ? reservation.arrival_date.split('T')[0] : '',
      departure_date: reservation.departure_date ? reservation.departure_date.split('T')[0] : '',
      payment_method: reservation.payment_method || '',
      deposit: reservation.deposit || '',
      notes: reservation.notes || ''
    });
    setShowEditModal(true);
  }

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
        category_market: editFormData.category_market,
        mobile_phone: editFormData.mobile_phone,
        room_number: editFormData.room_number,
        arrival_date: editFormData.arrival_date,
        departure_date: editFormData.departure_date,
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
  }

  // Handle close modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
  }

  return (
    <Layout>
      <div className="unified-reservation-container">
        <UnifiedTableHeader
          title="RESERVATION TODAY"
          topRightExtra={(
            <div className="hotel-select">
              <label>Status :</label>
              <select
                className="header-hotel-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Active">Pending / Confirmed</option>
                <option value="ALL">All Status</option>
              </select>
            </div>
          )}
          hotels={hotels}
          selectedHotel={selectedHotel}
          onHotelChange={setSelectedHotel}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showEntries={showEntries}
          onEntriesChange={setShowEntries}
        />

        <DataTable
          data={currentReservations}
          loading={loading}
          error={error}
          emptyText="No data available in table"
          rowKey={(r) => r.id}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '60px',
              render: (_r, i) => startIndex + i + 1 },
            { key: 'name', header: 'Name', render: (r) => r.guest_name || 'N/A' },
            { key: 'group', header: 'Group', render: (r) => r.category_market || 'N/A' },
            { key: 'company', header: 'Company', render: (r) => r.transaction_by || 'N/A' },
            { key: 'phone', header: 'Telp/HP', render: (r) => r.mobile_phone || 'N/A' },
            { key: 'type', header: 'Type', render: (r) => r.transaction_status || 'N/A' },
            { key: 'room', header: 'Room', align: 'center', render: (r) => r.room_number || '-' },
            { key: 'arrival', header: 'Arrival Date', render: (r) => formatDate(r.arrival_date) },
            { key: 'departure', header: 'Departure Date', render: (r) => formatDate(r.departure_date) },
            { key: 'deposit_by', header: 'Deposit By', render: (r) => r.payment_method || 'N/A' },
            { key: 'deposit', header: 'Deposit', align: 'right', render: (r) => formatCurrencyFixed4(r.deposit || 0) },
            { key: 'action', header: 'Action', align: 'center', width: '160px',
              render: (r) => (
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                  <Button variant="primary" size="sm" onClick={() => navigate('/operational/frontoffice/form-transaksi/registrasi', { state: { reservation: r } })}>Register</Button>
                  {canEdit() && <Button variant="ghost" size="sm" onClick={() => handleEditClick(r)}>Edit</Button>}
                </div>
              ) }
          ]}
        />

        <UnifiedTableFooter
          startIndex={startIndex}
          endIndex={endIndex}
          total={filteredReservations.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
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
              Edit Today's Reservation: {editingItem.reservation_no}
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
                <label className="field-label">Group</label>
                <input
                  type="text"
                  value={editFormData.category_market}
                  onChange={(e) => setEditFormData({...editFormData, category_market: e.target.value})}
                  className="form-input"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Phone</label>
                <input
                  type="text"
                  value={editFormData.mobile_phone}
                  onChange={(e) => setEditFormData({...editFormData, mobile_phone: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Room Number</label>
              <input
                type="text"
                value={editFormData.room_number}
                onChange={(e) => setEditFormData({...editFormData, room_number: e.target.value})}
                className="form-input"
              />
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
                <label className="field-label">Payment Method</label>
                <input
                  type="text"
                  value={editFormData.payment_method}
                  onChange={(e) => setEditFormData({...editFormData, payment_method: e.target.value})}
                  className="form-input"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Deposit</label>
                <input
                  type="number"
                  value={editFormData.deposit}
                  onChange={(e) => setEditFormData({...editFormData, deposit: e.target.value})}
                  className="form-input"
                />
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
  )
}

export default ReservasiToday