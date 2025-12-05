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
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleViewProfile = () => {
    setShowUserMenu(false)
    navigate('/profile')
  }

  return (
    <header className="header-bar">
      {/* Left side - Complete branding */}
      <div className="header-left">
        <div className="header-brand">
          <span className="header-brand-check">✓</span>
          <span className="header-brand-text">EVA GROUP HOTEL MANAGEMENT</span>
        </div>
      </div>

      {/* Right side - User menu and logout */}
      <div className="header-right">
        {/* User Menu */}
        <div className="header-user-menu">
          <button 
            className="user-menu-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <UserIcon className="w-2.5 h-2.5" />
            <span>{user?.username?.toUpperCase() || 'USER'}</span>
            <ChevronDownIcon className="w-2 h-2" />
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header-new">
                <div className="login-status-text">ANDA LOGIN SEBAGAI</div>
                <div className="user-name-large">{user?.username?.toUpperCase()}</div>
                <a href="#" onClick={(e) => { e.preventDefault(); handleViewProfile(); }} className="account-link">Lihat Profil</a>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button className="header-action-btn logout-btn" onClick={handleLogout}>
          <ArrowRightOnRectangleIcon className="w-2.5 h-2.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Header