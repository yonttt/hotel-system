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

  return (
    <Layout>
      <div className="unified-reservation-container">
        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <div className="header-title">
                <span>INHOUSE GUEST</span>
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
                      <button className="btn-table-action" title="View Details">View</button>
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
    </Layout>
  )
}

export default InhouseGuest
