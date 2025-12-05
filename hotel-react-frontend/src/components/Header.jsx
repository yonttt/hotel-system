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
            <div className="user-dropdown" style={{
              minWidth: '200px',
              padding: '12px',
              backgroundColor: '#fff',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              <div style={{ 
                textAlign: 'center',
                paddingBottom: '12px',
                borderBottom: '1px solid #e9ecef'
              }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#6c757d',
                  marginBottom: '4px'
                }}>ANDA LOGIN SEBAGAI</div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '700',
                  color: '#343a40'
                }}>{user?.username?.toUpperCase()}</div>
              </div>
              <div style={{ paddingTop: '10px' }}>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleViewProfile(); }} 
                  style={{
                    display: 'block',
                    padding: '8px 12px',
                    color: '#007bff',
                    textDecoration: 'none',
                    fontSize: '13px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    backgroundColor: '#f8f9fa',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                >
                  Lihat Profil
                </a>
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