import { useState } from 'react'
import Layout from '../../../components/Layout'
import { useAuth } from '../../../context/AuthContext'

const InfoReservasiPage = () => {
  const { user } = useAuth()

  return (
    <Layout>
      <div className="info-reservasi-container">
        <div className="page-header">
          <h1>Info Reservasi</h1>
          <p>Manage and view hotel reservation information</p>
        </div>
        
        <div className="content-section">
          <div className="info-cards">
            <div className="info-card">
              <h3>Total Reservations</h3>
              <p className="info-number">0</p>
            </div>
            <div className="info-card">
              <h3>Today's Check-ins</h3>
              <p className="info-number">0</p>
            </div>
            <div className="info-card">
              <h3>Pending Reservations</h3>
              <p className="info-number">0</p>
            </div>
          </div>
          
          <div className="action-buttons">
            <p>Use the sidebar menu to access specific reservation functions:</p>
            <ul>
              <li>All Reservation - View all reservation data</li>
              <li>Reservation Today - Today's reservations</li>
              <li>By Deposit - Filter by deposit status</li>
              <li>Guest Research - Search guest information</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default InfoReservasiPage