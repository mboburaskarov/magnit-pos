import { useState, useRef, useEffect, useMemo } from 'react'
import { NavLink, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { MessageSquare, Globe, Tag, Settings, ChevronRight, LogOut, Menu, Search, Boxes } from 'lucide-react'
import { Popper, Paper } from '@mui/material'
import '../../assets/magnit.css'
import { navbatRouteData } from '../../routes/navbatRouteData'
import { filterNavData } from '../../Routes'
import { useWebView } from '../WebviewProvider'

function NavItem({ item, collapsed }) {
  const { t } = useTranslation()
  const location = useLocation()
  const hasActive = item.children?.some((c) => location.pathname.startsWith(c.path || c.href))
  const [open, setOpen] = useState(hasActive ?? false)
  const [hoverAnchor, setHoverAnchor] = useState(null)
  
  const itemPath = item.path || item.href
  const itemLabel = item.isTranslate === false ? item.label : t(item.label)

  if (!item.children || item.children.length === 0) {
    return (
      <NavLink to={itemPath} className={({ isActive }) => `mg-sidebar-item${isActive ? ' active' : ''}`} title={collapsed ? itemLabel : undefined}>
        <span style={{ display: 'flex', alignItems: 'center', width: 20, justifyContent: 'center' }}>{item.icon}</span>
        {!collapsed && <span className='mg-sidebar-item-text'>{itemLabel}</span>}
        {!collapsed && item.badge && <span className='mg-sidebar-badge'>{item.badge}</span>}
      </NavLink>
    )
  }

  return (
    <div 
      onMouseEnter={(e) => collapsed && setHoverAnchor(e.currentTarget)} 
      onMouseLeave={() => collapsed && setHoverAnchor(null)}
    >
      <div className={`mg-sidebar-item${hasActive ? ' active' : ''}`} onClick={() => setOpen((o) => !o)} title={collapsed ? itemLabel : undefined}>
        <span style={{ display: 'flex', alignItems: 'center', width: 20, justifyContent: 'center' }}>{item.icon}</span>
        {!collapsed && <span className='mg-sidebar-item-text'>{itemLabel}</span>}
        {!collapsed && <ChevronRight size={13} className={`mg-sidebar-chevron${open ? ' open' : ''}`} />}
      </div>
      {open && !collapsed && (
        <div className='mg-sidebar-group-items'>
          {item.children.map((child) => {
            const childPath = child.path || child.href
            const childLabel = child.isTranslate === false ? child.label : t(child.label)
            return (
              <NavLink key={childPath} to={childPath} className={({ isActive }) => `mg-sidebar-item${isActive ? ' active' : ''}`}>
                <span className='mg-sidebar-item-text'>{childLabel}</span>
              </NavLink>
            )
          })}
        </div>
      )}

      {/* Popover for collapsed hover mode */}
      <Popper
        open={Boolean(hoverAnchor) && collapsed}
        anchorEl={hoverAnchor}
        placement='right-start'
        style={{ zIndex: 1300 }}
      >
        <Paper 
          elevation={4} 
          sx={{ ml: 1, p: 1, minWidth: 200, borderRadius: 3, border: '1px solid var(--mg-border)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
          onMouseEnter={() => setHoverAnchor(hoverAnchor)}
          onMouseLeave={() => setHoverAnchor(null)}
        >
          <div style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 700, color: 'var(--mg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            {itemLabel}
          </div>
          {item.children.map((child) => {
            const childPath = child.path || child.href
            const childLabel = child.isTranslate === false ? child.label : t(child.label)
            return (
              <NavLink key={childPath} to={childPath} className={({ isActive }) => `mg-sidebar-item${isActive ? ' active' : ''}`} onClick={() => setHoverAnchor(null)}>
                <span className='mg-sidebar-item-text'>{childLabel}</span>
              </NavLink>
            )
          })}
        </Paper>
      </Popper>
    </div>
  )
}

export default function MagnitLayout({ hasHeader = true }) {
  const { isWebview } = useWebView()
  const location = useLocation()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')

  const routeString = useMemo(() => {
    const arr = []
    userData?.role_actions?.forEach((item) => {
      if (item.route) arr.push(item.route)
    })
    return arr
  }, [userData])

  const pharmaItems = useMemo(() => {
    const items = filterNavData(navbatRouteData, routeString, userData)
    return items.map((item) => {
      if (item.href === '/orders' || item.path === '/orders' || item.label?.includes('orders')) {
        return { ...item, badge: 12 }
      }
      return item
    })
  }, [routeString, userData])

  const navGroups = [
    {
      label: 'Основное',
      items: pharmaItems,
    },
    {
      label: 'Операции',
      items: [
        { key: 'chat', label: 'Чат', isTranslate: false, icon: <MessageSquare size={16} />, path: '/magnit/chat', badge: 3 },
        {
          key: 'app',
          label: 'Приложения',
          isTranslate: false,
          icon: <Globe size={16} />,
          children: [
            { key: 'banners', label: 'Баннеры', isTranslate: false, path: '/magnit/app/banners' },
            { key: 'home-sections', label: 'Секции главной', isTranslate: false, path: '/magnit/app/home-sections' },
            { key: 'push', label: 'Push-уведомления', isTranslate: false, path: '/magnit/app/notifications' },
          ],
        },
      ],
    },
    {
      label: 'MagnitGo',
      items: [
        {
          key: 'magnit-catalog',
          label: 'Каталог',
          isTranslate: false,
          icon: <Tag size={16} />,
          children: [
            { key: 'magnit-brands', label: 'Бренды', isTranslate: false, path: '/magnit/catalog/brands' },
            { key: 'magnit-categories', label: 'Категории', isTranslate: false, path: '/magnit/catalog/categories' },
          ],
        },
      ],
    },
  ]

  const pathParts = location.pathname.split('/').filter(Boolean)

  const handleLogout = () => {
    localStorage.removeItem('noorToken')
    navigate('/login')
  }

  const isPosRoute = location.pathname.startsWith('/sales/pos')
  const showSidebar = !isWebview && !isPosRoute

  return (
    <div className='mg-layout'>
      {/* Sidebar */}
      {showSidebar && (
        <aside className={`mg-sidebar${collapsed ? ' collapsed' : ''}`}>
          <div className='mg-sidebar-logo' style={{ padding: collapsed ? '0px 0' : '0px 20px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <img
              src='/MagnitManagementLogo.svg'
              alt='Magnit Management Logo'
              style={{ height: '40px', width: collapsed ? '40px' : 'auto', objectFit: collapsed ? 'cover' : 'contain', objectPosition: 'left' }}
            />
          </div>

          <nav className='mg-sidebar-nav'>
            {navGroups.map((group) => (
              <div key={group.label}>
                {!collapsed && <div className='mg-sidebar-section-label'>{group.label}</div>}
                {group.items.map((item, idx) => (
                  <NavItem key={item.key || item.id || idx} item={item} collapsed={collapsed} />
                ))}
              </div>
            ))}
          </nav>

          <div className='mg-sidebar-footer'>
            <div className='mg-sidebar-user' onClick={handleLogout} title='Выйти'>
              <div className='mg-sidebar-avatar'>{userData?.fullName?.charAt(0) ?? 'A'}</div>
              {!collapsed && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className='mg-sidebar-user-name'>{userData?.fullName ?? 'Admin'}</div>
                  <div className='mg-sidebar-user-role'>{userData?.type ?? 'admin'}</div>
                </div>
              )}
              {!collapsed && <Settings size={14} style={{ color: 'var(--mg-text-muted)', flexShrink: 0 }} />}
            </div>
          </div>
        </aside>
      )}

      {/* Main */}
      <div className='mg-main'>
        {!isWebview && hasHeader && !isPosRoute && (
          <header className='mg-header'>
            <button className='mg-header-btn' onClick={() => setCollapsed((c) => !c)}>
              <Menu size={17} />
            </button>

            <div className='mg-header-breadcrumb'>
              <span>MagnitGo</span>
              {pathParts.map((part, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span className='mg-header-breadcrumb-sep'>/</span>
                  <span className={i === pathParts.length - 1 ? 'mg-header-breadcrumb-current' : ''}>
                    {part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ')}
                  </span>
                </span>
              ))}
            </div>

            <div className='mg-header-actions'>
              <div className='mg-header-search'>
                <Search size={14} style={{ color: 'var(--mg-text-muted)', flexShrink: 0 }} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Поиск...' />
              </div>
              <button className='mg-header-btn'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'></path>
                </svg>
              </button>
              <button className='mg-header-btn'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9'></path>
                  <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0'></path>
                </svg>
              </button>
              <div className='mg-header-user'>
                <div className='mg-sidebar-avatar' style={{ width: 32, height: 32, fontSize: 12 }}>
                  {userData?.fullName?.charAt(0) ?? 'S'}
                </div>
                <svg
                  width='12'
                  height='12'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  style={{ color: 'var(--mg-text-muted)', marginLeft: 4 }}
                >
                  <path d='m6 9 6 6 6-6'></path>
                </svg>
              </div>
            </div>
          </header>
        )}

        <main className='mg-content' style={isPosRoute ? { padding: 0, overflow: 'hidden', background: 'var(--sap-bg)' } : undefined}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
