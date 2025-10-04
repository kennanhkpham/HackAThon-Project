import React from 'react'

export default function Login({ onLogin, onShowSignUp }) {
  const [id, setId] = React.useState('') // email or username
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const findUser = (identifier) => {
    try {
      const users = JSON.parse(localStorage.getItem('demo_users') || '[]')
      return users.find(u => u.email === identifier || u.username === identifier)
    } catch (e) {
      return null
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    if (!id) return setError('Please enter your email or username')
    if (!password) return setError('Please enter your password')

    setLoading(true)
    setTimeout(() => {
      const user = findUser(id.trim())
      if (!user) {
        setError('No account found for that email or username')
        setLoading(false)
        return
      }

      // Demo behaviour: we don't store/check passwords in this demo.
      // Accept any password if user exists.
      try {
        localStorage.setItem('current_user', JSON.stringify({ email: user.email, username: user.username }))
      } catch (e) {}

      setLoading(false)
      if (typeof onLogin === 'function') onLogin({ email: user.email, username: user.username })
    }, 350)
  }

  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="signup-form" noValidate>
        <label htmlFor="id">Email or Username</label>
        <div className="field">
          <input id="id" value={id} onChange={(e) => setId(e.target.value)} placeholder="email or username" />
        </div>

        <label htmlFor="pw">Password</label>
        <div className="field">
          <input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="your password" />
        </div>

        {error && <div className="field-error">{error}</div>}

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit" className="study-submit">{loading ? 'Signing in...' : 'Sign in'}</button>
          <button type="button" className="clear-btn" onClick={() => { setId(''); setPassword(''); setError(null) }}>Reset</button>
        </div>

        <div>
            <p>Don't have an account?</p>
            {typeof onShowSignUp === 'function' && (
                <button type="button" className="nav-button" onClick={onShowSignUp}>Sign up</button>
            )}
        </div>
        
      </form>
      <p style={{ marginTop: 10, color: '#666' }}>Demo login: we only check that an account exists in your browser storage.</p>
    </div>
  )
}
