import React, { useState } from 'react'
import './App.css'
import SignUp from './components/SignUp'
import Notes from './components/Notes'
import Login from './components/Login'
import {useNavigate} from "react-router-dom";

function App() {
  const [showSignup, setShowSignup] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showHero, setShowHero] = useState(true)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('current_user')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return e;
    }
  })

  const signOut = () => {
    try {
      localStorage.removeItem('current_user')
    } catch (e) {}
    setCurrentUser(null)
    setShowLogin(false)
    setShowSignup(false)
    setShowHero(true)
  }
  const navigate = useNavigate();

  return (
    <div className="app-root">
      <header className={`app-header ${!showSignup ? 'centered' : ''}`}>
        <div>
          <h1>Online Studying Platform</h1>

          <h2>{showSignup ? 'Sign up' : 'Homepage'}</h2>
          <p className="subtitle">{showSignup ? 'Create an account to get started' : <p1>'Welcome to our Online Studying Website'</p1>}</p>

          <div className="title-actions">
            {!currentUser && (
              <button className="nav-button" onClick={() => { setShowSignup(false); setShowLogin(false); setShowHero(true) }}>Home</button>
            )}
            {!currentUser ? (
              <button className="nav-button" onClick={() => { setShowLogin(true); setShowSignup(false); setShowHero(false) }}>Log In</button>
            ) : (
              <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                <span className="user-badge">Welcome, {currentUser.username}!</span>
                <button className="nav-button" onClick={signOut}>Sign out</button>
              </div>
            )}
          </div>
        </div>

      </header>

      <section className="card">
        {currentUser ? (
          // If a user is signed in, show only Notes — no sign up sheet or prompt
          <Notes />
        ) : showLogin ? (
          <Login onLogin={(user) => { setCurrentUser(user); setShowLogin(false); setShowSignup(false) }} onShowSignUp={() => { setShowSignup(true); setShowLogin(false) }} />
        ) : showSignup ? (
          <SignUp onSignUp={(user) => { setCurrentUser(user); setShowSignup(false) }} onHome={() => setShowSignup(false)} />
        ) : (
          <div className="hero">
            <p>“Tired of struggling to keep your studies organized? With Online Studying Platform,
               you can learn anytime, anywhere, and connect with tools that make studying easier 
               and more effective. Join thousands of learners who are already improving their 
               skills—sign up today and start your journey toward smarter studying!”</p>
            <button className="study-submit" onClick={() => navigate("/signup")}>Get started</button>
            <div style={{ marginTop: 16 }}>
              {/* No prompt here unless you want one */}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default App
