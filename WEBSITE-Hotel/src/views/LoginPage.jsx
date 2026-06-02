import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { hotelAPI } from '../api/api';
import { useNotification } from '../state/NotificationContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await hotelAPI.loginCustomer(formData);
      localStorage.setItem('customer_token', response.data.access_token);
      localStorage.setItem('customer_user', JSON.stringify(response.data.user));
      
      showNotification('success', 'Logged in successfully');
      setTimeout(() => {
        window.location.href = '/'; // Refresh to load avatar
      }, 1000);
    } catch (err) {
      showNotification('error', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-32 flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-hotel-dark">Sign In</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-gold rounded-lg py-3">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-gold-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
