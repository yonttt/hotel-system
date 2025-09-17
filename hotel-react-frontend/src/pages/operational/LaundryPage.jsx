import Layout from '../../components/Layout'

const LaundryPage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Laundry</h1>
          <p className="page-subtitle">Laundry service management</p>
        </div>
        
        <div className="content-card">
          <div className="coming-soon">
            <h2>🧺 Laundry Module</h2>
            <p>This feature is under development</p>
            <div className="feature-preview">
              <h3>Planned Features:</h3>
              <ul>
                <li>Laundry order processing</li>
                <li>Service pricing</li>
                <li>Pickup and delivery tracking</li>
                <li>Guest laundry history</li>
                <li>Inventory management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default LaundryPage