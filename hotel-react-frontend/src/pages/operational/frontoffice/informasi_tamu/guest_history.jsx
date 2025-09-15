import Layout from '../../../../components/Layout'

const InformasiTamuPage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Informasi Tamu</h1>
          <p className="page-subtitle">Guest information and management</p>
        </div>
        
        <div className="page-content">
          <div className="guest-actions">
            <button className="btn-primary">Add New Guest</button>
            <button className="btn-secondary">Import Guest Data</button>
            <button className="btn-secondary">Export Report</button>
          </div>
          
          <div className="guest-stats">
            <div className="guest-stat-item">
              <span className="stat-value">145</span>
              <span className="stat-label">Total Guests</span>
            </div>
            <div className="guest-stat-item">
              <span className="stat-value">89</span>
              <span className="stat-label">Currently In-House</span>
            </div>
            <div className="guest-stat-item">
              <span className="stat-value">24</span>
              <span className="stat-label">VIP Guests</span>
            </div>
            <div className="guest-stat-item">
              <span className="stat-value">56</span>
              <span className="stat-label">Check-in Today</span>
            </div>
          </div>
          
          <div className="guest-search">
            <div className="search-controls">
              <input type="text" placeholder="Search guest by name, ID, or phone..." />
              <select>
                <option>All Guests</option>
                <option>In-House</option>
                <option>VIP</option>
                <option>Frequent Visitors</option>
              </select>
              <button className="btn-primary">Search</button>
            </div>
          </div>
          
          <div className="guest-list">
            <h3>Guest Directory</h3>
            <div className="guest-cards">
              <div className="guest-card">
                <div className="guest-avatar">JD</div>
                <div className="guest-details">
                  <h4>John Doe</h4>
                  <p>Room 101 • Check-in: Sep 15</p>
                  <p>Phone: +1 234 567 890</p>
                  <div className="guest-tags">
                    <span className="tag vip">VIP</span>
                    <span className="tag inhouse">In-House</span>
                  </div>
                </div>
                <div className="guest-actions-small">
                  <button className="btn-small">View</button>
                  <button className="btn-small">Edit</button>
                </div>
              </div>
              
              <div className="guest-card">
                <div className="guest-avatar">JS</div>
                <div className="guest-details">
                  <h4>Jane Smith</h4>
                  <p>Room 205 • Check-in: Sep 16</p>
                  <p>Phone: +1 234 567 891</p>
                  <div className="guest-tags">
                    <span className="tag regular">Regular</span>
                    <span className="tag inhouse">In-House</span>
                  </div>
                </div>
                <div className="guest-actions-small">
                  <button className="btn-small">View</button>
                  <button className="btn-small">Edit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default InformasiTamuPage