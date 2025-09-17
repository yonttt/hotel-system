import Layout from '../../components/Layout'

const AdjustmentPage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Adjustment</h1>
          <p className="page-subtitle">Manage adjustments and corrections</p>
        </div>
        
        <div className="content-card">
          <div className="coming-soon">
            <h2>🔧 Adjustment Module</h2>
            <p>This feature is under development</p>
            <div className="feature-preview">
              <h3>Planned Features:</h3>
              <ul>
                <li>Price adjustments</li>
                <li>Inventory corrections</li>
                <li>Transaction modifications</li>
                <li>Audit trail</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdjustmentPage