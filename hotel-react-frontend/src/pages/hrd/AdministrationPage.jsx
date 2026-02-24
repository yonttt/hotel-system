import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'

const AdministrationPage = () => {
  const menuItems = [
    { title: 'Property List', description: 'Manage hotel properties and configurations', path: '/hrd/property-list', icon: '🏨' },
    { title: 'User List', description: 'View and manage all system users', path: '/hrd/user-list', icon: '👥' },
    { title: 'User Authority', description: 'Configure user roles and permissions', path: '/hrd/user-authority', icon: '🔐' },
    { title: 'User Management', description: 'Register and manage user accounts', path: '/hrd/user-management', icon: '👤' }
  ]

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">📋 Administration</h1>
          <p className="page-subtitle">Administrative tasks and system management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map(item => (
            <Link key={item.path} to={item.path} className="block">
              <div className="content-card hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default AdministrationPage