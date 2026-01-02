import Layout from '../../../components/Layout'

const AdjLaundry = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Adjustment - Laundry</h1>
          <p className="page-subtitle">Laundry adjustment and corrections</p>
        </div>
        
        <div className="content-card">
          <div className="coming-soon">
            <h2>🧺 Laundry Adjustment</h2>
            <p>This feature is under development</p>
            <div className="feature-preview">
              <h3>Planned Features:</h3>
              <ul>
                <li>Laundry price adjustments</li>
                <li>Order corrections</li>
                <li>Bill modifications</li>
                <li>Void laundry transactions</li>
                <li>Refund processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdjLaundry
