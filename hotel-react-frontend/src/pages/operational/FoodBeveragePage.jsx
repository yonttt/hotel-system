import Layout from '../../components/Layout'

const FoodBeveragePage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Food & Beverage</h1>
          <p className="page-subtitle">Restaurant and bar management</p>
        </div>
        
        <div className="content-card">
          <div className="coming-soon">
            <h2>🍽️ Food & Beverage Module</h2>
            <p>This feature is under development</p>
            <div className="feature-preview">
              <h3>Planned Features:</h3>
              <ul>
                <li>Menu management</li>
                <li>Order processing</li>
                <li>Inventory tracking</li>
                <li>Sales reporting</li>
                <li>Table reservations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default FoodBeveragePage