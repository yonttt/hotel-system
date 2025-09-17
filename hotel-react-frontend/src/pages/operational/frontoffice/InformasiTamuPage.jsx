import Layout from '../../../components/Layout'

const InformasiTamuPage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Informasi Tamu</h1>
          <p className="page-subtitle">Guest information and profiles</p>
        </div>
        
        <div className="content-card">
          <div className="coming-soon">
            <h2>👥 Guest Information Module</h2>
            <p>This feature is under development</p>
            <div className="feature-preview">
              <h3>Planned Features:</h3>
              <ul>
                <li>Guest profile management</li>
                <li>Contact information</li>
                <li>Stay history</li>
                <li>Preferences tracking</li>
                <li>VIP status management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default InformasiTamuPage