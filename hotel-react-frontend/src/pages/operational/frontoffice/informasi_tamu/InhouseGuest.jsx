import { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { apiService } from '../../../../services/api'
import Layout from '../../../../components/Layout'

const InhouseGuest = () => {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showEntries, setShowEntries] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
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

  useEffect(() => { loadRegistrations() }, [])
  useEffect(() => { setCurrentPage(1) }, [searchTerm, showEntries])

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

  const filteredRegistrations = registrations.filter(r =>
    r.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.registration_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category_market?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.transaction_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.mobile_phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredRegistrations.length / showEntries))
  const startIndex = (currentPage - 1) * showEntries
  const endIndex = startIndex + showEntries
  const currentRegistrations = filteredRegistrations.slice(startIndex, endIndex)

  const formatCurrency = (amount) => !amount ? '0.0000' : parseFloat(amount).toFixed(4)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
  }

  const calculateNights = (arrival, departure) => {
    if (!arrival || !departure) return 0
    const arrivalDate = new Date(arrival)
    const departureDate = new Date(departure)
    const diffTime = Math.abs(departureDate - arrivalDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateBalance = (totalCharge, totalDeposit) => {
    const charge = parseFloat(totalCharge || 0)
    const deposit = parseFloat(totalDeposit || 0)
    return charge - deposit
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

        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <div className="header-title">
                <span>INHOUSE GUEST</span>
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
                <select className="entries-select" value={showEntries} onChange={(e) => setShowEntries(Number(e.target.value))}>
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
                    <td className="align-right">{formatCurrency(registration.total_amount || 0)}</td>
                    <td className="align-right">{formatCurrency(registration.deposit || 0)}</td>
                    <td className="align-right">{formatCurrency(calculateBalance(registration.total_amount, registration.deposit))}</td>
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

        <div className="unified-footer">
          <div className="entries-info">{`Showing ${filteredRegistrations.length > 0 ? startIndex + 1 : 0} to ${Math.min(endIndex, filteredRegistrations.length)} of ${filteredRegistrations.length} entries`}</div>
          <div className="pagination">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First</button>
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</button>
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
          </div>
        </div>
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
              Edit Guest: {editingItem?.registration_no}
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
      )}    </Layout>
  )
}

export default InhouseGuest