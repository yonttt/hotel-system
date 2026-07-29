-- Deskripsi & spesifikasi Hotel New Idola (sesuai Traveloka)
-- Jalankan di server:  sudo mysql hotel_system < hotel-python-backend/seed_new_idola_descriptions.sql
SET NAMES utf8mb4;

-- Kolom untuk menyembunyikan tipe kamar dari website (tanpa mematikan is_active operasional).
ALTER TABLE `room_categories` ADD COLUMN IF NOT EXISTS `show_on_website` TINYINT(1) DEFAULT 1;

-- ============ DESKRIPSI KAMAR ============

-- STANDARD (16 m2, 1 single bed)
UPDATE `room_categories` SET
  description = 'Kamar Standard seluas 16 m2 yang pas untuk backpacker, cukup untuk beristirahat dengan nyaman setelah seharian beraktivitas. Dilengkapi 1 single bed, AC, WiFi, TV, shower dengan toiletries, serta air minum kemasan gratis.',
  room_size = '16 m²',
  bed_type  = '1 Single Bed',
  capacity  = 2,
  amenities = 'WiFi Gratis, AC, TV, Shower, Air Minum Gratis'
WHERE hotel_name = 'HOTEL NEW IDOLA' AND category_code = 'STD';

-- DELUXE (18 m2, 1 double bed)
UPDATE `room_categories` SET
  description = 'Kamar Deluxe seluas 18 m2 untuk Anda yang menginginkan ruang lebih luas. Menggunakan 1 double bed dengan fasilitas AC, WiFi, TV, shower air panas dan toiletries, serta air minum kemasan gratis.',
  room_size = '18 m²',
  bed_type  = '1 Double Bed',
  capacity  = 2,
  amenities = 'WiFi Gratis, AC, TV, Shower, Air Panas, Air Minum Gratis'
WHERE hotel_name = 'HOTEL NEW IDOLA' AND category_code = 'DLX';

-- SUPERIOR (23 m2, 1 double bed)
UPDATE `room_categories` SET
  description = 'Kamar Superior seluas 23 m2 yang lebih lega dan lapang. Dilengkapi 1 double bed, AC, WiFi, TV kabel, lemari, dan sofa untuk bersantai sambil menikmati teh atau kopi, serta air minum kemasan gratis.',
  room_size = '23 m²',
  bed_type  = '1 Double Bed',
  capacity  = 2,
  amenities = 'WiFi Gratis, AC, TV Kabel, Lemari, Sofa, Air Minum Gratis'
WHERE hotel_name = 'HOTEL NEW IDOLA' AND category_code = 'SPR';

-- EXECUTIVE (24 m2, 1 double bed atau 2 twin)
UPDATE `room_categories` SET
  description = 'Kamar Executive seluas 24 m2, tipe terluas dengan pilihan 1 double bed atau 2 twin bed. Dilengkapi AC, WiFi, TV kabel, meja kerja, dan mesin pembuat teh/kopi, nyaman untuk keluarga maupun perjalanan bisnis.',
  room_size = '24 m²',
  bed_type  = '1 Double Bed / 2 Twin',
  capacity  = 2,
  amenities = 'WiFi Gratis, AC, TV Kabel, Meja Kerja, Pembuat Teh/Kopi'
WHERE hotel_name = 'HOTEL NEW IDOLA' AND category_code = 'EXE';

SELECT category_code, category_name, room_size, bed_type, capacity, amenities
FROM `room_categories`
WHERE hotel_name = 'HOTEL NEW IDOLA' AND category_code IN ('STD','DLX','SPR','EXE');

-- ============ DESKRIPSI & KONTAK HOTEL ============
-- Tambah kolom description & facilities bila belum ada (aman untuk dijalankan ulang).
ALTER TABLE `hotels` ADD COLUMN IF NOT EXISTS `description` TEXT NULL;
ALTER TABLE `hotels` ADD COLUMN IF NOT EXISTS `facilities` VARCHAR(500) NULL;

UPDATE `hotels` SET
  description = 'Hotel New Idola adalah hotel bujet yang hadir untuk menjawab kebutuhan akomodasi terjangkau di Jakarta. Berlokasi strategis tepat di pinggir Jalan Pramuka Raya, Matraman, hotel ini mudah ditemukan dan dekat dengan Stasiun Senen, Stasiun Jatinegara, Pasar Pramuka, serta ITC Cempaka Putih. Sangat cocok untuk backpacker maupun pelancong bisnis, Hotel New Idola menawarkan kenyamanan yang dibalut kesederhanaan. Setiap kamar dilengkapi AC, WiFi, TV kabel, dan pembuat teh/kopi, dengan kamar mandi ber-shower dan toiletries. Tersedia pula restoran New Idola Restaurant (menu Indonesian dan Chinese Food), area parkir luas, Ruang TV umum, lift, dan resepsionis 24 jam. Check-in mulai pukul 14.00 dan check-out sebelum pukul 12.00.',
  facilities = 'WiFi Gratis, Restoran, Area Parkir, Resepsionis 24 Jam, AC, Lift, Layanan Kamar, Ruang TV',
  address = 'Jalan Pramuka Raya No. 26, Matraman, Jakarta Timur, DKI Jakarta 13120'
WHERE name = 'HOTEL NEW IDOLA';

SELECT name, facilities, LEFT(description, 70) AS description_preview FROM `hotels` WHERE name = 'HOTEL NEW IDOLA';
