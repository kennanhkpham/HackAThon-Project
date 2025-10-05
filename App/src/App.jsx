import React, { useState, useEffect } from 'react';
import './App.css';
import SignUp from './components/SignUp';
import Notes from './components/Notes';
import Login from './components/Login';

function App() {
  const [view, setView] = useState('home'); // 'home' | 'login' | 'signup' | 'notes'
  const [currentUser, setCurrentUser] = useState(null);

  // Load user safely from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === 'object') setCurrentUser(parsed);
      }
    } catch (err) {
      console.warn('Error loading user:', err);
    }
  }, []);

  // Set browser tab title
  useEffect(() => {
    document.title = currentUser
        ? `Welcome, ${currentUser.username}`
        : 'Online Studying Platform';
  }, [currentUser]);

  const signOut = () => {
    try {
      localStorage.removeItem('current_user');
    } catch (err) {
      console.warn('Error clearing user:', err);
    }
    setCurrentUser(null);
    setView('home');
  };

  const renderContent = () => {
    if (currentUser) return <Notes />;

    switch (view) {
      case 'login':
        return (
            <Login
                onLogin={(user) => {
                  setCurrentUser(user);
                  localStorage.setItem('current_user', JSON.stringify(user));
                  setView('notes');
                }}
                onShowSignUp={() => setView('signup')}
            />
        );
      case 'signup':
        return (
            <SignUp
                onSignUp={(user) => {
                  setCurrentUser(user);
                  localStorage.setItem('current_user', JSON.stringify(user));
                  setView('notes');
                }}
                onHome={() => setView('home')}
            />
        );
      default:
        return (
            <div className="hero">
              <p>
                “Tired of struggling to keep your studies organized? With Online Studying
                Platform, you can learn anytime, anywhere, and connect with tools that make
                studying easier and more effective. Join thousands of learners already improving
                their skills — sign up today and start your journey toward smarter studying!”
              </p>
              <button className="study-submit" onClick={() => setView('signup')}>
                Get Started
              </button>
            </div>
        );
    }
  };

  return (
      <div className="app-root">
        <header className="app-header">
          <h1>Online Studying Platform</h1>
          <p className="subtitle">
            {view === 'signup'
                ? 'Create an account to get started'
                : view === 'login'
                    ? 'Welcome back — log in to continue learning'
                    : 'Smarter studying starts here'}
          </p>

          <div className="title-actions">
            {!currentUser && (
                <button className="nav-button" onClick={() => setView('home')}>
                  Home
                </button>
            )}

            {!currentUser ? (
                <>
                  <button className="nav-button" onClick={() => setView('login')}>
                    Log In
                  </button>
                  <button className="nav-button secondary" onClick={() => setView('signup')}>
                    Sign Up
                  </button>
                </>
            ) : (
                <div className="user-section">
                  <span className="user-badge">Welcome, {currentUser.username}!</span>
                  <button className="nav-button" onClick={signOut}>
                    Sign Out
                  </button>
                </div>
            )}
          </div>
        </header>

        <main className="card">{renderContent()}</main>

        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Online Studying Platform. All rights reserved.</p>
        </footer>
      </div>
  );
}

export default App;



