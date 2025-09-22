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

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, showEntries])

  const loadReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use the real API to get hotel reservations filtered by deposit
      const response = await apiService.getHotelReservations(0, 100)
      
      // Filter reservations that have deposit information
      const depositReservations = response.data ? response.data.filter(reservation => 
        (reservation.deposit ?? 0) > 0
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
    reservation.category_market?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.transaction_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.payment_method?.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <Layout>
      <div className="unified-reservation-container">
        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <div className="header-title">
                <span>RESERVATION BY DEPOSIT</span>
              </div>
              <div className="hotel-select">
                <label>Hotel :</label>
                <select className="header-hotel-select">
                  <option>ALL</option>
                </select>
              </div>
            </div>
            <div className="unified-header-right" />
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
          </div>
        </div>

        {/* Table Section */}
        <div className="unified-table-wrapper">
          <table className="reservation-table">
            <colgroup>
              <col style={{ width: '56px' }} />
              <col style={{ width: '200px' }} />
              <col style={{ width: '140px' }} />
              <col style={{ width: '160px' }} />
              <col style={{ width: '140px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '140px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '110px' }} />
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Group</th>
                <th>Company</th>
                <th>Telp/HP</th>
                <th>Type</th>
                <th>Room</th>
                <th>Arrival Date</th>
                <th>Departure Date</th>
                <th>Deposit By</th>
                <th>Deposit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12" className="no-data">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="12" className="no-data">
                    {error}
                  </td>
                </tr>
              ) : currentReservations.length === 0 ? (
                <tr>
                  <td colSpan="12" className="no-data">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentReservations.map((reservation, index) => (
                  <tr key={reservation.id}>
                    <td>{startIndex + index + 1}</td>
                    <td title={reservation.guest_name || 'N/A'}>{reservation.guest_name || 'N/A'}</td>
                    <td title={reservation.category_market || 'N/A'}>{reservation.category_market || 'N/A'}</td>
                    <td title={reservation.transaction_by || 'N/A'}>{reservation.transaction_by || 'N/A'}</td>
                    <td title={reservation.mobile_phone || 'N/A'}>{reservation.mobile_phone || 'N/A'}</td>
                    <td title={reservation.transaction_status || 'N/A'}>{reservation.transaction_status || 'N/A'}</td>
                    <td className="align-center" title={reservation.room_number || 'N/A'}>{reservation.room_number || '-'}</td>
                    <td>{formatDate(reservation.arrival_date)}</td>
                    <td>{formatDate(reservation.departure_date)}</td>
                    <td title={reservation.payment_method || 'N/A'}>{reservation.payment_method || 'N/A'}</td>
                    <td className="align-right">{formatCurrency(reservation.deposit || 0)}</td>
                    <td className="align-center">
                      <button className="btn-table-action" title="View Details">View</button>
                    </td>
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

export default ReservasiDeposit