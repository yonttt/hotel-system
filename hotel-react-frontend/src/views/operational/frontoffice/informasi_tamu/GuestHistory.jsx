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
          <div className="alert alert--success">{successMessage}</div>
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

        <DataTable
          data={currentRegistrations}
          loading={loading}
          error={error}
          emptyText="No data available in table"
          rowKey={(r) => r.id}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '60px',
              render: (_r, i) => startIndex + i + 1 },
            { key: 'id_card', header: 'ID Card', render: (r) => r.id_card_number || 'N/A' },
            { key: 'name', header: 'Guest Name', render: (r) => r.guest_name || 'N/A' },
            { key: 'market', header: 'Market', render: (r) => r.category_market || 'N/A' },
            { key: 'nights', header: 'Nights', align: 'center',
              render: (r) => r.nights || calculateNights(r.arrival_date, r.departure_date) },
            { key: 'arrival', header: 'Arrival', render: (r) => formatDate(r.arrival_date) },
            { key: 'departure', header: 'Departure', render: (r) => formatDate(r.departure_date) },
            { key: 'total', header: 'Total C/I', align: 'right', render: (r) => formatCurrencyFixed4(r.payment_amount || 0) },
            ...(canEdit() ? [{
              key: 'detail', header: 'Detail', align: 'center', width: '100px',
              render: (r) => <Button variant="ghost" size="sm" onClick={() => handleDetailClick(r)}>Detail</Button>
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

      {/* Detail/Edit Modal */}
      {showDetailModal && (
        <div className="app-modal-overlay">
          <div className="app-modal-card" style={{ maxWidth: '500px' }}>
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
                  <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                  <Button variant="primary" onClick={() => setIsEditing(true)}>Edit</Button>
                </div>
              </>
            ) : (
              <>
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
                  <label className="field-label">ID Card Number</label>
                  <input
                    type="text"
                    value={editFormData.id_card_number}
                    onChange={(e) => setEditFormData({...editFormData, id_card_number: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label className="field-label">Payment Amount</label>
                  <input
                    type="number"
                    value={editFormData.payment_amount}
                    onChange={(e) => setEditFormData({...editFormData, payment_amount: e.target.value})}
                    className="form-input"
                  />
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
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button variant="success" onClick={handleSaveEdit} disabled={processing}>
                    {processing ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}    </Layout>
  )
}

export default GuestHistory
