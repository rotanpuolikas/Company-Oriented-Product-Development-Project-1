import { Link } from 'react-router-dom'

export default function SettingsPage() {
  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p className="muted-text">Basic settings page for the website version.</p>
        </div>
      </div>

      <div className="panel">
        <Link className="settings-link" to="/static-management">
          Manage static incomes and expenses
        </Link>
      </div>
    </section>
  )
}