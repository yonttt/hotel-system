import Layout from '../../components/Layout'

const HousekeepingPage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Housekeeping</h1>
          <p className="page-subtitle">Room cleaning and maintenance management</p>
        </div>
        
        <div className="content-card">
          <div className="coming-soon">
            <h2>🧹 Housekeeping Module</h2>
            <p>This feature is under development</p>
            <div className="feature-preview">
              <h3>Planned Features:</h3>
              <ul>
                <li>Room cleaning schedules</li>
                <li>Task assignments</li>
                <li>Cleaning status tracking</li>
                <li>Supply inventory</li>
                <li>Quality control</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HousekeepingPage