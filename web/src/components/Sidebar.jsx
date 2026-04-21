import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'

export default function Sidebar() {
  const { logout } = useContext(AuthContext)
  const { t } = useLocale()

  return (
    <aside className="sidebar">
      <div>
        <h1 className="brand">MassiMappi</h1>
        <nav className="nav-links">
          <NavLink to="/">{t.home}</NavLink>
          <NavLink to="/settings">{t.settings}</NavLink>
          <NavLink to="/static-management">{t.staticManagement}</NavLink>
          <NavLink to="/developer">{t.developer}</NavLink>
        </nav>
      </div>

      <button className="danger-button" onClick={logout}>{t.logOut}</button>
    </aside>
  )
}
