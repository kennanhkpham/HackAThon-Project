import React from 'react'

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function SignUp({ onSignUp, onHome }) {
  const [email, setEmail] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [errors, setErrors] = React.useState({})
  const [success, setSuccess] = React.useState(null)

  const reset = () => {
    setEmail('')
    setUsername('')
    setPassword('')
    setConfirm('')
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!email) nextErrors.email = 'Email is required'
    else if (!validateEmail(email)) nextErrors.email = 'Email is invalid'

    if (!username) nextErrors.username = 'Username is required'
    else if (username.length < 3) nextErrors.username = 'Use 3+ characters'

    if (!password) nextErrors.password = 'Password is required'
    else if (password.length < 6) nextErrors.password = 'Password must be 6+ characters'

    if (password !== confirm) nextErrors.confirm = "Passwords don't match"

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      // Demo: persist to localStorage (not secure) and show success message
      try {
        const users = JSON.parse(localStorage.getItem('demo_users') || '[]')
        users.push({ email, username, createdAt: new Date().toISOString() })
        localStorage.setItem('demo_users', JSON.stringify(users))
        // set current user so the app can show user-specific content
        const current = { email, username }
        localStorage.setItem('current_user', JSON.stringify(current))
        if (typeof onSignUp === 'function') onSignUp(current)
      } catch (err) {
        // ignore storage errors
      }

      setSuccess({ email, username })
      reset()
    }
  }

  return (
    <div className="signup">
      <form onSubmit={handleSubmit} className="signup-form" noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="pick a username"
            required
          />
          {errors.username && <div className="field-error">{errors.username}</div>}
        </div>

        <div className="field">
          <label htmlFor="password">Create password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {errors.password && <div className="field-error">{errors.password}</div>}
        </div>

        <div className="field">
          <label htmlFor="confirm">Confirm password</label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="repeat your password"
            required
          />
          {errors.confirm && <div className="field-error">{errors.confirm}</div>}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit" className="study-submit">Create account</button>
          <button
            type="button"
            className="clear-btn"
            onClick={() => { reset(); setSuccess(null) }}
          >
            Reset
          </button>
        </div>
      </form>

      {success && (
        <div className="signup-success" role="status">
          <strong>Account created</strong>
          <p>{success.username} — {success.email}</p>
        </div>
      )}
    </div>
  )
}
