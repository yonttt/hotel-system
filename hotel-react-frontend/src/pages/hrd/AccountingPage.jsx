import Layout from '../../components/Layout'

const AccountingPage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Accounting</h1>
          <p className="page-subtitle">Financial management and accounting</p>
        </div>
        
        <div className="content-card">
          <div className="coming-soon">
            <h2>📊 Accounting Module</h2>
            <p>This feature is under development</p>
            <div className="feature-preview">
              <h3>Planned Features:</h3>
              <ul>
                <li>General ledger</li>
                <li>Financial statements</li>
                <li>Budget management</li>
                <li>Cost center tracking</li>
                <li>Tax management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AccountingPage