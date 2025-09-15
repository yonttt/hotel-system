import { createContext, useContext, useState, useEffect } from 'react'
import { apiService } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      apiService.setAuthToken(token)
      apiService.getCurrentUser()
        .then(response => {
          setUser(response.data)
        })
        .catch(() => {
          // Token is invalid
          logout()
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (username, password) => {
    try {
      const response = await apiService.login(username, password)
      const { access_token } = response.data
      
      localStorage.setItem('token', access_token)
      setToken(access_token)
      apiService.setAuthToken(access_token)
      
      // Get user info
      const userResponse = await apiService.getCurrentUser()
      setUser(userResponse.data)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    apiService.setAuthToken(null)
  }

  const isAuthenticated = () => {
    return !!token && !!user
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}