import React, { useState } from 'react'
import './App.css'
import SignUp from './components/SignUp'
import Notes from './components/Notes'
import Login from './components/Login'

function App() {
  const [showSignup, setShowSignup] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('current_user')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })

  return (
    <div className="app-root">
      <header className={`app-header ${!showSignup ? 'centered' : ''}`}>
        <div>
          <h1>Online Studying Platform</h1>

          <h2>{showSignup ? 'Sign up' : 'Homepage'}</h2>
          <p className="subtitle">{showSignup ? 'Create an account to get started' : 'Welcome to our Online Studying Website'}</p>

          <div className="title-actions">
            <button className="nav-button" onClick={() => { setShowSignup(false); setShowLogin(false) }}>Home</button>
            <button className="nav-button" onClick={() => { setShowLogin(true); setShowSignup(false) }}>Log In</button>
          </div>
        </div>

        <div className="header-actions">
          {/* intentionally empty */}
        </div>
      </header>

      <section className="card">
        {showLogin ? (
          <Login onLogin={(user) => { setCurrentUser(user); setShowLogin(false); setShowSignup(false) }} onShowSignUp={() => { setShowSignup(true); setShowLogin(false) }} />
        ) : showSignup ? (
          <SignUp onSignUp={(user) => { setCurrentUser(user); setShowSignup(false) }} onHome={() => setShowSignup(false)} />
        ) : (
          <div className="hero">
            <p>“Tired of struggling to keep your studies organized? With Online Studying Platform,
               you can learn anytime, anywhere, and connect with tools that make studying easier 
               and more effective. Join thousands of learners who are already improving their 
               skills—sign up today and start your journey toward smarter studying!”</p>
            <button className="study-submit" onClick={() => setShowSignup(true)}>Get started</button>
            <div style={{ marginTop: 16 }}>
              {currentUser ? <Notes /> : <p className="empty">Create an account to see your saved notes.</p>}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default App
