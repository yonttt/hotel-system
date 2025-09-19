import { useState } from 'react'
import Layout from '../../../components/Layout'
import { useAuth } from '../../../context/AuthContext'

const InformasiTamuPage = () => {
  const { user } = useAuth()

  return (
    <Layout>
      <div className="informasi-tamu-container">
        <div className="page-header">
          <h1>Informasi Tamu</h1>
          <p>Manage and view guest information</p>
        </div>
        
        <div className="content-section">
          <div className="info-cards">
            <div className="info-card">
              <h3>Total Guests</h3>
              <p className="info-number">0</p>
            </div>
            <div className="info-card">
              <h3>Active Guests</h3>
              <p className="info-number">0</p>
            </div>
            <div className="info-card">
              <h3>VIP Guests</h3>
              <p className="info-number">0</p>
            </div>
          </div>
          
          <div className="action-buttons">
            <p>Use the sidebar menu to access specific guest functions:</p>
            <ul>
              <li>All Guest - View all guest data</li>
              <li>Guest Today - Today's guests</li>
              <li>Guest In House - Currently staying guests</li>
              <li>Guest Research - Search guest information</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default InformasiTamuPage