import Layout from '../../../components/Layout'

const AdjFoodBeverage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Adjustment - Food & Beverage</h1>
          <p className="page-subtitle">F&B adjustment and corrections</p>
        </div>
        
        <div className="content-card">
          <div className="coming-soon">
            <h2>🍽️ Food & Beverage Adjustment</h2>
            <p>This feature is under development</p>
            <div className="feature-preview">
              <h3>Planned Features:</h3>
              <ul>
                <li>F&B price adjustments</li>
                <li>Menu corrections</li>
                <li>Order modifications</li>
                <li>Bill adjustments</li>
                <li>Void transactions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdjFoodBeverage
