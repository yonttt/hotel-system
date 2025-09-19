import { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { apiService } from '../../../../services/api'
import Layout from '../../../../components/Layout'

const ReservasiDeposit = () => {
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
      
      // Use the real API to get hotel reservations filtered by deposit
      const response = await apiService.getHotelReservations(0, 100)
      
      // Filter reservations that have deposit information
      const depositReservations = response.data ? response.data.filter(reservation => 
        reservation.deposit_amount && reservation.deposit_amount > 0
      ) : []
      
      setReservations(depositReservations)
      
    } catch (err) {
      console.error('Error loading deposit reservations:', err)
      setError('Failed to load deposit reservations data from database')
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  const filteredReservations = reservations.filter(reservation =>
    reservation.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.reservation_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.deposit_by?.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <Layout>
      <div className="reservation-list-container">
        <div className="page-header">
          <h1>Reservasi By Deposit</h1>
          <p>View all reservations with deposit information</p>
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
                <th>Arrival Date</th>
                <th>Departure Date</th>
                <th>Deposit By</th>
                <th>Deposit Amount</th>
                <th>Room Number</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="no-data">
                    Loading deposit reservations...
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
                    No reservations with deposit data available yet
                  </td>
                </tr>
              ) : (
                currentReservations.map((reservation, index) => (
                  <tr key={reservation.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{reservation.guest_name}</td>
                    <td>{reservation.reservation_no}</td>
                    <td>{formatDate(reservation.arrival_date)}</td>
                    <td>{formatDate(reservation.departure_date)}</td>
                    <td>{reservation.deposit_by}</td>
                    <td>{formatCurrency(reservation.deposit_amount)}</td>
                    <td>{reservation.room_number}</td>
                    <td>{reservation.status}</td>
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

export default ReservasiDeposit