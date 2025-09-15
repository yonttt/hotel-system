import Sidebar from './Sidebar'
import Header from './Header'

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout