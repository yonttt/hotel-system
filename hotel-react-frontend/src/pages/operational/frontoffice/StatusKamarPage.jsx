import Layout from '../../../components/Layout'

const StatusKamarPage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Status Kamar</h1>
          <p className="page-subtitle">Real-time room status monitoring</p>
        </div>
        
        <div className="content-card">
          <div className="coming-soon">
            <h2>🏨 Room Status Module</h2>
            <p>This feature is under development</p>
            <div className="feature-preview">
              <h3>Planned Features:</h3>
              <ul>
                <li>Real-time room status</li>
                <li>Housekeeping schedule</li>
                <li>Maintenance tracking</li>
                <li>Occupancy overview</li>
                <li>Room availability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default StatusKamarPage