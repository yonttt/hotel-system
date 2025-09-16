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
  const [loading, setLoading] = useState(false)
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
    setLoading(true)
    setError('')

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    // Comment out reCAPTCHA validation for development
    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA verification')
      setLoading(false)
      return
    }

    const result = await login(formData.username, formData.password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
      // Reset reCAPTCHA on login failure
      if (window.grecaptcha) {
        window.grecaptcha.reset()
        setRecaptchaToken('')
      }
    }
    
    setLoading(false)
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
            background: '#f8f8f8', 
            color: '#cc0000', 
            padding: '0.6rem', 
            borderRadius: '6px', 
            marginBottom: '1rem',
            fontSize: '0.85rem',
            border: '1px solid #cc0000'
          }}>
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {/* reCAPTCHA container */}
          <div className="recaptcha-container">
            <div ref={recaptchaRef}></div>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
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