import Layout from '../../../components/Layout'

const InfoReservasiPage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Info Reservasi</h1>
          <p className="page-subtitle">View and manage reservation information</p>
        </div>
        
        <div className="content-card">
          <div className="coming-soon">
            <h2>📋 Reservation Information Module</h2>
            <p>This feature is under development</p>
            <div className="feature-preview">
              <h3>Planned Features:</h3>
              <ul>
                <li>Reservation search</li>
                <li>Guest details view</li>
                <li>Booking modifications</li>
                <li>Check-in/out status</li>
                <li>Payment tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default InfoReservasiPage