import { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { apiService } from '../../../../services/api'
import Layout from '../../../../components/Layout'

const ReservasiToday = () => {
  const { user } = useAuth()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showEntries, setShowEntries] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use the real API to get hotel reservations
      const response = await apiService.getHotelReservations(0, 100)
      
      // Filter reservations for today (arrival or departure date)
      const today = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format
      
      const todayReservations = response.data ? response.data.filter(reservation => {
        const arrivalDate = reservation.arrival_date?.split('T')[0]
        const departureDate = reservation.departure_date?.split('T')[0]
        return arrivalDate === today || departureDate === today
      }) : []
      
      setReservations(todayReservations)
      
    } catch (err) {
      console.error('Error loading today reservations:', err)
      setError('Failed to load today\'s reservations data from database')
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  const filteredReservations = reservations.filter(reservation =>
    reservation.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.reservation_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.market_segment?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredReservations.length / showEntries)
  const startIndex = (currentPage - 1) * showEntries
  const endIndex = startIndex + showEntries
  const currentReservations = filteredReservations.slice(startIndex, endIndex)

  const formatCurrency = (amount) => {
    // Format to match the image - just numbers without currency symbol
    if (!amount || amount === 0) return '0.0000';
    return parseFloat(amount).toFixed(4);
  }

  const formatDate = (dateString) => {
    // A simple date format as shown in the image
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getActivityType = (reservation) => {
    const today = new Date().toISOString().split('T')[0]
    const arrivalDate = reservation.arrival_date?.split('T')[0]
    const departureDate = reservation.departure_date?.split('T')[0]
    
    if (arrivalDate === today && departureDate === today) {
      return 'Check-in & Check-out'
    } else if (arrivalDate === today) {
      return 'Check-in'
    } else if (departureDate === today) {
      return 'Check-out'
    }
    return '-'
  }

  return (
    <Layout>
      <div className="unified-reservation-container">
        {/* Combined Header and Controls */}
        <div className="unified-header-controls">
          <div className="unified-header-left">
            <select className="page-title-select">
              <option>RESERVASI TODAY</option>
            </select>
            <div className="search-section">
              <label>Search:</label>
              <input
                type="text"
                className="search-input"
                placeholder="Search reservations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="unified-header-right">
            <div className="action-buttons">
              <button title="Excel"></button>
              <button title="CSV"></button>
              <button title="Copy"></button>
              <button title="PDF"></button>
            </div>
            <button className="btn-print-unified">Print</button>
            <select
              className="entries-select"
              value={showEntries}
              onChange={(e) => setShowEntries(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="unified-table-wrapper">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Market</th>
                <th>Booking</th>
                <th>Arrival</th>
                <th>Departure</th>
                <th>Reserved By</th>
                <th>Deposit By</th>
                <th>Deposit</th>
                <th>Guest</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="no-data">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="10" className="no-data">
                    {error}
                  </td>
                </tr>
              ) : currentReservations.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-data">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentReservations.map((reservation, index) => (
                  <tr key={reservation.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{reservation.guest_name || 'N/A'}</td>
                    <td>
                      <span className={`activity-badge ${getActivityType(reservation).toLowerCase().replace(/[^a-z]/g, '-')}`}>
                        {getActivityType(reservation)}
                      </span>
                    </td>
                    <td>{reservation.reservation_no || 'N/A'}</td>
                    <td>{formatDate(reservation.arrival_date)}</td>
                    <td>{formatDate(reservation.departure_date)}</td>
                    <td>{reservation.transaction_by || 'N/A'}</td>
                    <td>{reservation.payment_method || 'N/A'}</td>
                    <td>{formatCurrency(reservation.deposit || 0)}</td>
                    <td>{(reservation.guest_count_male || 0) + (reservation.guest_count_female || 0) + (reservation.guest_count_child || 0)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="unified-footer">
          <div className="entries-info">
            {`Showing ${filteredReservations.length > 0 ? startIndex + 1 : 0} to ${Math.min(endIndex, filteredReservations.length)} of ${filteredReservations.length} entries`}
          </div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ReservasiToday