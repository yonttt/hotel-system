import { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../ui/Layout';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const PUBLIC_SITE_URL = import.meta.env.VITE_PUBLIC_SITE_URL || 'http://localhost:5174';

// The app stores the JWT under the localStorage key `token` (see src/api/api.js).
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

// Each field maps to a key in the `website_content` table. The defaults mirror the
// public site's fallback text, so the editor shows the real current content even
// before anything has been saved.
// Ordered top-to-bottom to mirror how the sections appear on the public homepage,
// so the nav reads like a map of the page.
const SECTIONS = [
  {
    key: 'hero',
    label: 'Banner Utama',
    icon: '🖼️',
    hint: 'Judul besar & gambar paling atas',
    fields: [
      { key: 'hero_title', label: 'Judul Besar', type: 'text' },
      { key: 'hero_subtitle', label: 'Subjudul', type: 'textarea' },
      { key: 'hero_image_1', label: 'Gambar Banner', type: 'image' },
    ],
  },
  {
    key: 'about',
    label: 'Tentang Kami',
    icon: 'ℹ️',
    hint: 'Bagian profil & foto hotel',
    fields: [
      { key: 'about_subtitle', label: 'Label Kecil (di atas judul)', type: 'text' },
      { key: 'about_title', label: 'Judul', type: 'text' },
      { key: 'about_description', label: 'Deskripsi', type: 'textarea' },
      { key: 'about_image', label: 'Foto', type: 'image' },
    ],
  },
  {
    key: 'rooms',
    label: 'Judul Bagian Kamar',
    icon: '🏷️',
    hint: 'Teks di atas daftar kamar',
    fields: [
      { key: 'rooms_subtitle', label: 'Label Kecil', type: 'text' },
      { key: 'rooms_title', label: 'Judul', type: 'text' },
      { key: 'rooms_description', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  {
    key: 'offers',
    label: 'Penawaran Spesial',
    icon: '🎁',
    hint: 'Judul bagian promo',
    fields: [
      { key: 'offers_subtitle', label: 'Label Kecil', type: 'text' },
      { key: 'offers_title', label: 'Judul', type: 'text' },
      { key: 'offers_description', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  {
    key: 'contact',
    label: 'Kontak (Footer)',
    icon: '📞',
    hint: 'Alamat, telepon & email',
    fields: [
      { key: 'contact_address', label: 'Alamat', type: 'textarea' },
      { key: 'contact_phone', label: 'Telepon', type: 'text' },
      { key: 'contact_email', label: 'Email', type: 'text' },
    ],
  },
];

// Special tabs handled by their own editors (write to room_categories / hotels,
// not the website_content key-value table).
const ROOMS_TAB = {
  key: '__rooms__',
  label: 'Foto & Deskripsi Kamar',
  icon: '📸',
  hint: 'Foto, deskripsi, stok tiap tipe kamar',
};

const HOTELS_TAB = {
  key: '__hotels__',
  label: 'Daftar Hotel',
  icon: '🏨',
  hint: 'Tampilkan & edit hotel di halaman Hotel',
};

const DEFAULT_CONTENT = {
  hero_title: 'Kemewahan yang Tak Terlupakan',
  hero_subtitle: 'Rasakan pengalaman menginap terbaik dengan fasilitas premium',
  hero_image_1: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
  about_subtitle: 'Tentang Kami',
  about_title: 'Kepercayaan Adalah Bukti Dari Janji Yang Terpenuhi',
  about_description:
    'Kami adalah merek paling terpercaya dan dikenal secara luas yang telah melayani jutaan tamu domestik dan mancanegara setiap bulan selama lebih dari dua dekade.',
  about_image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
  rooms_subtitle: 'Akomodasi Premium',
  rooms_title: 'Kamar',
  rooms_description:
    'Pilih dari berbagai tipe kamar yang dirancang untuk kenyamanan dan kemewahan maksimal',
  offers_subtitle: 'Penawaran Spesial',
  offers_title: 'Promo Menarik untuk Anda',
  offers_description:
    'Nikmati penawaran eksklusif dan harga terbaik untuk pengalaman menginap yang tak terlupakan',
  contact_address: 'Jl. Pramuka Raya No.26, Jakarta Timur, DKI Jakarta',
  contact_phone: '+62 21 8580224',
  contact_email: 'info@hotelnewidola.com',
};

const inputStyle = {
  width: '100%',
  padding: '9px 11px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '13px',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const secondaryBtn = {
  padding: '8px 14px',
  background: '#fff',
  color: '#374151',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '13px',
  cursor: 'pointer',
};

const primaryBtn = (disabled) => ({
  padding: '8px 18px',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.7 : 1,
});

// A full-width vertical nav item — reads clearly as "a button for one page section".
const navBtn = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  textAlign: 'left',
  padding: '9px 11px',
  borderRadius: '8px',
  border: '1px solid',
  borderColor: active ? '#2563eb' : '#e5e7eb',
  background: active ? '#eff6ff' : '#fff',
  color: active ? '#1d4ed8' : '#374151',
  cursor: 'pointer',
  boxShadow: active ? 'inset 3px 0 0 #2563eb' : 'none',
});

const navGroupLabel = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  margin: '2px 2px 8px',
};

const navNumber = (active) => ({
  flexShrink: 0,
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontWeight: 700,
  background: active ? '#2563eb' : '#eef2f7',
  color: active ? '#fff' : '#6b7280',
});

// ---- Reusable image field: paste a URL or upload a file ----------------------
function ImageField({ value, onChange, onNotify, height = 90 }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_BASE_URL}/cms/upload`, {
        method: 'POST',
        headers: authHeaders(),
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        onChange(data.url);
        onNotify?.({ type: 'success', text: 'Gambar diunggah.' });
      } else {
        onNotify?.({ type: 'error', text: data.detail || 'Gagal mengunggah gambar.' });
      }
    } catch {
      onNotify?.({ type: 'error', text: 'Terjadi kesalahan saat mengunggah.' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '6px' }}>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          placeholder="https://... atau unggah gambar"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{ ...secondaryBtn, whiteSpace: 'nowrap', opacity: uploading ? 0.6 : 1 }}
        >
          {uploading ? 'Mengunggah…' : '⬆ Unggah'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </div>
      {value && (
        <img
          src={value}
          alt="preview"
          style={{ marginTop: '8px', width: '100%', maxHeight: height, objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }}
        />
      )}
    </div>
  );
}

// ---- Rooms editor: edit photo / description / discount per room category ------
function RoomsEditor({ onNotify, onSaved }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cms/rooms`, { headers: authHeaders() });
        if (res.ok) setRooms(await res.json());
        else onNotify?.({ type: 'error', text: 'Gagal memuat data kamar.' });
      } catch {
        onNotify?.({ type: 'error', text: 'Terjadi kesalahan saat memuat kamar.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [onNotify]);

  const setRoomField = (id, key, val) =>
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: val } : r)));

  const saveRoom = async (room) => {
    setSavingId(room.id);
    // Empty quota means "show all available rooms"; a number caps the online listing.
    const quotaEmpty = room.online_quota === '' || room.online_quota === null || room.online_quota === undefined;
    try {
      const res = await fetch(`${API_BASE_URL}/cms/rooms/${room.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          description: room.description ?? '',
          photo_url: room.photo_url ?? '',
          discount_percentage: Number(room.discount_percentage) || 0,
          room_size: room.room_size ?? '',
          bed_type: room.bed_type ?? '',
          capacity: Number(room.capacity) || 0,
          amenities: room.amenities ?? '',
          ...(quotaEmpty ? { clear_quota: true } : { online_quota: Number(room.online_quota) }),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onNotify?.({ type: 'success', text: `“${room.category_name}” tersimpan.` });
        onSaved?.();
      } else {
        onNotify?.({ type: 'error', text: data.detail || 'Gagal menyimpan kamar.' });
      }
    } catch {
      onNotify?.({ type: 'error', text: 'Terjadi kesalahan saat menyimpan kamar.' });
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div style={{ padding: '8px', color: '#6b7280', fontSize: '13px' }}>Memuat kamar…</div>;
  if (rooms.length === 0)
    return (
      <div style={{ padding: '8px', color: '#6b7280', fontSize: '13px' }}>
        Belum ada tipe kamar. Tambahkan lewat halaman <b>Master Tipe Kamar</b> terlebih dahulu.
      </div>
    );

  return (
    <div>
      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '14px' }}>
        Foto & deskripsi ini muncul di kartu kamar pada website. Diskon mengurangi harga publish.
      </p>
      {rooms.map((room) => (
        <div
          key={room.id}
          style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', marginBottom: '14px', background: '#f9fafb' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>{room.category_name}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                {room.category_code}{room.hotel_name ? ` · ${room.hotel_name}` : ''}
              </div>
            </div>
            {room.is_active === 0 || room.is_active === false ? (
              <span style={{ fontSize: '10px', background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '999px' }}>
                Nonaktif
              </span>
            ) : null}
          </div>

          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Foto Kamar</label>
          <ImageField
            value={room.photo_url}
            onChange={(v) => setRoomField(room.id, 'photo_url', v)}
            onNotify={onNotify}
            height={120}
          />

          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', margin: '12px 0 5px' }}>Deskripsi</label>
          <textarea
            value={room.description || ''}
            onChange={(e) => setRoomField(room.id, 'description', e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
            placeholder="Deskripsi singkat kamar…"
          />

          {/* Specs shown on the website room card */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Luas</label>
              <input
                type="text"
                value={room.room_size ?? ''}
                onChange={(e) => setRoomField(room.id, 'room_size', e.target.value)}
                style={inputStyle}
                placeholder="mis. 30 m²"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Tipe Kasur</label>
              <input
                type="text"
                value={room.bed_type ?? ''}
                onChange={(e) => setRoomField(room.id, 'bed_type', e.target.value)}
                style={inputStyle}
                placeholder="mis. King Size"
              />
            </div>
            <div style={{ width: '100px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Kapasitas</label>
              <input
                type="number"
                min="0"
                value={room.capacity ?? ''}
                onChange={(e) => setRoomField(room.id, 'capacity', e.target.value)}
                style={inputStyle}
                placeholder="Tamu"
              />
            </div>
          </div>

          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', margin: '12px 0 5px' }}>
            Fasilitas <span style={{ fontWeight: 400, color: '#9ca3af' }}>(pisahkan dengan koma)</span>
          </label>
          <input
            type="text"
            value={room.amenities ?? ''}
            onChange={(e) => setRoomField(room.id, 'amenities', e.target.value)}
            style={inputStyle}
            placeholder="WiFi Gratis, AC, TV LED, Room Service"
          />

          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Diskon (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={room.discount_percentage ?? 0}
                onChange={(e) => setRoomField(room.id, 'discount_percentage', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                Tampilkan online
              </label>
              <input
                type="number"
                min="0"
                value={room.online_quota ?? ''}
                onChange={(e) => setRoomField(room.id, 'online_quota', e.target.value)}
                style={inputStyle}
                placeholder="Semua"
              />
            </div>
          </div>

          {(() => {
            const physical = Number(room.physical_available) || 0;
            const quotaEmpty = room.online_quota === '' || room.online_quota === null || room.online_quota === undefined;
            const shown = quotaEmpty ? physical : Math.max(0, Math.min(physical, Number(room.online_quota) || 0));
            return (
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '8px', lineHeight: 1.5 }}>
                <span>Kamar fisik siap (status VR/VC): <b>{physical}</b></span>
                <br />
                <span>
                  Tampil di website: <b style={{ color: shown > 0 ? '#047857' : '#dc2626' }}>{shown} kamar</b>
                  {!quotaEmpty && physical > shown && ` · ${physical - shown} disisakan untuk walk-in`}
                  {quotaEmpty && ' (semua ditampilkan — kosongkan untuk menampilkan semua)'}
                </span>
              </div>
            );
          })()}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="button" onClick={() => saveRoom(room)} disabled={savingId === room.id} style={primaryBtn(savingId === room.id)}>
              {savingId === room.id ? 'Menyimpan…' : 'Simpan Kamar'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Hotels editor: manage which hotels appear on the website & their info ----
function HotelsEditor({ onNotify, onSaved }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cms/hotels`, { headers: authHeaders() });
        if (res.ok) setHotels(await res.json());
        else onNotify?.({ type: 'error', text: 'Gagal memuat data hotel.' });
      } catch {
        onNotify?.({ type: 'error', text: 'Terjadi kesalahan saat memuat hotel.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [onNotify]);

  const setHotelField = (id, key, val) =>
    setHotels((prev) => prev.map((h) => (h.id === id ? { ...h, [key]: val } : h)));

  const saveHotel = async (hotel) => {
    setSavingId(hotel.id);
    try {
      const res = await fetch(`${API_BASE_URL}/cms/hotels/${hotel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          address: hotel.address ?? '',
          phone: hotel.phone ?? '',
          email: hotel.email ?? '',
          photo_url: hotel.photo_url ?? '',
          description: hotel.description ?? '',
          show_on_website: !!hotel.show_on_website,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onNotify?.({ type: 'success', text: `“${hotel.name}” tersimpan.` });
        onSaved?.();
      } else {
        onNotify?.({ type: 'error', text: data.detail || 'Gagal menyimpan hotel.' });
      }
    } catch {
      onNotify?.({ type: 'error', text: 'Terjadi kesalahan saat menyimpan hotel.' });
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div style={{ padding: '8px', color: '#6b7280', fontSize: '13px' }}>Memuat hotel…</div>;
  if (hotels.length === 0)
    return <div style={{ padding: '8px', color: '#6b7280', fontSize: '13px' }}>Belum ada hotel.</div>;

  return (
    <div>
      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '14px' }}>
        Aktifkan “Tampilkan di website” agar hotel muncul di halaman <b>Hotel</b>. Hanya field tampilan
        yang diedit di sini (nama & data payroll diatur di Master Hotel).
      </p>
      {hotels.map((hotel) => {
        const shown = !!hotel.show_on_website;
        return (
          <div
            key={hotel.id}
            style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', marginBottom: '14px', background: '#f9fafb' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>{hotel.name}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>{hotel.room_count || 0} tipe kamar</div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: shown ? '#047857' : '#6b7280', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <input
                  type="checkbox"
                  checked={shown}
                  onChange={(e) => setHotelField(hotel.id, 'show_on_website', e.target.checked)}
                />
                Tampilkan di website
              </label>
            </div>

            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Foto Hotel</label>
            <ImageField
              value={hotel.photo_url}
              onChange={(v) => setHotelField(hotel.id, 'photo_url', v)}
              onNotify={onNotify}
              height={120}
            />

            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', margin: '12px 0 5px' }}>Deskripsi</label>
            <textarea
              value={hotel.description || ''}
              onChange={(e) => setHotelField(hotel.id, 'description', e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="Deskripsi singkat hotel…"
            />

            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', margin: '12px 0 5px' }}>Alamat</label>
            <input type="text" value={hotel.address || ''} onChange={(e) => setHotelField(hotel.id, 'address', e.target.value)} style={inputStyle} />

            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Telepon</label>
                <input type="text" value={hotel.phone || ''} onChange={(e) => setHotelField(hotel.id, 'phone', e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Email</label>
                <input type="text" value={hotel.email || ''} onChange={(e) => setHotelField(hotel.id, 'email', e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button type="button" onClick={() => saveHotel(hotel)} disabled={savingId === hotel.id} style={primaryBtn(savingId === hotel.id)}>
                {savingId === hotel.id ? 'Menyimpan…' : 'Simpan Hotel'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const WebsiteEditor = () => {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [activeSection, setActiveSection] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text }
  const [previewKey, setPreviewKey] = useState(0); // bump to remount/reload the preview iframe

  const notify = useCallback((msg) => {
    setMessage(msg);
    if (msg?.type === 'success') setTimeout(() => setMessage(null), 3000);
  }, []);

  const reloadPreview = useCallback(() => setPreviewKey((k) => k + 1), []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cms/content`, { headers: authHeaders() });
        if (res.ok) {
          const data = await res.json();
          const saved = {};
          data.forEach((item) => {
            if (item.setting_value !== null && item.setting_value !== undefined && item.setting_value !== '') {
              saved[item.setting_key] = item.setting_value;
            }
          });
          // Saved values override the defaults; unset keys keep their default text.
          setContent((prev) => ({ ...prev, ...saved }));
        }
      } catch (err) {
        console.error('Error fetching website content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const setField = (key, value) => setContent((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/cms/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        notify({ type: 'success', text: 'Perubahan tersimpan. Preview diperbarui di sebelah kanan.' });
        reloadPreview(); // reload the iframe so the public site refetches CMS content
      } else {
        const text =
          res.status === 403
            ? 'Anda tidak punya izin mengedit (perlu role admin/manager).'
            : 'Gagal menyimpan konten.';
        notify({ type: 'error', text });
      }
    } catch (err) {
      console.error('Error updating content:', err);
      notify({ type: 'error', text: 'Terjadi kesalahan saat menyimpan.' });
    } finally {
      setSaving(false);
    }
  };

  const isRoomsTab = activeSection === ROOMS_TAB.key;
  const isHotelsTab = activeSection === HOTELS_TAB.key;
  const isDataTab = isRoomsTab || isHotelsTab; // special editors that save per-item
  const activeFields = SECTIONS.find((s) => s.key === activeSection)?.fields || [];

  return (
    <Layout>
      <div style={{ padding: '16px' }}>
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937' }}>Editor Website</h1>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              Edit konten website publik di kiri, lihat hasilnya langsung di preview kanan.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="button" onClick={reloadPreview} style={secondaryBtn}>
              &#8635; Muat ulang preview
            </button>
            <a href={PUBLIC_SITE_URL} target="_blank" rel="noopener noreferrer" style={{ ...secondaryBtn, textDecoration: 'none', display: 'inline-block' }}>
              Buka di tab baru &#8599;
            </a>
            {!isDataTab && (
              <button type="button" onClick={handleSave} disabled={saving} style={primaryBtn(saving)}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            )}
          </div>
        </div>

        {message && (
          <div
            style={{
              padding: '10px 14px',
              marginBottom: '12px',
              borderRadius: '6px',
              backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
              color: message.type === 'success' ? '#065f46' : '#991b1b',
              fontSize: '13px',
            }}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '20px' }}>Memuat editor...</div>
        ) : (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch', height: '80vh' }}>
            {/* LEFT: editor panel */}
            <div
              style={{
                width: '440px',
                minWidth: '360px',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: '#fff',
                overflow: 'hidden',
              }}
            >
              {/* Section navigation — ordered top-to-bottom like the public page */}
              <div style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={navGroupLabel}>Bagian Halaman</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {SECTIONS.map((s, i) => {
                    const active = activeSection === s.key;
                    return (
                      <button key={s.key} type="button" onClick={() => setActiveSection(s.key)} style={navBtn(active)}>
                        <span style={navNumber(active)}>{i + 1}</span>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: 'block', fontSize: '13px', fontWeight: 600 }}>{s.icon} {s.label}</span>
                          <span style={{ display: 'block', fontSize: '11px', color: active ? '#3b82f6' : '#9ca3af', marginTop: '1px' }}>{s.hint}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ ...navGroupLabel, marginTop: '14px' }}>Kelola Data</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[ROOMS_TAB, HOTELS_TAB].map((t) => {
                    const active = activeSection === t.key;
                    return (
                      <button key={t.key} type="button" onClick={() => setActiveSection(t.key)} style={navBtn(active)}>
                        <span style={navNumber(active)}>{t.icon}</span>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: 'block', fontSize: '13px', fontWeight: 600 }}>{t.label}</span>
                          <span style={{ display: 'block', fontSize: '11px', color: active ? '#3b82f6' : '#9ca3af', marginTop: '1px' }}>{t.hint}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Body for the active section */}
              <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
                {!isDataTab && (
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1f2937', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px dashed #e5e7eb' }}>
                    Mengedit: {SECTIONS.find((s) => s.key === activeSection)?.icon} {SECTIONS.find((s) => s.key === activeSection)?.label}
                  </div>
                )}
                {isRoomsTab ? (
                  <RoomsEditor onNotify={notify} onSaved={reloadPreview} />
                ) : isHotelsTab ? (
                  <HotelsEditor onNotify={notify} onSaved={reloadPreview} />
                ) : (
                  activeFields.map((f) => (
                    <div key={f.key} style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                        {f.label}
                      </label>
                      {f.type === 'textarea' ? (
                        <textarea
                          value={content[f.key] || ''}
                          onChange={(e) => setField(f.key, e.target.value)}
                          rows={3}
                          style={{ ...inputStyle, resize: 'vertical' }}
                        />
                      ) : f.type === 'image' ? (
                        <ImageField value={content[f.key]} onChange={(v) => setField(f.key, v)} onNotify={notify} />
                      ) : (
                        <input
                          type="text"
                          value={content[f.key] || ''}
                          onChange={(e) => setField(f.key, e.target.value)}
                          style={inputStyle}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT: live preview of the public site */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <div
                style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '12px',
                  color: '#6b7280',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Preview Website Publik — {PUBLIC_SITE_URL}</span>
                <span style={{ color: '#9ca3af' }}>Pastikan website publik sedang berjalan</span>
              </div>
              <iframe
                key={previewKey}
                title="Preview Website Publik"
                src={`${PUBLIC_SITE_URL}/?cmsPreview=${previewKey}`}
                style={{ flex: 1, width: '100%', border: 'none' }}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WebsiteEditor;
