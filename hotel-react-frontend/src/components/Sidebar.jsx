import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClipboardDocumentIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  UserIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'

const Sidebar = () => {
  const { user } = useAuth()
  const [expandedMenus, setExpandedMenus] = useState({
    operational: false,
    frontOffice: false,
    formTransaksi: false,
    infoReservasi: false,
    informasiTamu: false,
    groupBookingInfo: false,
    statusKamarFO: false,
    masterDataFO: false,
    housekeeping: false,
    statusKamar: false,
    masterData: false,
    hrd: false,
    accounting: false,
    administration: false,
    userManagement: false
  })
  const [scrollPosition, setScrollPosition] = useState(0)
  const location = useLocation()

  // Restore scroll position when menus expand/collapse, but not on route change
  useEffect(() => {
    const sidebarNav = document.querySelector('.sidebar-nav')
    if (sidebarNav && scrollPosition > 0) {
      // Small delay to ensure DOM is updated after menu expansion
      setTimeout(() => {
        sidebarNav.scrollTop = scrollPosition
      }, 100)
    }
  }, [expandedMenus, scrollPosition])

  // Otomatis buka menu yang sesuai dengan path saat ini
  useEffect(() => {
    const path = location.pathname
    const newExpandedMenus = { ...expandedMenus }

    if (path.includes('/operational/')) {
      newExpandedMenus.operational = true
      if (path.includes('/frontoffice/')) {
        newExpandedMenus.frontOffice = true
        if (path.includes('/form-transaksi/')) {
          newExpandedMenus.formTransaksi = true
        }
        if (path.includes('/info-reservasi/')) {
          newExpandedMenus.infoReservasi = true
        }
        if (path.includes('/informasi-tamu/')) {
          newExpandedMenus.informasiTamu = true
        }
        if (path.includes('/informasi-group-booking') || path.includes('/group-booking-rooms')) {
          newExpandedMenus.groupBookingInfo = true
        }
        if (path.includes('/status-kamar')) {
          newExpandedMenus.statusKamarFO = true
        }
        if (path.includes('/master-data-fo/')) {
          newExpandedMenus.masterDataFO = true
        }
      }
      if (path.includes('/housekeeping/')) {
        newExpandedMenus.housekeeping = true
        if (path.includes('/status-kamar')) {
          newExpandedMenus.statusKamar = true
        }
        if (path.includes('/master-data/')) {
          newExpandedMenus.masterData = true
        }
      }
    } else if (path.includes('/hrd/')) {
      newExpandedMenus.hrd = true
      if (path.includes('/user-list') || path.includes('/user-authority') || path.includes('/user-management')) {
        newExpandedMenus.administration = true
        newExpandedMenus.userManagement = true
      }
      if (path.includes('/laporan-global')) {
        newExpandedMenus.accounting = true
      }
    }

    setExpandedMenus(newExpandedMenus)
  }, [location.pathname])

  const isActiveRoute = (path) => {
    return location.pathname === path
  }

  const isActiveParent = (children) => {
    if (!children) return false
    return children.some(child => {
      if (child.path && isActiveRoute(child.path)) return true
      if (child.children) return isActiveParent(child.children)
      return false
    })
  }

  const handleScrollSave = () => {
    const sidebarNav = document.querySelector('.sidebar-nav')
    if (sidebarNav) {
      setScrollPosition(sidebarNav.scrollTop)
    }
  }

  const toggleMenu = (menu) => {
    // Save current scroll position before toggling menu
    handleScrollSave()
    
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }))
  }

  const resetAllMenus = () => {
    setExpandedMenus({
      operational: false,
      frontOffice: false,
      formTransaksi: false,
      infoReservasi: false,
      informasiTamu: false,
      groupBookingInfo: false,
      statusKamarFO: false,
      masterDataFO: false,
      housekeeping: false,
      statusKamar: false,
      masterData: false,
      hrd: false,
      accounting: false,
      administration: false,
      userManagement: false
    })
    setScrollPosition(0)
    const sidebarNav = document.querySelector('.sidebar-nav')
    if (sidebarNav) {
      sidebarNav.scrollTop = 0
    }
  }

  const sidebarItems = [
    {
      title: 'HOME',
      path: '/dashboard',
      icon: HomeIcon,
      isHome: true
    },
    {
      title: 'OPERATIONAL',
      icon: BuildingOfficeIcon,
      hasSubmenu: true,
      submenu: 'operational',
      children: [
        { title: 'Adjustment', path: '/operational/adjustment' },
        { title: 'Food & Beverage', path: '/operational/foodbeverage' },
        {
          title: 'Front Office',
          hasSubmenu: true,
          submenu: 'frontOffice',
          children: [
            {
              title: 'Form Transaksi',
              hasSubmenu: true,
              submenu: 'formTransaksi',
              children: [
                { title: 'Registrasi', path: '/operational/frontoffice/form-transaksi/registrasi' },
                { title: 'Reservasi', path: '/operational/frontoffice/form-transaksi/reservasi' },
                { title: 'Group Booking', path: '/operational/frontoffice/form-transaksi/group-booking' }
              ]
            },
            { 
              title: 'Info Reservasi', 
              hasSubmenu: true,
              submenu: 'infoReservasi',
              children: [
                { title: 'Reservation Today', path: '/operational/frontoffice/info-reservasi/today' },
                { title: 'Reservation By Deposit', path: '/operational/frontoffice/info-reservasi/deposit' },
                { title: 'All Reservation', path: '/operational/frontoffice/info-reservasi/all' }
              ]
            },
            { 
              title: 'Informasi Tamu', 
              hasSubmenu: true,
              submenu: 'informasiTamu',
              children: [
                { title: 'In House Guest ', path: '/operational/frontoffice/informasi-tamu/in-house-guest' },
                { title: 'Check in Today', path: '/operational/frontoffice/informasi-tamu/check-in-today' },
                { title: 'Guest History', path: '/operational/frontoffice/informasi-tamu/guest-history' }
              ]
            },
            { 
              title: 'Group Booking Info', 
              hasSubmenu: true,
              submenu: 'groupBookingInfo',
              children: [
                { title: 'Group Booking List', path: '/operational/frontoffice/informasi-group-booking' },
                { title: 'Group Booking Rooms', path: '/operational/frontoffice/group-booking-rooms' }
              ]
            },
            {
              title: 'Status Kamar',
              hasSubmenu: true,
              submenu: 'statusKamarFO',
              children: [
                { title: 'Status Kamar FO', path: '/operational/frontoffice/status-kamar-fo' }
              ]
            },
            {
              title: 'Master Data',
              hasSubmenu: true,
              submenu: 'masterDataFO',
              children: [
                { title: 'Ubah Status Kamar', path: '/operational/frontoffice/master-data-fo/ubah-status-kamar' },
                { title: 'Master Harga Kamar', path: '/operational/frontoffice/master-data-fo/master-harga-kamar' }
              ]
            },
          ]
        },
        {
          title: 'Housekeeping',
          hasSubmenu: true,
          submenu: 'housekeeping',
          children: [
            {
              title: 'Status Kamar',
              hasSubmenu: true,
              submenu: 'statusKamar',
              children: [
                { title: 'Status Kamar HP', path: '/operational/housekeeping/status-kamar-hp' }
              ]
            },
            {
              title: 'Master Data',
              hasSubmenu: true,
              submenu: 'masterData',
              children: [
                { title: 'Master Room Type', path: '/operational/housekeeping/master-data/room-type' },
                { title: 'Management Room', path: '/operational/housekeeping/master-data/management-room' }
              ]
            }
          ]
        },
        { title: 'Laundry', path: '/operational/laundry' }
      ]
    },
    {
      title: 'HRD',
      icon: UserGroupIcon,
      hasSubmenu: true,
      submenu: 'hrd',
      children: [
        { title: 'Account Receivable', path: '/hrd/account-receivable' },
        { 
          title: 'Accounting',
          hasSubmenu: true,
          submenu: 'accounting',
          children: [
            { title: 'Laporan Global', path: '/hrd/laporan-global' }
          ]
        },
        { 
          title: 'Administration',
          hasSubmenu: true,
          submenu: 'administration',
          children: [
            { 
              title: 'User Management',
              hasSubmenu: true,
              submenu: 'userManagement',
              children: [
                { title: 'User List', path: '/hrd/user-list' },
                { title: 'Otoritas Pengguna', path: '/hrd/user-authority' }
              ]
            }
          ]
        }
      ]
    }
  ]

  // Filter sidebar items based on user role
  const getFilteredSidebarItems = () => {
    if (!user) return sidebarItems

    const userRole = user.role

    // Admin sees everything
    if (userRole === 'admin' || userRole === 'manager') {
      return sidebarItems
    }

    // Front Office user - only sees Home and Front Office menu
    if (userRole === 'frontoffice') {
      return sidebarItems.map(item => {
        if (item.title === 'HOME') return item
        if (item.title === 'OPERATIONAL') {
          return {
            ...item,
            children: item.children.filter(child => child.title === 'Front Office')
          }
        }
        return null
      }).filter(Boolean)
    }

    // Housekeeping user - only sees Home and Housekeeping menu
    if (userRole === 'housekeeping') {
      return sidebarItems.map(item => {
        if (item.title === 'HOME') return item
        if (item.title === 'OPERATIONAL') {
          return {
            ...item,
            children: item.children.filter(child => child.title === 'Housekeeping')
          }
        }
        return null
      }).filter(Boolean)
    }

    // Default - show all for staff
    return sidebarItems
  }

  const filteredSidebarItems = getFilteredSidebarItems()

  const renderMenuItem = (item, depth = 0) => {
    const paddingClass = depth === 0 ? 'pl-6' : depth === 1 ? 'pl-10' : depth === 2 ? 'pl-14' : 'pl-18'
    const isActive = item.path && isActiveRoute(item.path)
    const isParentActive = item.children && isActiveParent(item.children)
    
    if (item.hasSubmenu) {
      const isExpanded = expandedMenus[item.submenu]
      
      return (
        <div key={item.title}>
          <button
            onClick={() => toggleMenu(item.submenu)}
            className={`sidebar-menu-item sidebar-main-item ${paddingClass} ${
              isParentActive ? 'sidebar-parent-active' : ''
            }`}
          >
            {item.icon && <item.icon className="sidebar-icon" />}
            <span className="sidebar-text">{item.title}</span>
            {isExpanded ? (
              <ChevronDownIcon className="sidebar-chevron sidebar-chevron-expanded" />
            ) : (
              <ChevronRightIcon className="sidebar-chevron" />
            )}
          </button>
          
          {isExpanded && item.children && (
            <div className="sidebar-submenu">
              {item.children.map(child => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.title}
        to={item.path}
        className={`sidebar-menu-item ${
          isActive ? 'sidebar-active' : ''
        } ${depth === 0 ? 'sidebar-main-item' : 'sidebar-sub-item'} ${paddingClass}`}
        onClick={() => {
          // Only save scroll for non-home items and only reset for home
          if (item.isHome) {
            resetAllMenus()
          } else {
            // Don't reset scroll position for regular submenu navigation
            // handleScrollSave() - removed this to prevent scroll reset
          }
        }}
      >
        {item.icon && <item.icon className="sidebar-icon" />}
        <span className="sidebar-text">{item.title}</span>
        {item.hasRefresh && (
          <button 
            className="refresh-btn"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              window.location.reload()
            }}
            title="Refresh Status Kamar"
          >
            ↻
          </button>
        )}
      </Link>
    )
  }

  return (
    <div className="sidebar translate-x-0">
      {/* Navigation */}
      <div className="sidebar-nav">
        {filteredSidebarItems.map(item => renderMenuItem(item))}
      </div>
    </div>
  )
}

export default Sidebar