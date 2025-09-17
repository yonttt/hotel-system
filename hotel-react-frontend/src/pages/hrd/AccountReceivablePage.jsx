import Layout from '../../components/Layout'

const AccountReceivablePage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Account Receivable</h1>
          <p className="page-subtitle">Manage outstanding payments and receivables</p>
        </div>
        
        <div className="content-card">
          <div className="coming-soon">
            <h2>💰 Account Receivable Module</h2>
            <p>This feature is under development</p>
            <div className="feature-preview">
              <h3>Planned Features:</h3>
              <ul>
                <li>Outstanding invoices</li>
                <li>Payment tracking</li>
                <li>Credit management</li>
                <li>Aging reports</li>
                <li>Collection management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AccountReceivablePage