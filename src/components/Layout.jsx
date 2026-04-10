import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/', label: '📊 Dashboard' },
  { path: '/products', label: '📦 Productos' },
  { path: '/clients', label: '👥 Clientes' },
  { path: '/sales', label: '💰 Ventas' },
  { path: '/users', label: '👤 Usuarios' },
]

export default function Layout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('adminUser')
    navigate('/login')
  }

  const user = JSON.parse(localStorage.getItem('adminUser') || '{}')

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>🛒 VentaPDV Admin</h2>
        <nav>
          {navItems.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>{user.username}</p>
          <button onClick={handleLogout} className="btn btn-small" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginTop: '10px' }}>
            Cerrar Sesión
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}