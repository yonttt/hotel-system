import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { apiService } from '../services/api'
import {
  CalendarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalGuests: 0,
    availableRooms: 0,
    occupiedRooms: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentReservations, setRecentReservations] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch reservations
      const reservationsResponse = await apiService.getReservations(0, 10)
      const reservations = reservationsResponse.data
      setRecentReservations(reservations.slice(0, 5))
      
      // Fetch rooms
      const roomsResponse = await apiService.getRooms()
      const rooms = roomsResponse.data
      const availableRooms = rooms.filter(room => room.status === 'available').length
      const occupiedRooms = rooms.filter(room => room.status === 'occupied').length
      
      // Fetch guests
      const guestsResponse = await apiService.getGuests()
      const guests = guestsResponse.data
      
      setStats({
        totalReservations: reservations.length,
        totalGuests: guests.length,
        availableRooms,
        occupiedRooms
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      name: 'Total Reservations',
      value: stats.totalReservations,
      icon: CalendarIcon,
      color: 'stat-blue'
    },
    {
      name: 'Total Guests',
      value: stats.totalGuests,
      icon: UserGroupIcon,
      color: 'stat-green'
    },
    {
      name: 'Available Rooms',
      value: stats.availableRooms,
      icon: BuildingOfficeIcon,
      color: 'stat-purple'
    },
    {
      name: 'Occupied Rooms',
      value: stats.occupiedRooms,
      icon: ChartBarIcon,
      color: 'stat-orange'
    }
  ]

  if (loading) {
    return <LoadingSpinner isLoading={loading} />
  }

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
              <p><strong>Current Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Current Time:</strong> {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardPage