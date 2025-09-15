import Layout from '../../../../components/Layout'

const StatusKamarPage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Status Kamar</h1>
          <p className="page-subtitle">Real-time room status and management</p>
        </div>
        
        <div className="page-content">
          <div className="room-overview">
            <div className="room-status-cards">
              <div className="room-status-card available">
                <div className="status-icon">🟢</div>
                <div className="status-info">
                  <h3>48</h3>
                  <p>Available</p>
                </div>
              </div>
              <div className="room-status-card occupied">
                <div className="status-icon">🔴</div>
                <div className="status-info">
                  <h3>32</h3>
                  <p>Occupied</p>
                </div>
              </div>
              <div className="room-status-card cleaning">
                <div className="status-icon">🟡</div>
                <div className="status-info">
                  <h3>8</h3>
                  <p>Cleaning</p>
                </div>
              </div>
              <div className="room-status-card maintenance">
                <div className="status-icon">🟠</div>
                <div className="status-info">
                  <h3>2</h3>
                  <p>Maintenance</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="room-filter">
            <div className="filter-controls">
              <select>
                <option>All Floors</option>
                <option>Floor 1</option>
                <option>Floor 2</option>
                <option>Floor 3</option>
                <option>Floor 4</option>
              </select>
              <select>
                <option>All Room Types</option>
                <option>Standard</option>
                <option>Deluxe</option>
                <option>Suite</option>
                <option>VIP</option>
              </select>
              <select>
                <option>All Status</option>
                <option>Available</option>
                <option>Occupied</option>
                <option>Cleaning</option>
                <option>Maintenance</option>
              </select>
            </div>
          </div>
          
          <div className="room-grid">
            <h3>Room Status Grid</h3>
            <div className="rooms-container">
              <div className="room-item available">
                <div className="room-number">101</div>
                <div className="room-type">Standard</div>
                <div className="room-status">Available</div>
              </div>
              <div className="room-item occupied">
                <div className="room-number">102</div>
                <div className="room-type">Deluxe</div>
                <div className="room-status">Occupied</div>
                <div className="guest-name">John Doe</div>
              </div>
              <div className="room-item cleaning">
                <div className="room-number">103</div>
                <div className="room-type">Standard</div>
                <div className="room-status">Cleaning</div>
              </div>
              <div className="room-item available">
                <div className="room-number">104</div>
                <div className="room-type">Suite</div>
                <div className="room-status">Available</div>
              </div>
              <div className="room-item occupied">
                <div className="room-number">105</div>
                <div className="room-type">VIP</div>
                <div className="room-status">Occupied</div>
                <div className="guest-name">Jane Smith</div>
              </div>
              <div className="room-item maintenance">
                <div className="room-number">106</div>
                <div className="room-type">Standard</div>
                <div className="room-status">Maintenance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default StatusKamarPage