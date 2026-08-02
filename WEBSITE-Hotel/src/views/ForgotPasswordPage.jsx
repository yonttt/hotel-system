import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { hotelAPI } from '../api/api';
import { useNotification } from '../state/NotificationContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // The backend always responds the same way (no account enumeration),
      // so on success we simply show the "check your email" state.
      await hotelAPI.forgotPassword(email);
      setSent(true);
    } catch {
      showNotification('error', 'Terjadi kesalahan. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-32 flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        {sent ? (
          <div className="text-center">
            <MailCheck size={44} className="text-gold-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-hotel-dark">Periksa Email Anda</h2>
            <p className="text-gray-600 text-sm mb-6">
              Jika email <span className="font-semibold">{email}</span> terdaftar, kami telah
              mengirim tautan untuk mengatur ulang kata sandi. Tautan berlaku selama 30 menit.
            </p>
            <Link to="/login" className="btn-gold rounded-lg inline-block px-6 py-2.5">
              Kembali ke Masuk
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-2 text-hotel-dark">Lupa Kata Sandi</h2>
            <p className="text-center text-sm text-gray-600 mb-6">
              Masukkan email akun Anda. Kami akan mengirim tautan untuk membuat kata sandi baru.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-gold rounded-lg py-3">
                {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Ingat kata sandi Anda? <Link to="/login" className="text-gold-600 hover:underline">Masuk di sini</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
