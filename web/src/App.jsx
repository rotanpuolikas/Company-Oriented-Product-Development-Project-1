import { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/Dashboard.jsx'
import SettingsPage from './pages/SettingsPage'
import StaticManagementPage from './pages/StaticManagementPage'
import DeveloperPage from './pages/DeveloperPage'

function ProtectedRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/static-management" element={<StaticManagementPage />} />
        <Route path="/developer" element={<DeveloperPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  const { user } = useContext(AuthContext)

  return user ? <ProtectedRoutes /> : <LoginPage />
}