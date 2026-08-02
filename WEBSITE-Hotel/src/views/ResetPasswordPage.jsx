import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { hotelAPI } from '../api/api';
import { useNotification } from '../state/NotificationContext';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      showNotification('error', 'Kata sandi minimal 6 karakter.');
      return;
    }
    if (password !== confirm) {
      showNotification('error', 'Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setLoading(true);
    try {
      await hotelAPI.resetPassword(token, password);
      showNotification('success', 'Kata sandi berhasil diubah. Silakan masuk.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      showNotification('error', err.response?.data?.detail || 'Gagal mengubah kata sandi.');
    } finally {
      setLoading(false);
    }
  };

  // No token in the URL — the link was opened incorrectly or is incomplete.
  if (!token) {
    return (
      <div className="min-h-screen py-32 flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-2 text-hotel-dark">Tautan Tidak Valid</h2>
          <p className="text-gray-600 text-sm mb-6">
            Tautan reset tidak lengkap atau salah. Silakan minta tautan baru.
          </p>
          <Link to="/forgot-password" className="btn-gold rounded-lg inline-block px-6 py-2.5">
            Minta Tautan Baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32 flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-2 text-hotel-dark">Kata Sandi Baru</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Masukkan kata sandi baru untuk akun Anda.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi Baru</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Kata Sandi</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-gold rounded-lg py-3">
            {loading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          <Link to="/login" className="text-gold-600 hover:underline">Kembali ke Masuk</Link>
        </p>
      </div>
    </div>
  );
}
