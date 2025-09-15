import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  Bars3Icon,
  XMarkIcon,
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
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({
    operational: false,
    frontOffice: false,
    formTransaksi: false,
    hrd: false
  })
  const [scrollPosition, setScrollPosition] = useState(0)
  const location = useLocation()

  // Simpan posisi scroll ketika navigasi
  useEffect(() => {
    const sidebarNav = document.querySelector('.sidebar-nav')
    if (sidebarNav) {
      sidebarNav.scrollTop = scrollPosition
    }
  }, [location.pathname, expandedMenus])

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
      }
    } else if (path.includes('/hrd/')) {
      newExpandedMenus.hrd = true
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
      hrd: false
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
                { title: 'Reservasi', path: '/operational/frontoffice/form-transaksi/reservasi' }
              ]
            },
            { title: 'Info Reservasi', path: '/operational/frontoffice/info-reservasi' },
            { 
              title: 'Status Kamar', 
              path: '/operational/frontoffice/status-kamar',
              hasRefresh: true
            },
            { title: 'Informasi Tamu', path: '/operational/frontoffice/informasi-tamu' }
          ]
        },
        { title: 'Housekeeping', path: '/operational/housekeeping' },
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
        { title: 'Accounting', path: '/hrd/accounting' },
        { title: 'Administration', path: '/hrd/administration' }
      ]
    }
  ]

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
          handleScrollSave()
          if (item.isHome) {
            resetAllMenus()
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
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-menu-button lg:hidden"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="mobile-overlay lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Navigation */}
        <div className="sidebar-nav">
          {sidebarItems.map(item => renderMenuItem(item))}
        </div>
      </div>
    </>
  )
}

export default Sidebar