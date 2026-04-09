import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Sidebar() {
  const { logout } = useContext(AuthContext)

  return (
    <aside className="sidebar">
      <div>
        <h1 className="brand">MassiMappi</h1>
        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/settings">Settings</NavLink>
          <NavLink to="/static-management">Static Management</NavLink>
          <NavLink to="/developer">Developer</NavLink>
        </nav>
      </div>

      <button className="danger-button" onClick={logout}>
        Log out
      </button>
    </aside>
  )
} // hampurilaisvalikko, jossa on navigointilinkit ja uloskirjautumispainike