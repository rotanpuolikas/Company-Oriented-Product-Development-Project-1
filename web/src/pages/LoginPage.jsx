import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import logo from '../assets/logo.png'

export default function LoginPage() {
  const { login } = useContext(AuthContext)
  const { t } = useLocale()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
    } catch {
      setError(t.invalidEmailOrPassword)
    }

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <form className="auth-card form-panel" onSubmit={handleLogin}>
        <img
          src={logo}
          alt="MassiMappi logo"
          className="login-logo"
        />

        <h1>{t.welcomeBack}</h1>

        <div className="form-row">
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error ? (
            <p className="error-text">{error}</p>
          ) : null}

          <button
            className="primary-button form-submit-button"
            type="submit"
            disabled={loading}
          >
            {loading ? t.loggingIn : t.login}
          </button>
        </div>
      </form>
    </div>
  )
}