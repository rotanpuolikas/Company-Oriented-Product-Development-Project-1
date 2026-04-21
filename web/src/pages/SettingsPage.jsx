import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'

export default function SettingsPage() {
  const { t, locale, setLocale } = useLocale()

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>{t.settings}</h2>
          <p className="muted-text">{t.settingsDesc}</p>
        </div>
      </div>

      <div className="panel">
        <Link className="settings-link" to="/static-management">
          {t.manageStaticIncomesExpenses}
        </Link>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <p style={{ marginBottom: 12, fontWeight: 600 }}>{t.language}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className={locale === 'en-US' ? 'primary-button' : 'secondary-button'}
            onClick={() => setLocale('en-US')}
          >
            EN
          </button>
          <button
            className={locale === 'fi-FI' ? 'primary-button' : 'secondary-button'}
            onClick={() => setLocale('fi-FI')}
          >
            FI
          </button>
        </div>
      </div>
    </section>
  )
}
