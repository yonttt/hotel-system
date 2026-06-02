import Layout from './Layout'

/**
 * Reusable Coming Soon page component for features under development.
 * Eliminates duplicate code across multiple adjustment pages.
 * 
 * @param {string} title - Main page title
 * @param {string} subtitle - Page subtitle/description
 * @param {string} icon - Emoji icon to display
 * @param {Array<string>} features - List of planned features
 */
const ComingSoonPage = ({ title, subtitle, icon, features = [] }) => {
  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        
        <div className="content-card">
          <div className="coming-soon">
            <h2>{icon} {title}</h2>
            <p>This feature is under development</p>
            <div className="feature-preview">
              <h3>Planned Features:</h3>
              <ul>
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ComingSoonPage
