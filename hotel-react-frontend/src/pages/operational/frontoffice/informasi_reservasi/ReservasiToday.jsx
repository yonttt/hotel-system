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
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID')
  }

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
      <div className="reservation-list-container">
        <div className="page-header">
          <h1>Reservasi Today</h1>
          <p>View all reservations for today ({new Date().toLocaleDateString('id-ID')})</p>
        </div>

        {/* Table Controls */}
        <div className="table-controls">
          <div className="entries-control">
            <label>Show 
              <select 
                value={showEntries} 
                onChange={(e) => setShowEntries(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              entries
            </label>
          </div>
          
          <div className="search-control">
            <label>Search:
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reservations..."
              />
            </label>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Guest Name</th>
                <th>Reservation No</th>
                <th>Activity Type</th>
                <th>Arrival Date</th>
                <th>Departure Date</th>
                <th>Room Number</th>
                <th>Status</th>
                <th>Market Segment</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="no-data">
                    Loading today's reservations...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="no-data">
                    {error}
                  </td>
                </tr>
              ) : currentReservations.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data">
                    No reservations for today yet
                  </td>
                </tr>
              ) : (
                currentReservations.map((reservation, index) => (
                  <tr key={reservation.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{reservation.guest_name}</td>
                    <td>{reservation.reservation_no}</td>
                    <td>
                      <span className={`activity-badge ${getActivityType(reservation).toLowerCase().replace(/[^a-z]/g, '-')}`}>
                        {getActivityType(reservation)}
                      </span>
                    </td>
                    <td>{formatDate(reservation.arrival_date)} {formatTime(reservation.arrival_date)}</td>
                    <td>{formatDate(reservation.departure_date)} {formatTime(reservation.departure_date)}</td>
                    <td>{reservation.room_number}</td>
                    <td>{reservation.status}</td>
                    <td>{reservation.market_segment}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="table-footer">
          <div className="entries-info">
            {filteredReservations.length === 0 ? (
              "Showing 0 to 0 of 0 entries"
            ) : (
              `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredReservations.length)} of ${filteredReservations.length} entries`
            )}
          </div>
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1 || filteredReservations.length === 0}
            >
              First
            </button>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || filteredReservations.length === 0}
            >
              Previous
            </button>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || filteredReservations.length === 0}
            >
              Next
            </button>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || filteredReservations.length === 0}
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