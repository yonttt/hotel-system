-- Deskripsi & spesifikasi kamar Hotel New Idola (sesuai Traveloka)
-- Jalankan di server:  sudo mysql hotel_system < hotel-python-backend/seed_new_idola_descriptions.sql
SET NAMES utf8mb4;

-- STANDARD (16 m2, 1 single bed)
UPDATE `room_categories` SET
  description = 'Kamar Standard seluas 16 m2 yang bersih dan nyaman, cocok untuk beristirahat setelah seharian beraktivitas. Dilengkapi 1 single bed, AC, TV, shower, dan area tempat duduk, serta akses WiFi gratis. Pilihan hemat untuk backpacker maupun tamu perjalanan bisnis.',
  room_size = '16 m²',
  bed_type  = '1 Single Bed',
  capacity  = 2,
  amenities = 'WiFi Gratis, AC, TV, Shower, Area Tempat Duduk'
WHERE hotel_name = 'HOTEL NEW IDOLA' AND category_code = 'STD';

-- DELUXE (18 m2, 1 double bed)
UPDATE `room_categories` SET
  description = 'Kamar Deluxe seluas 18 m2 dengan 1 double bed yang lebih lega dan nyaman. Dilengkapi AC, TV, shower dengan air panas, area tempat duduk, dan WiFi gratis. Ideal untuk pasangan atau tamu yang menginginkan kenyamanan lebih.',
  room_size = '18 m²',
  bed_type  = '1 Double Bed',
  capacity  = 2,
  amenities = 'WiFi Gratis, AC, TV, Shower, Air Panas, Area Tempat Duduk'
WHERE hotel_name = 'HOTEL NEW IDOLA' AND category_code = 'DLX';

-- SUPERIOR (23 m2, 1 double bed)
UPDATE `room_categories` SET
  description = 'Nikmati kamar yang lebih besar untuk perjalanan Anda. Kamar Superior seluas 23 m2 dengan 1 double bed menawarkan ruang yang lebih luas dan lapang, dilengkapi AC, TV, shower air panas, area tempat duduk, dan WiFi gratis.',
  room_size = '23 m²',
  bed_type  = '1 Double Bed',
  capacity  = 2,
  amenities = 'WiFi Gratis, AC, TV, Shower, Air Panas, Area Tempat Duduk'
WHERE hotel_name = 'HOTEL NEW IDOLA' AND category_code = 'SPR';

-- EXECUTIVE / EKSEKUTIF (24 m2, 1 double bed atau 2 twin)
UPDATE `room_categories` SET
  description = 'Kamar Executive seluas 24 m2, tipe terluas dengan pilihan 1 double bed atau 2 ranjang twin, fleksibel untuk keluarga maupun rekan perjalanan bisnis. Dilengkapi AC, TV, shower air panas, area tempat duduk, dan WiFi gratis.',
  room_size = '24 m²',
  bed_type  = '1 Double Bed / 2 Twin',
  capacity  = 2,
  amenities = 'WiFi Gratis, AC, TV, Shower, Air Panas, Area Tempat Duduk'
WHERE hotel_name = 'HOTEL NEW IDOLA' AND category_code = 'EXE';

SELECT category_code, category_name, room_size, bed_type, capacity, amenities
FROM `room_categories`
WHERE hotel_name = 'HOTEL NEW IDOLA' AND category_code IN ('STD','DLX','SPR','EXE');

-- ============ DESKRIPSI HOTEL (tabel hotels) ============
-- Tambah kolom description bila belum ada (aman untuk dijalankan ulang).
ALTER TABLE `hotels` ADD COLUMN IF NOT EXISTS `description` TEXT NULL;

UPDATE `hotels` SET
  description = 'Hotel New Idola berada di kawasan Jalan Pramuka Raya No. 26, Matraman. Hotel bujet ini cocok sebagai akomodasi backpacker ataupun tamu yang sedang dalam perjalanan bisnis. Setiap kamar dilengkapi dengan fasilitas modern, seperti AC, TV, hingga akses WiFi. Tersedia pula ruang TV umum dan restoran bagi setiap tamu. Perpustakaan Nasional dan Stasiun Kramat adalah tempat terdekat dari Hotel New Idola.'
WHERE name = 'HOTEL NEW IDOLA';

SELECT name, LEFT(description, 70) AS description_preview FROM `hotels` WHERE name = 'HOTEL NEW IDOLA';

