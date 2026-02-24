import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'

const AdjustmentPage = () => {
  const menuItems = [
    { title: 'Front Office - Check In', description: 'Process and adjust guest check-ins', path: '/operational/adjustment/front-office/checkin', icon: '📝' },
    { title: 'Front Office - Check Out', description: 'Process and adjust guest check-outs', path: '/operational/adjustment/front-office/checkout', icon: '🚪' },
    { title: 'Front Office - Night Audit', description: 'Night audit adjustments and reconciliation', path: '/operational/adjustment/front-office/night-audit', icon: '🌙' },
    { title: 'Food & Beverage', description: 'F&B transaction adjustments and corrections', path: '/operational/adjustment/food-beverage', icon: '🍽️' },
    { title: 'Inventory', description: 'Stock adjustments and inventory corrections', path: '/operational/adjustment/inventory', icon: '📦' },
    { title: 'Kos', description: 'Boarding house adjustments', path: '/operational/adjustment/kos', icon: '🏠' },
    { title: 'Laundry', description: 'Laundry service adjustments', path: '/operational/adjustment/laundry', icon: '🧺' },
    { title: 'Meeting Room', description: 'Meeting room booking adjustments', path: '/operational/adjustment/meeting-room', icon: '🏢' },
    { title: 'Petty Cash', description: 'Petty cash adjustments and corrections', path: '/operational/adjustment/petty-cash', icon: '💵' }
  ]

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">🔧 Adjustment</h1>
          <p className="page-subtitle">Manage adjustments and corrections across all departments</p>
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

export default AdjustmentPage