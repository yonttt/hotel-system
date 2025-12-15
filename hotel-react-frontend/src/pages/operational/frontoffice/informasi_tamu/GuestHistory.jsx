import { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { apiService } from '../../../../services/api'
import Layout from '../../../../components/Layout'

const GuestHistory = () => {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showEntries, setShowEntries] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [successMessage, setSuccessMessage] = useState(null)
  
  // Default date range: last 30 days to today
  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const [dateFrom, setDateFrom] = useState(thirtyDaysAgo)
  const [dateTo, setDateTo] = useState(today)

  // Detail/Edit modal state
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState({
    guest_name: '',
    id_card_number: '',
    payment_amount: 0,
    notes: ''
  })
  const [processing, setProcessing] = useState(false)

  useEffect(() => { loadRegistrations() }, [dateFrom, dateTo])
  useEffect(() => { setCurrentPage(1) }, [searchTerm, showEntries, dateFrom, dateTo])

  const loadRegistrations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getHotelRegistrations(0, 100)
      // Filter registrations within date range (by arrival or departure date)
      const historyRegistrations = (response.data || []).filter(r => {
        const arrival = r.arrival_date?.split('T')[0]
        const departure = r.departure_date?.split('T')[0]
        if (!arrival && !departure) return false
        
        // Include if arrival OR departure falls within the selected range
        const arrivalInRange = arrival && arrival >= dateFrom && arrival <= dateTo
        const departureInRange = departure && departure >= dateFrom && departure <= dateTo
        
        return arrivalInRange || departureInRange
      })
      setRegistrations(historyRegistrations)
    } catch (e) {
      console.error('Error loading guest history:', e)
      setError('Failed to load guest history data from database')
      setRegistrations([])
    } finally {
      setLoading(false)
    }
  }

  const filteredRegistrations = registrations.filter(r =>
    r.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.registration_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category_market?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id_card_number?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredRegistrations.length / showEntries))
  const startIndex = (currentPage - 1) * showEntries
  const endIndex = startIndex + showEntries
  const currentRegistrations = filteredRegistrations.slice(startIndex, endIndex)

  const formatCurrency = (amount) => !amount ? '0.0000' : parseFloat(amount).toFixed(4)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`
  }

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

  // Handle detail click
  const handleDetailClick = (item) => {
    setSelectedItem(item)
    setEditFormData({
      guest_name: item.guest_name || '',
      id_card_number: item.id_card_number || '',
      payment_amount: item.payment_amount || 0,
      notes: item.notes || ''
    })
    setIsEditing(false)
    setShowDetailModal(true)
  }

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editFormData.guest_name) {
      alert('Please fill in guest name')
      return
    }

    try {
      setProcessing(true)
      await apiService.updateHotelRegistration(selectedItem.id, {
        guest_name: editFormData.guest_name,
        id_card_number: editFormData.id_card_number,
        payment_amount: parseFloat(editFormData.payment_amount) || 0,
        notes: editFormData.notes
      })
      
      setSuccessMessage(`Guest "${editFormData.guest_name}" updated successfully`)
      setShowDetailModal(false)
      setSelectedItem(null)
      setIsEditing(false)
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
    setShowDetailModal(false)
    setSelectedItem(null)
    setIsEditing(false)
    setEditFormData({
      guest_name: '',
      id_card_number: '',
      payment_amount: 0,
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
                <span>Guest History Information</span>
              </div>
              <div className="date-range-section">
                <label>Date :</label>
                <input
                  type="date"
                  className="date-input"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
                <span className="date-separator">To</span>
                <input
                  type="date"
                  className="date-input"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
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
              <col style={{ width: '140px' }} />  {/* ID Card */}
              <col style={{ width: '180px' }} />  {/* Guest Name */}
              <col style={{ width: '120px' }} />  {/* Market */}
              <col style={{ width: '80px' }} />   {/* Nights */}
              <col style={{ width: '110px' }} />  {/* Arrival */}
              <col style={{ width: '110px' }} />  {/* Departure */}
              <col style={{ width: '120px' }} />  {/* Total C/I */}
              <col style={{ width: '100px' }} />  {/* Detail */}
            </colgroup>
            <thead>
              <tr>
                <th>NO</th>
                <th>ID CARD</th>
                <th>GUEST NAME</th>
                <th>MARKET</th>
                <th>NIGHTS</th>
                <th>ARRIVAL</th>
                <th>DEPARTURE</th>
                <th>TOTAL C/I</th>
                <th>DETAIL</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="no-data">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="9" className="no-data">{error}</td></tr>
              ) : currentRegistrations.length === 0 ? (
                <tr><td colSpan="9" className="no-data">No data available in table</td></tr>
              ) : (
                currentRegistrations.map((registration, index) => (
                  <tr key={registration.id}>
                    <td>{startIndex + index + 1}</td>
                    <td title={registration.id_card_number || 'N/A'}>{registration.id_card_number || 'N/A'}</td>
                    <td title={registration.guest_name || 'N/A'}>{registration.guest_name || 'N/A'}</td>
                    <td title={registration.category_market || 'N/A'}>{registration.category_market || 'N/A'}</td>
                    <td className="align-center">{registration.nights || calculateNights(registration.arrival_date, registration.departure_date)}</td>
                    <td>{formatDate(registration.arrival_date)}</td>
                    <td>{formatDate(registration.departure_date)}</td>
                    <td className="align-right">{formatCurrency(registration.payment_amount || 0)}</td>
                    <td className="align-center">
                      {canEdit() && (
                        <button 
                          className="btn-table-action" 
                          title="View Details"
                          onClick={() => handleDetailClick(registration)}
                        >
                          Detail
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

      {/* Detail/Edit Modal */}
      {showDetailModal && (
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
              Guest Details: {selectedItem?.registration_no}
            </h3>
            
            {!isEditing ? (
              <>
                <div style={{ marginBottom: '10px' }}><strong>Guest Name:</strong> {selectedItem?.guest_name || 'N/A'}</div>
                <div style={{ marginBottom: '10px' }}><strong>ID Card:</strong> {selectedItem?.id_card_number || 'N/A'}</div>
                <div style={{ marginBottom: '10px' }}><strong>Market:</strong> {selectedItem?.category_market || 'N/A'}</div>
                <div style={{ marginBottom: '10px' }}><strong>Room:</strong> {selectedItem?.room_number || 'N/A'}</div>
                <div style={{ marginBottom: '10px' }}><strong>Arrival:</strong> {formatDate(selectedItem?.arrival_date)}</div>
                <div style={{ marginBottom: '10px' }}><strong>Departure:</strong> {formatDate(selectedItem?.departure_date)}</div>
                <div style={{ marginBottom: '10px' }}><strong>Nights:</strong> {calculateNights(selectedItem?.arrival_date, selectedItem?.departure_date)}</div>
                <div style={{ marginBottom: '10px' }}><strong>Payment:</strong> {formatCurrency(selectedItem?.payment_amount || 0)}</div>
                <div style={{ marginBottom: '20px' }}><strong>Notes:</strong> {selectedItem?.notes || 'N/A'}</div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                  <button
                    onClick={handleCloseModal}
                    style={{ padding: '8px 20px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f5f5f5', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{ padding: '8px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#2196F3', color: 'white', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                </div>
              </>
            ) : (
              <>
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
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ID Card Number</label>
                  <input
                    type="text"
                    value={editFormData.id_card_number}
                    onChange={(e) => setEditFormData({...editFormData, id_card_number: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Payment Amount</label>
                  <input
                    type="number"
                    value={editFormData.payment_amount}
                    onChange={(e) => setEditFormData({...editFormData, payment_amount: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
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
                    onClick={() => setIsEditing(false)}
                    style={{ padding: '8px 20px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f5f5f5', cursor: 'pointer' }}
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
              </>
            )}
          </div>
        </div>
      )}    </Layout>
  )
}

export default GuestHistory