import { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        apiService.setAuthToken(token);
        try {
          const response = await apiService.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          setUser(null);
          localStorage.removeItem('token');
          apiService.setAuthToken(null);
        }
      }
    };

    checkUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials.username, credentials.password);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      apiService.setAuthToken(access_token);
      
      const userResponse = await apiService.getCurrentUser();
      setUser(userResponse.data);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
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