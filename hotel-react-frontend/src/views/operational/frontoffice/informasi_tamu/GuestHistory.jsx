import { useState, useEffect } from 'react'
import { useAuth } from '../../../../state/AuthContext'
import { apiService } from '../../../../api/api'
import Layout from '../../../../ui/Layout'
import UnifiedTableHeader from '../../../../ui/UnifiedTableHeader'
import UnifiedTableFooter from '../../../../ui/UnifiedTableFooter'
import useHotels from '../../../../logic/useHotels'
import usePaginatedTable from '../../../../logic/usePaginatedTable'
import { formatCurrencyFixed4 } from '../../../../utils/formatters'

const GuestHistory = () => {
  const { user } = useAuth()
  const { hotels } = useHotels()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

  useEffect(() => {
    loadRegistrations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom, dateTo])

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

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    selectedHotel, setSelectedHotel,
    filteredItems: filteredRegistrations, currentData: currentRegistrations,
    totalPages, startIndex, endIndex
  } = usePaginatedTable(registrations, {
    searchFields: ['guest_name', 'registration_no', 'category_market', 'id_card_number']
  })

  useEffect(() => {
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom, dateTo])

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

        <UnifiedTableHeader
          title="Guest History Information"
          actions={(
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
                    <td className="align-right">{formatCurrencyFixed4(registration.payment_amount || 0)}</td>
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

        <UnifiedTableFooter
          startIndex={startIndex}
          endIndex={endIndex}
          total={filteredRegistrations.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
                <div style={{ marginBottom: '10px' }}><strong>Payment:</strong> {formatCurrencyFixed4(selectedItem?.payment_amount || 0)}</div>
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
