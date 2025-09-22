import { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('user_role');
      
      if (token) {
        apiService.setAuthToken(token);
        try {
          const response = await apiService.getCurrentUser();
          const userData = response.data;
          
          // Verify user data matches stored role
          if (userData.role === storedRole) {
            setUser(userData);
          } else {
            // If roles don't match, force re-login
            throw new Error('User role mismatch');
          }
        } catch (error) {
          console.error('Session validation error:', error);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user_role');
          apiService.setAuthToken(null);
        }
      }
    };

    checkUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials.username, credentials.password);
      
      if (response.status !== 200) {
        throw new Error(`Login failed with status: ${response.status}`);
      }
      
      const { access_token, user } = response.data;
      
      if (!access_token) {
        throw new Error('No access token received');
      }
      
      localStorage.setItem('token', access_token);
      apiService.setAuthToken(access_token);
      
      // If we have user info, store it; otherwise fetch it
      if (user) {
        localStorage.setItem('user_role', user.role);
        setUser(user);
      } else {
        try {
          const userResponse = await apiService.getCurrentUser();
          const userData = userResponse.data;
          localStorage.setItem('user_role', userData.role);
          setUser(userData);
        } catch (userError) {
          console.error('Could not fetch user data:', userError);
          // Still consider login successful if we have the token
        }
      }
      
      return { 
        success: true,
        role: user?.role || 'staff' // Default role if not available
      };
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user_role');
      apiService.setAuthToken(null);
      
      // Handle different error cases
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Invalid username or password'
        };
      } else if (error.response?.data?.detail) {
        return {
          success: false,
          error: error.response.data.detail
        };
      } else if (error.message) {
        return {
          success: false,
          error: error.message
        };
      } else {
        return {
          success: false,
          error: 'Unable to connect to the server. Please try again.'
        };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    apiService.setAuthToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      login, 
      logout, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;