import Layout from '../../../../components/Layout'

const InfoReservasiPage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Info Reservasi</h1>
          <p className="page-subtitle">View and manage hotel reservations</p>
        </div>
        
        <div className="page-content">
          <div className="search-section">
            <div className="search-bar">
              <input type="text" placeholder="Search by guest name, reservation number..." />
              <button className="btn-primary">Search</button>
            </div>
            <div className="filter-options">
              <select>
                <option>All Reservations</option>
                <option>Today's Check-ins</option>
                <option>Tomorrow's Check-ins</option>
                <option>This Week</option>
              </select>
            </div>
          </div>
          
          <div className="reservation-stats">
            <div className="stat-card">
              <div className="stat-number">24</div>
              <div className="stat-label">Today's Arrivals</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">18</div>
              <div className="stat-label">Today's Departures</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">156</div>
              <div className="stat-label">Total Reservations</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">12</div>
              <div className="stat-label">Pending Confirmations</div>
            </div>
          </div>
          
          <div className="reservation-table">
            <h3>Reservation List</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reservation #</th>
                  <th>Guest Name</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Room Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>RSV001</td>
                  <td>John Doe</td>
                  <td>2025-09-15</td>
                  <td>2025-09-18</td>
                  <td>Deluxe Room</td>
                  <td><span className="status confirmed">Confirmed</span></td>
                  <td>
                    <button className="btn-small">View</button>
                    <button className="btn-small">Edit</button>
                  </td>
                </tr>
                <tr>
                  <td>RSV002</td>
                  <td>Jane Smith</td>
                  <td>2025-09-16</td>
                  <td>2025-09-20</td>
                  <td>Suite</td>
                  <td><span className="status pending">Pending</span></td>
                  <td>
                    <button className="btn-small">View</button>
                    <button className="btn-small">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default InfoReservasiPage