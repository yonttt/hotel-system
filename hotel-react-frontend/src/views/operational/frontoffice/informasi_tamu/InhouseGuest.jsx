import { useState, useEffect } from 'react'
import { useAuth } from '../../../../state/AuthContext'
import { apiService } from '../../../../api/api'
import Layout from '../../../../ui/Layout'
import Button from '../../../../ui/Button'
import DataTable from '../../../../ui/DataTable'
import UnifiedTableHeader from '../../../../ui/UnifiedTableHeader'
import UnifiedTableFooter from '../../../../ui/UnifiedTableFooter'
import useHotels from '../../../../logic/useHotels'
import usePaginatedTable from '../../../../logic/usePaginatedTable'
import { formatDate, formatCurrencyFixed4, calculateBalance } from '../../../../utils/formatters'

const InhouseGuest = () => {
  const { user } = useAuth()
  const { hotels } = useHotels()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editFormData, setEditFormData] = useState({
    guest_name: '',
    room_number: '',
    departure_date: '',
    total_amount: 0,
    deposit: 0,
    notes: ''
  })
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getHotelRegistrations(0, 100)
      // Inhouse guests are those currently staying (checked in, not yet departed)
      const today = new Date().toISOString().split('T')[0]
      const inhouseGuests = (response.data || []).filter(r => {
        const arrival = r.arrival_date?.split('T')[0]
        const departure = r.departure_date?.split('T')[0]
        return arrival && arrival <= today && (!departure || departure >= today)
      })
      setRegistrations(inhouseGuests)
    } catch (e) {
      console.error('Error loading inhouse guests:', e)
      setError('Failed to load inhouse guest data from database')
      setRegistrations([])
    } finally {
      setLoading(false)
    }
  }

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    selectedHotel, setSelectedHotel,
    filteredItems: filteredRegistrations, currentData: currentRegistrations,
    totalPages, startIndex, endIndex
  } = usePaginatedTable(registrations, {
    searchFields: ['guest_name', 'registration_no', 'category_market', 'transaction_by', 'mobile_phone']
  })

  const calculateNights = (arrival, departure) => {
    if (!arrival || !departure) return 0
    const arrivalDate = new Date(arrival)
    const departureDate = new Date(departure)
    const diffTime = Math.abs(departureDate - arrivalDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Check if user has edit permission
  const canEdit = () => {
    return ['admin', 'manager'].includes(user?.role?.toLowerCase());
  }

  // Handle edit click
  const handleEditClick = (item) => {
    if (!canEdit()) return
    setEditingItem(item)
    setEditFormData({
      guest_name: item.guest_name || '',
      room_number: item.room_number || '',
      departure_date: item.departure_date?.split('T')[0] || '',
      total_amount: item.total_amount || 0,
      deposit: item.deposit || 0,
      notes: item.notes || ''
    })
    setShowEditModal(true)
  }

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editFormData.guest_name) {
      alert('Please fill in guest name')
      return
    }

    try {
      setProcessing(true)
      await apiService.updateHotelRegistration(editingItem.id, {
        guest_name: editFormData.guest_name,
        room_number: editFormData.room_number,
        departure_date: editFormData.departure_date,
        total_amount: parseFloat(editFormData.total_amount) || 0,
        deposit: parseFloat(editFormData.deposit) || 0,
        notes: editFormData.notes
      })
      
      setSuccessMessage(`Guest "${editFormData.guest_name}" updated successfully`)
      setShowEditModal(false)
      setEditingItem(null)
      await loadRegistrations()
      
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err) {
      console.error('Error updating registration:', err)
      alert('Failed to update: ' + (err.response?.data?.detail || err.message))
    } finally {
      setProcessing(false)
    }
  }

  // Handle close modal
  const handleCloseModal = () => {
    setShowEditModal(false)
    setEditingItem(null)
    setEditFormData({
      guest_name: '',
      room_number: '',
      departure_date: '',
      total_amount: 0,
      deposit: 0,
      notes: ''
    })
  }

  return (
    <Layout>
      <div className="unified-reservation-container">
        {/* Success Message */}
        {successMessage && (
          <div className="alert alert--success">{successMessage}</div>
        )}

        <UnifiedTableHeader
          title="INHOUSE GUEST"
          hotels={hotels}
          selectedHotel={selectedHotel}
          onHotelChange={setSelectedHotel}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showEntries={showEntries}
          onEntriesChange={setShowEntries}
        />

        <DataTable
          data={currentRegistrations}
          loading={loading}
          error={error}
          emptyText="No data available in table"
          rowKey={(r) => r.id}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '60px',
              render: (_r, i) => startIndex + i + 1 },
            { key: 'name', header: 'Name', render: (r) => r.guest_name || 'N/A' },
            { key: 'market', header: 'Market', render: (r) => r.category_market || 'N/A' },
            { key: 'nights', header: 'Nights', align: 'center',
              render: (r) => calculateNights(r.arrival_date, r.departure_date) },
            { key: 'booking', header: 'Booking Date', render: (r) => formatDate(r.transaction_date || r.created_at) },
            { key: 'type', header: 'Type', render: (r) => r.transaction_status || 'N/A' },
            { key: 'room', header: 'Room', align: 'center', render: (r) => r.room_number || '-' },
            { key: 'arrival', header: 'Arrival Date', render: (r) => formatDate(r.arrival_date) },
            { key: 'departure', header: 'Departure Date', render: (r) => formatDate(r.departure_date) },
            { key: 'charge', header: 'Total Charge', align: 'right', render: (r) => formatCurrencyFixed4(r.total_amount || 0) },
            { key: 'deposit', header: 'Total Deposit', align: 'right', render: (r) => formatCurrencyFixed4(r.deposit || 0) },
            { key: 'balance', header: 'Balance', align: 'right', render: (r) => formatCurrencyFixed4(calculateBalance(r.total_amount, r.deposit)) },
            { key: 'guest', header: 'Guest', align: 'center',
              render: (r) => (r.guest_count_male || 0) + (r.guest_count_female || 0) + (r.guest_count_child || 0) },
            ...(canEdit() ? [{
              key: 'action', header: 'Action', align: 'center', width: '100px',
              render: (r) => <Button variant="ghost" size="sm" onClick={() => handleEditClick(r)}>Edit</Button>
            }] : [])
          ]}
        />

        <UnifiedTableFooter
          startIndex={startIndex}
          endIndex={endIndex}
          total={filteredRegistrations.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="app-modal-overlay">
          <div className="app-modal-card" style={{ maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              Edit Guest: {editingItem?.registration_no}
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Guest Name <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                value={editFormData.guest_name}
                onChange={(e) => setEditFormData({...editFormData, guest_name: e.target.value})}
                className="form-input"
              />
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

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Departure Date</label>
              <input
                type="date"
                value={editFormData.departure_date}
                onChange={(e) => setEditFormData({...editFormData, departure_date: e.target.value})}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">Total Amount</label>
                <input
                  type="number"
                  value={editFormData.total_amount}
                  onChange={(e) => setEditFormData({...editFormData, total_amount: e.target.value})}
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
                style={{ minHeight: '80px' }}
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
      )}    </Layout>
  )
}

export default InhouseGuest