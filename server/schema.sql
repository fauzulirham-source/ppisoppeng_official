-- ========================================================
-- SCHEMA DATABASE PPI SOPPENG (MySQL / SQLite Compatible)
-- Tabel: pesan_kontak & kegiatan
-- ========================================================

-- 1. TABEL PESAN KONTAK
CREATE TABLE IF NOT EXISTS pesan_kontak (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  whatsapp VARCHAR(50),
  subjek VARCHAR(100) DEFAULT 'Informasi Umum',
  pesan TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Belum Dibaca',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL KEGIATAN ORGANISASI
CREATE TABLE IF NOT EXISTS kegiatan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kategori VARCHAR(100) NOT NULL,
  judul VARCHAR(255) NOT NULL,
  tanggal VARCHAR(100) NOT NULL,
  lokasi VARCHAR(255) NOT NULL,
  status VARCHAR(100) NOT NULL,
  ringkasan TEXT NOT NULL,
  detail TEXT,
  foto_placeholder VARCHAR(255) DEFAULT 'kegiatan-diklat-paskibra.jpg',
  tags VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- SAMPLE DATA KEGIATAN
-- ========================================================
INSERT INTO kegiatan (kategori, judul, tanggal, lokasi, status, ringkasan, detail, foto_placeholder, tags)
VALUES
('Kaderisasi & Diklat', 'Pendidikan & Pelatihan Calon Paskibraka Kabupaten Soppeng', 'Juli - Agustus Setiap Tahun', 'Lapangan Gapis Watansoppeng & Pusat Diklat', 'Program Tahunan', 'Pendampingan, pembinaan fisik, mental kebangsaan, dan tata upacara bendera bagi putra-putri terpilih tingkat SMA/SMK se-Kabupaten Soppeng.', 'Pelaksanaan materi pembinaan, tata upacara bendera, wawasan kebangsaan, serta kedisiplinan berkarakter.', 'kegiatan-diklat-paskibra.jpg', 'Pelatihan, Kaderisasi, Paskibraka'),
('Upacara & Kenegaraan', 'Peringatan Detik-Detik Proklamasi Kemerdekaan RI di Kab. Soppeng', '17 Agustus Setiap Tahun', 'Lapangan Merdeka / Stadion Andi Wana, Watansoppeng', 'Agenda Nasional', 'Partisipasi aktif dalam pengawalan prosesi penaikan dan penurunan duplikat Sang Saka Merah Putih bersama Pemkab Soppeng.', 'Penugasan protokoler pasukan pengibar duplikat bendera pusaka Merah Putih di Kabupaten Soppeng.', 'kegiatan-upacara-17agustus.jpg', 'HUT RI, Upacara, Bela Negara'),
('Sosial Kemasyarakatan', 'Aksi Bakti Sosial & Kepedulian Lingkungan Purna Paskibraka', 'Bulan Bhakti Pemuda', 'Wilayah Kecamatan di Kabupaten Soppeng', 'Pengabdian Rutin', 'Kegiatan bakti sosial penyaluran bantuan kepada masyarakat, donor darah, dan aksi bersih lingkungan bersama pemuda daerah.', 'Bantuan logistik bagi warga prasejahtera, bakti lingkungan, serta aksi tanggap bencana daerah.', 'kegiatan-bakti-sosial.jpg', 'Bakti Sosial, Kepedulian, Masyarakat');
