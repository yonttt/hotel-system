import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../state/AuthContext'
import { apiService } from '../../../../api/api'
import Layout from '../../../../ui/Layout'
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

        <div className="unified-table-wrapper">
          <table className="reservation-table">
            <colgroup>
              <col style={{ width: '60px' }} />   {/* No */}
              <col style={{ width: '180px' }} />  {/* Name */}
              <col style={{ width: '120px' }} />  {/* Group */}
              <col style={{ width: '140px' }} />  {/* Company */}
              <col style={{ width: '120px' }} />  {/* Telp/HP */}
              <col style={{ width: '100px' }} />  {/* Type */}
              <col style={{ width: '80px' }} />   {/* Room */}
              <col style={{ width: '110px' }} />  {/* Arrival Date */}
              <col style={{ width: '110px' }} />  {/* Departure Date */}
              <col style={{ width: '130px' }} />  {/* Reserved By */}
              <col style={{ width: '100px' }} />  {/* Deposit */}
              <col style={{ width: '100px' }} />  {/* Action */}
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Group</th>
                <th>Company</th>
                <th>Telp/HP</th>
                <th>Type</th>
                <th>Room</th>
                <th>Arrival Date</th>
                <th>Departure Date</th>
                <th>Deposit By</th>
                <th>Deposit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="12" className="no-data">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="12" className="no-data">{error}</td></tr>
              ) : currentReservations.length === 0 ? (
                <tr><td colSpan="12" className="no-data">No data available in table</td></tr>
              ) : (
                currentReservations.map((r, index) => (
                  <tr key={r.id}>
                    <td>{startIndex + index + 1}</td>
                    <td title={r.guest_name || 'N/A'}>{r.guest_name || 'N/A'}</td>
                    <td title={r.category_market || 'N/A'}>{r.category_market || 'N/A'}</td>
                    <td title={r.transaction_by || 'N/A'}>{r.transaction_by || 'N/A'}</td>
                    <td title={r.mobile_phone || 'N/A'}>{r.mobile_phone || 'N/A'}</td>
                    <td title={r.transaction_status || 'N/A'}>{r.transaction_status || 'N/A'}</td>
                    <td className="align-center" title={r.room_number || 'N/A'}>{r.room_number || '-'}</td>
                    <td>{formatDate(r.arrival_date)}</td>
                    <td>{formatDate(r.departure_date)}</td>
                    <td title={r.payment_method || 'N/A'}>{r.payment_method || 'N/A'}</td>
                    <td className="align-right">{formatCurrencyFixed4(r.deposit || 0)}</td>
                    <td className="align-center">
                      <button 
                        className="btn-table-action" 
                        title="Process to Registration" 
                        onClick={() => navigate('/operational/frontoffice/form-transaksi/registrasi', { state: { reservation: r } })}
                        style={{ marginRight: '5px', backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}
                      >
                        Register
                      </button>
                      {canEdit() && (
                        <button className="btn-table-action" title="Edit Details" onClick={() => handleEditClick(r)}>Edit</button>
                      )}
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
              Edit Today's Reservation: {editingItem.reservation_no}
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Group</label>
                <input
                  type="text"
                  value={editFormData.category_market}
                  onChange={(e) => setEditFormData({...editFormData, category_market: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone</label>
                <input
                  type="text"
                  value={editFormData.mobile_phone}
                  onChange={(e) => setEditFormData({...editFormData, mobile_phone: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Room Number</label>
              <input
                type="text"
                value={editFormData.room_number}
                onChange={(e) => setEditFormData({...editFormData, room_number: e.target.value})}
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Payment Method</label>
                <input
                  type="text"
                  value={editFormData.payment_method}
                  onChange={(e) => setEditFormData({...editFormData, payment_method: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Deposit</label>
                <input
                  type="number"
                  value={editFormData.deposit}
                  onChange={(e) => setEditFormData({...editFormData, deposit: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
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
  )
}

export default ReservasiToday