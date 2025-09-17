import Layout from '../../components/Layout'

const AdministrationPage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Administration</h1>
          <p className="page-subtitle">Administrative tasks and document management</p>
        </div>
        
        <div className="content-card">
          <div className="coming-soon">
            <h2>📋 Administration Module</h2>
            <p>This feature is under development</p>
            <div className="feature-preview">
              <h3>Planned Features:</h3>
              <ul>
                <li>Document management</li>
                <li>Policy administration</li>
                <li>Compliance tracking</li>
                <li>Workflow management</li>
                <li>Administrative reports</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdministrationPage