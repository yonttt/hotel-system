import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { hotelAPI } from '../api/api';
import { useNotification } from '../state/NotificationContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await hotelAPI.registerCustomer(formData);
      showNotification('success', 'Pendaftaran berhasil! Silakan masuk.');
      navigate('/login');
    } catch (err) {
      showNotification('error', err.response?.data?.detail || 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-32 flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-hotel-dark">Buat Akun</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" required value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
            <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-gold rounded-lg py-3">
            {loading ? 'Memproses...' : 'Buat Akun'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun? <Link to="/login" className="text-gold-600 hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  );
}
