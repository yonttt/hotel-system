import { useState, useEffect } from 'react'
import { useAuth } from '../../../../state/AuthContext'
import { apiService } from '../../../../api/api'
import Layout from '../../../../ui/Layout'
import UnifiedTableHeader from '../../../../ui/UnifiedTableHeader'
import UnifiedTableFooter from '../../../../ui/UnifiedTableFooter'
import useHotels from '../../../../logic/useHotels'
import usePaginatedTable from '../../../../logic/usePaginatedTable'
import { formatDate, formatCurrencyFixed4, calculateBalance } from '../../../../utils/formatters'

const CheckinToday = () => {
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
      const today = new Date().toISOString().split('T')[0]
      const todayCheckins = (response.data || []).filter(r => {
        const arrival = r.arrival_date?.split('T')[0]
        return arrival === today
      })
      setRegistrations(todayCheckins)
    } catch (e) {
      console.error('Error loading today check-ins:', e)
      setError('Failed to load today\'s check-in data from database')
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

        <UnifiedTableHeader
          title="CHECK IN TODAY"
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
              <col style={{ width: '80px' }} />   {/* Guest */}
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
                <th>Guest</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="14" className="no-data">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="14" className="no-data">{error}</td></tr>
              ) : currentRegistrations.length === 0 ? (
                <tr><td colSpan="14" className="no-data">No data available in table</td></tr>
              ) : (
                currentRegistrations.map((registration, index) => (
                  <tr key={registration.id}>
                    <td>{startIndex + index + 1}</td>
                    <td title={registration.guest_name || 'N/A'}>{registration.guest_name || 'N/A'}</td>
                    <td title={registration.category_market || 'N/A'}>{registration.category_market || 'N/A'}</td>
                    <td className="align-center">{calculateNights(registration.arrival_date, registration.departure_date)}</td>
                    <td>{formatDate(registration.transaction_date || registration.created_at)}</td>
                    <td title={registration.transaction_status || 'N/A'}>{registration.transaction_status || 'N/A'}</td>
                    <td className="align-center" title={registration.room_number || 'N/A'}>{registration.room_number || '-'}</td>
                    <td>{formatDate(registration.arrival_date)}</td>
                    <td>{formatDate(registration.departure_date)}</td>
                    <td className="align-right">{formatCurrencyFixed4(registration.total_amount || 0)}</td>
                    <td className="align-right">{formatCurrencyFixed4(registration.deposit || 0)}</td>
                    <td className="align-right">{formatCurrencyFixed4(calculateBalance(registration.total_amount, registration.deposit))}</td>
                    <td className="align-center">{(registration.guest_count_male || 0) + (registration.guest_count_female || 0) + (registration.guest_count_child || 0)}</td>
                    <td className="align-center">
                      {canEdit() && (
                        <button 
                          className="btn-table-action" 
                          title="Edit Details"
                          onClick={() => handleEditClick(registration)}
                        >
                          Edit
                        </button>
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
          total={filteredRegistrations.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              Edit Check-in: {editingItem?.registration_no}
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Guest Name <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                value={editFormData.guest_name}
                onChange={(e) => setEditFormData({...editFormData, guest_name: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
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

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Departure Date</label>
              <input
                type="date"
                value={editFormData.departure_date}
                onChange={(e) => setEditFormData({...editFormData, departure_date: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Total Amount</label>
                <input
                  type="number"
                  value={editFormData.total_amount}
                  onChange={(e) => setEditFormData({...editFormData, total_amount: e.target.value})}
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
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
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

export default CheckinToday;
