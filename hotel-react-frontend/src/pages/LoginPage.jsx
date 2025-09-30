import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import EvaGroupLogo from '../components/EvaGroupLogo'
import { getRecaptchaSiteKey, RECAPTCHA_CONFIG } from '../config/recaptcha'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const recaptchaRef = useRef(null)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard')
    }
    
    // Initialize reCAPTCHA when component mounts
    const script = document.querySelector('script[src*="recaptcha"]')
    if (script && window.grecaptcha) {
      initializeRecaptcha()
    } else {
      // Wait for script to load with timeout
      let attempts = 0
      const checkRecaptcha = setInterval(() => {
        attempts++
        if (window.grecaptcha) {
          clearInterval(checkRecaptcha)
          initializeRecaptcha()
        } else if (attempts > 50) { // 5 seconds timeout
          clearInterval(checkRecaptcha)
          console.error('Failed to load Google reCAPTCHA')
          setError('Failed to load reCAPTCHA. Please refresh the page.')
        }
      }, 100)
      
      // Cleanup interval on unmount
      return () => clearInterval(checkRecaptcha)
    }
  }, [isAuthenticated, navigate])

  const initializeRecaptcha = () => {
    if (window.grecaptcha && window.grecaptcha.render) {
      window.grecaptcha.ready(() => {
        if (recaptchaRef.current) {
          window.grecaptcha.render(recaptchaRef.current, {
            sitekey: getRecaptchaSiteKey(),
            theme: RECAPTCHA_CONFIG.THEME,
            size: RECAPTCHA_CONFIG.SIZE,
            callback: (token) => {
              setRecaptchaToken(token)
            },
            'expired-callback': () => {
              setRecaptchaToken('')
            }
          })
        }
      })
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Clear any previous error
    setError('')

    // Validate form fields
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please enter both username and password')
      return
    }

    // Comment out reCAPTCHA validation for development
     if (!recaptchaToken) {
       setError('Please complete the reCAPTCHA verification')
       return
    }

    try {
      const result = await login({ 
        username: formData.username.trim(), 
        password: formData.password 
      })
      
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error || 'Login failed. Please try again.')
        // Reset form on error
        setFormData(prev => ({
          ...prev,
          password: ''
        }))
        // Reset reCAPTCHA on login failure
        if (window.grecaptcha) {
          window.grecaptcha.reset()
          setRecaptchaToken('')
        }
      }
    } catch (err) {
      setError('A system error occurred. Please try again later.')
      console.error('Login submission error:', err)
      // Reset form
      setFormData(prev => ({
        ...prev,
        password: ''
      }))
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <EvaGroupLogo size={80} />
        
        <h1 className="login-title">EVA GROUP</h1>
        <p className="login-subtitle">Hotel Management System</p>
        
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem', color: '#000000' }}>
          Authorized Access Only
        </h2>

        {error && (
          <div style={{ 
            background: '#fff2f2', 
            color: '#d32f2f',
            padding: '0.75rem 1rem',
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            border: '1px solid #ffcdd2',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <svg 
              style={{ flexShrink: 0 }} 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

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