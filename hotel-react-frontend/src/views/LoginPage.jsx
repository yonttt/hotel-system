import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../state/AuthContext'
import { useNavigate } from 'react-router-dom'
import EvaGroupLogo from '../ui/EvaGroupLogo'
import { getRecaptchaSiteKey, RECAPTCHA_CONFIG } from '../config/recaptcha'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const recaptchaRef = useRef(null)
  const recaptchaWidgetId = useRef(null)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard')
    }
    
    // Initialize reCAPTCHA when component mounts
    const initializeRecaptcha = () => {
      if (!window.grecaptcha || !window.grecaptcha.render) {
        return false
      }

      // Check if already rendered
      if (recaptchaWidgetId.current !== null) {
        return true
      }

      // Check if ref exists and is empty
      if (recaptchaRef.current && !recaptchaRef.current.hasChildNodes()) {
        try {
          recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: getRecaptchaSiteKey(),
            theme: RECAPTCHA_CONFIG.THEME,
            size: RECAPTCHA_CONFIG.SIZE,
            callback: (token) => {
              setRecaptchaToken(token)
              setError('') // Clear any previous errors
            },
            'expired-callback': () => {
              setRecaptchaToken('')
              setError('reCAPTCHA expired. Please verify again.')
            },
            'error-callback': () => {
              setRecaptchaToken('')
              setError('reCAPTCHA error. Please try again.')
            }
          })
          return true
        } catch (err) {
          console.error('Error rendering reCAPTCHA:', err)
          return false
        }
      }
      return false
    }

    // Wait for grecaptcha to be ready
    if (window.grecaptcha && window.grecaptcha.ready) {
      window.grecaptcha.ready(() => {
        initializeRecaptcha()
      })
    } else {
      // Fallback: poll for grecaptcha availability
      let attempts = 0
      const maxAttempts = 30 // 3 seconds
      const checkInterval = setInterval(() => {
        attempts++
        if (window.grecaptcha && window.grecaptcha.ready) {
          clearInterval(checkInterval)
          window.grecaptcha.ready(() => {
            initializeRecaptcha()
          })
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval)
          console.error('Failed to load Google reCAPTCHA')
          setError('Failed to load reCAPTCHA. Please refresh the page.')
        }
      }, 100)
      
      return () => clearInterval(checkInterval)
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }))
    }, 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotification(prev => ({ ...prev, show: false }))

    // Validate form fields
    if (!formData.username.trim() || !formData.password.trim()) {
      showNotification('error', 'Please enter both username and password')
      return
    }

    // Validate reCAPTCHA token
    if (!recaptchaToken) {
      showNotification('error', 'Please complete the reCAPTCHA verification')
      return
    }

    try {
      const result = await login({ 
        username: formData.username.trim(), 
        password: formData.password 
      })
      
      if (result.success) {
        showNotification('success', 'Login berhasil! Mengalihkan...')
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      } else {
        const errorMsg = result.error || 'Username atau Password salah'
        showNotification('error', errorMsg)
        
        // Reset form on error
        setFormData(prev => ({
          ...prev,
          password: ''
        }))
        // Reset reCAPTCHA on login failure
        if (window.grecaptcha && recaptchaWidgetId.current !== null) {
          try {
            window.grecaptcha.reset(recaptchaWidgetId.current)
            setRecaptchaToken('')
          } catch (err) {
            console.error('Error resetting reCAPTCHA:', err)
          }
        }
      }
    } catch (err) {
      showNotification('error', 'A system error occurred. Please try again later.')
      console.error('Login submission error:', err)
      // Reset form
      setFormData(prev => ({
        ...prev,
        password: ''
      }))
      // Reset reCAPTCHA on error
      if (window.grecaptcha && recaptchaWidgetId.current !== null) {
        try {
          window.grecaptcha.reset(recaptchaWidgetId.current)
          setRecaptchaToken('')
        } catch (err) {
          console.error('Error resetting reCAPTCHA:', err)
        }
      }
    }
  }

  return (
    <div className="login-container" style={{ position: 'relative', overflowX: 'hidden' }}>
      
      {/* Slide-in Notification from Right */}
      <div 
        style={{
          position: 'fixed',
          top: '20px',
          right: notification.show ? '20px' : '-400px',
          width: '320px',
          padding: '16px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          zIndex: 9999,
          transition: 'right 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          borderLeft: `4px solid ${notification.type === 'success' ? '#10b981' : '#ef4444'}`
        }}
      >
        <div style={{ flexShrink: 0, marginTop: '2px' }}>
          {notification.type === 'success' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )}
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '600', color: '#1f2937' }}>
            {notification.type === 'success' ? 'Success' : 'Authentication Failed'}
          </h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.4' }}>
            {notification.message}
          </p>
        </div>
      </div>

      <div className="login-card">
        <EvaGroupLogo size={80} />
        
        <h1 className="login-title">EVA GROUP</h1>
        <p className="login-subtitle">Hotel Management System</p>
        
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem', color: '#000000' }}>
          Authorized Access Only
        </h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* reCAPTCHA container */}
          <div className="recaptcha-container">
            <div ref={recaptchaRef}></div>
          </div>

          <button 
            type="submit" 
            className="login-button"
          >
            Login
          </button>
        </form>

        <div style={{ 
          marginTop: '1.5rem', 
          textAlign: 'center', 
          fontSize: '0.8rem', 
          color: '#666666' 
        }}>
          © 2025 Eva Group Hotel Management System
        </div>
      </div>
    </div>
  )
}

export default LoginPage


