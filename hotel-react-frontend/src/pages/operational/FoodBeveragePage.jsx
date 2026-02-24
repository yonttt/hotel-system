import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'

const FoodBeveragePage = () => {
  const menuItems = [
    { title: 'Master Meja', description: 'Manage restaurant table configurations', path: '/operational/foodbeverage/master-data-fb/master-meja', icon: '🪑' },
    { title: 'Kategori Menu Resto', description: 'Manage restaurant menu categories', path: '/operational/foodbeverage/master-data-fb/kategori-menu-resto', icon: '📋' }
  ]

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">🍽️ Food & Beverage</h1>
          <p className="page-subtitle">Restaurant and bar management</p>
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

export default FoodBeveragePage