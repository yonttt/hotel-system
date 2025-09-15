import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import EvaGroupLogo from '../components/EvaGroupLogo'
// import { getRecaptchaSiteKey, RECAPTCHA_CONFIG } from '../config/recaptcha' // Commented out for development

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  // const [recaptchaToken, setRecaptchaToken] = useState('') // Commented out for development
  // const recaptchaRef = useRef(null) // Commented out for development
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
    // if (!recaptchaToken) {
    //   setError('Please complete the reCAPTCHA verification')
    //   setLoading(false)
    //   return
    // }

    const result = await login(formData.username, formData.password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
      // Reset reCAPTCHA on login failure - commented out for development
      // if (window.grecaptcha) {
      //   window.grecaptcha.reset()
      //   setRecaptchaToken('')
      // }
    }
    
    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <EvaGroupLogo size={120} />
        
        <h1 className="login-title">EVA GROUP</h1>
        <p className="login-subtitle">Eva Hotel Management Group</p>
        
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '2rem', color: '#1e293b' }}>
          Authorized Access
        </h2>

        {error && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            padding: '0.75rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            fontSize: '0.875rem'
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

          {/* Commented out for development - reCAPTCHA container */}
          {/* <div className="recaptcha-container">
            <div ref={recaptchaRef}></div>
          </div> */}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center', 
          fontSize: '0.875rem', 
          color: '#64748b' 
        }}>
          © 2025 Eva Group Hotel Management System
        </div>
      </div>
    </div>
  )
}

export default LoginPage