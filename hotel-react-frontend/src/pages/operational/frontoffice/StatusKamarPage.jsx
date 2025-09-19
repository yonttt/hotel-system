import { useState } from 'react'
import Layout from '../../../components/Layout'
import { useAuth } from '../../../context/AuthContext'

const StatusKamarPage = () => {
  const { user } = useAuth()

  return (
    <Layout>
      <div className="status-kamar-container">
        <div className="page-header">
          <h1>Status Kamar</h1>
          <p>Monitor and manage room status</p>
        </div>
        
        <div className="content-section">
          <div className="info-cards">
            <div className="info-card">
              <h3>Available Rooms</h3>
              <p className="info-number">0</p>
            </div>
            <div className="info-card">
              <h3>Occupied Rooms</h3>
              <p className="info-number">0</p>
            </div>
            <div className="info-card">
              <h3>Out of Order</h3>
              <p className="info-number">0</p>
            </div>
          </div>
          
          <div className="action-buttons">
            <p>Room status management features will be available here.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default StatusKamarPage