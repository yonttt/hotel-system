import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../state/AuthContext'
import { useNotification } from '../state/NotificationContext'
import { useNavigate } from 'react-router-dom'
import EvaGroupLogo from '../ui/EvaGroupLogo'
import { getRecaptchaSiteKey, RECAPTCHA_CONFIG } from '../config/recaptcha'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const { showNotification } = useNotification()
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

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


