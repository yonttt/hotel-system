import { useState, useEffect } from 'react'
import { apiService } from '../../../../api/api'
import Layout from '../../../../ui/Layout'
import DataTable from '../../../../ui/DataTable'
import UnifiedTableHeader from '../../../../ui/UnifiedTableHeader'
import UnifiedTableFooter from '../../../../ui/UnifiedTableFooter'
import useHotels from '../../../../logic/useHotels'
import usePaginatedTable from '../../../../logic/usePaginatedTable'
import { formatCurrencyFixed4 } from '../../../../utils/formatters'

// Read-only archive of every guest the front office has checked out. The data is
// written to the checkout_history table at checkout time (see backend checkout.py).
const CheckoutHistory = () => {
  const { hotels } = useHotels()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Default date range: last 30 days to today (filtered by checkout date).
  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const [dateFrom, setDateFrom] = useState(thirtyDaysAgo)
  const [dateTo, setDateTo] = useState(today)

  useEffect(() => {
    loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom, dateTo])

  const loadHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      // Backend filters by checkout_date between start/end; hotel + search are
      // handled client-side by usePaginatedTable below.
      const response = await apiService.getCheckoutHistory(0, 500, null, dateFrom, dateTo)
      setHistory(response.data || [])
    } catch (e) {
      console.error('Error loading checkout history:', e)
      setError('Failed to load checkout history data from database')
      setHistory([])
    } finally {
      setLoading(false)
    }
  }

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    selectedHotel, setSelectedHotel,
    filteredItems, currentData,
    totalPages, startIndex, endIndex
  } = usePaginatedTable(history, {
    searchFields: ['guest_name', 'registration_no', 'room_number', 'checkout_by']
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

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  return (
    <Layout>
      <div className="unified-reservation-container">
        <UnifiedTableHeader
          title="Checkout History"
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
          data={currentData}
          loading={loading}
          error={error}
          emptyText="No checkout records in this date range"
          rowKey={(r) => r.id}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '60px',
              render: (_r, i) => startIndex + i + 1 },
            { key: 'reg_no', header: 'Reg. No', render: (r) => r.registration_no || 'N/A' },
            { key: 'name', header: 'Guest Name', render: (r) => r.guest_name || 'N/A' },
            { key: 'room', header: 'Room', align: 'center', render: (r) => r.room_number || '-' },
            { key: 'arrival', header: 'Arrival', render: (r) => formatDate(r.arrival_date) },
            { key: 'departure', header: 'Departure', render: (r) => formatDate(r.departure_date) },
            { key: 'checkout', header: 'Checkout Date', render: (r) => formatDateTime(r.checkout_date) },
            { key: 'nights', header: 'Nights', align: 'center', render: (r) => r.nights || 0 },
            { key: 'charge', header: 'Total Charge', align: 'right', render: (r) => formatCurrencyFixed4(r.total_charge || 0) },
            { key: 'deposit', header: 'Deposit', align: 'right', render: (r) => formatCurrencyFixed4(r.deposit || 0) },
            { key: 'balance', header: 'Balance', align: 'right', render: (r) => formatCurrencyFixed4(r.balance || 0) },
            { key: 'by', header: 'Checkout By', render: (r) => r.checkout_by || '-' },
          ]}
        />

        <UnifiedTableFooter
          startIndex={startIndex}
          endIndex={endIndex}
          total={filteredItems.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Layout>
  )
}

export default CheckoutHistory
