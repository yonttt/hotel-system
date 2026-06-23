import { useState, useEffect } from 'react'
import Layout from '../ui/Layout'

const DashboardPage = () => {
  const [now, setNow] = useState(new Date())

  // Live clock so the dashboard always shows the current time.
  // Use the global Refresh button in the top header bar to refresh page data.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Simple Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-content">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Welcome to Hotel Management System</p>
          </div>
        </div>

        {/* Simple Content */}
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Welcome to Eva Group Hotel Management</h2>
            <p>This is your central dashboard for managing hotel operations.</p>

            <div className="system-status">
              <p><strong>System Status:</strong> Online and Ready</p>
              <p><strong>Current Date:</strong> {now.toLocaleDateString()}</p>
              <p><strong>Current Time:</strong> {now.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardPage
