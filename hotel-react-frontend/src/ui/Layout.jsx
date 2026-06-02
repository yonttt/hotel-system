import Sidebar from './Sidebar'
import Header from './Header'
import { useRefresh } from '../state/RefreshContext'

const Layout = ({ children }) => {
  const { refreshKey } = useRefresh();

  return (
    <div className="app-layout">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main key={refreshKey} className="content-area">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout