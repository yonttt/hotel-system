import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  InformationCircleIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showTravelMenu, setShowTravelMenu] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header-bar">
      {/* Left side - Complete branding */}
      <div className="header-left">
        <div className="header-brand">
          <span className="header-brand-check">✓</span>
          <span className="header-brand-text">EVA GROUP HOTEL MANAGEMENT</span>
        </div>
        
        {/* Travel Menu */}
        <div className="header-travel-menu">
          <button 
            className="travel-menu-button"
            onClick={() => setShowTravelMenu(!showTravelMenu)}
          >
            <span className="travel-icon">✈</span>
            <span>TRAVEL SINU</span>
            <ChevronDownIcon className="w-3 h-3" />
          </button>
          
          {showTravelMenu && (
            <div className="travel-dropdown">
              <a href="#" className="travel-dropdown-item">Travel Bookings</a>
              <a href="#" className="travel-dropdown-item">Flight Status</a>
              <a href="#" className="travel-dropdown-item">Hotel Reservations</a>
            </div>
          )}
        </div>
      </div>

      {/* Right side - All action buttons */}
      <div className="header-right">
        {/* Info Karyawan */}
        <button className="header-action-btn">
          <InformationCircleIcon className="w-4 h-4" />
          <span>Info Karyawan</span>
        </button>

        {/* Login Web Mail */}
        <button className="header-action-btn">
          <EnvelopeIcon className="w-4 h-4" />
          <span>Login Web Mail</span>
        </button>

        {/* User Menu */}
        <div className="header-user-menu">
          <button 
            className="user-menu-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <UserIcon className="w-4 h-4" />
            <span>ADMIN</span>
            <ChevronDownIcon className="w-3 h-3" />
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-avatar-large">
                  {user?.username?.charAt(0)?.toUpperCase() || 'Y'}
                </div>
                <div>
                  <div className="user-name">{user?.username || 'Yonathan'}</div>
                  <div className="user-role">{user?.role || 'Administrator'}</div>
                </div>
              </div>
              <div className="user-dropdown-divider"></div>
              <a href="#" className="user-dropdown-item">
                <UserIcon className="w-4 h-4" />
                <span>Profile</span>
              </a>
              <div className="user-dropdown-divider"></div>
              <button onClick={handleLogout} className="user-dropdown-item logout">
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header