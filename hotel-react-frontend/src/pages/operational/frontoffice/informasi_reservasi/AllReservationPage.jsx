import { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { apiService } from '../../../../services/api'
import Layout from '../../../../components/Layout'

const AllReservationPage = () => {
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
      
      // Set reservations from API response, or empty array if no data
      setReservations(response.data || [])
      
    } catch (err) {
      console.error('Error loading reservations:', err)
      setError('Failed to load reservations data from database')
      setReservations([]) // Set empty array on error
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
    return new Date(dateString).toLocaleDateString('id-ID')
  }

  if (loading) {
    return (
      <Layout>
        <div className="reservation-list-container">
          <div className="loading-spinner">Loading reservation data...</div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="reservation-list-container">
          <div className="error-message">{error}</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="reservation-list-container">
        {/* Header Section */}
        <div className="reservation-list-header">
          <div className="header-left">
            <div className="page-icon">📋</div>
            <div className="header-text">
              <h1 className="page-title">ALL RESERVATION LIST</h1>
              <div className="hotel-info">
                Hotel: <span className="hotel-name">ALL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="table-controls">
          <div className="controls-left">
            <div className="search-section">
              <label>Search:</label>
              <input
                type="text"
                className="search-input"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="controls-right">
            <div className="entries-section">
              <label>Show entries:</label>
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
            <div className="action-buttons">
              <button className="btn-excel">📊</button>
              <button className="btn-csv">📄</button>
              <button className="btn-copy">📋</button>
              <button className="btn-pdf">📰</button>
              <button className="btn-print">🖨️ Print</button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-container">
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
                  <td colSpan="10" className="no-data">
                    Loading reservations...
                  </td>
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
                    No reservation data available yet
                  </td>
                </tr>
              ) : (
                currentReservations.map((reservation, index) => (
                  <tr key={reservation.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{reservation.guest_name}</td>
                    <td>{reservation.market_segment}</td>
                    <td>{reservation.booking_source}</td>
                    <td>{formatDate(reservation.arrival_date)}</td>
                    <td>{formatDate(reservation.departure_date)}</td>
                    <td>{reservation.reserved_by}</td>
                    <td>{reservation.deposit_by}</td>
                    <td>{formatCurrency(reservation.deposit_amount)}</td>
                    <td>{reservation.room_number}</td>
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

export default AllReservationPage