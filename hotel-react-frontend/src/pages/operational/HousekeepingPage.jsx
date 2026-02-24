import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'

const HousekeepingPage = () => {
  const menuItems = [
    { title: 'Status Kamar HP', description: 'View housekeeping room status overview', path: '/operational/housekeeping/status-kamar-hp', icon: '🛏️' },
    { title: 'Master Room Type', description: 'Manage room type categories and pricing', path: '/operational/housekeeping/master-data/room-type', icon: '🏷️' },
    { title: 'Management Room', description: 'Manage individual room configurations', path: '/operational/housekeeping/master-data/management-room', icon: '🔧' }
  ]

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">🧹 Housekeeping</h1>
          <p className="page-subtitle">Room cleaning and maintenance management</p>
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

export default HousekeepingPage