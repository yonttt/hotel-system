import Layout from '../../../components/Layout'

const AdjInventory = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Adjustment - Inventory</h1>
          <p className="page-subtitle">Inventory adjustment and corrections</p>
        </div>
        
        <div className="content-card">
          <div className="coming-soon">
            <h2>📦 Inventory Adjustment</h2>
            <p>This feature is under development</p>
            <div className="feature-preview">
              <h3>Planned Features:</h3>
              <ul>
                <li>Stock adjustments</li>
                <li>Inventory corrections</li>
                <li>Stock opname</li>
                <li>Write-off management</li>
                <li>Transfer between locations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdjInventory
