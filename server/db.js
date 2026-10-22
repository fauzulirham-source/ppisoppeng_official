import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for better concurrency
db.exec('PRAGMA journal_mode = WAL;');

// Initialize tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pesan_kontak (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      email TEXT,
      whatsapp TEXT,
      subjek TEXT DEFAULT 'Informasi Umum',
      pesan TEXT NOT NULL,
      status TEXT DEFAULT 'Belum Dibaca',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS kegiatan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kategori TEXT NOT NULL,
      judul TEXT NOT NULL,
      tanggal TEXT NOT NULL,
      lokasi TEXT NOT NULL,
      status TEXT NOT NULL,
      ringkasan TEXT NOT NULL,
      detail TEXT,
      foto TEXT,
      foto_placeholder TEXT DEFAULT 'kegiatan-diklat-paskibra.jpg',
      tags TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    db.exec('ALTER TABLE kegiatan ADD COLUMN foto TEXT;');
  } catch (e) {
    // column already exists
  }

  // Seed default kegiatan if empty
  const countRow = db.prepare('SELECT COUNT(*) as count FROM kegiatan').get();
  if (countRow.count === 0) {
    const seedInsert = db.prepare(`
      INSERT INTO kegiatan (kategori, judul, tanggal, lokasi, status, ringkasan, detail, foto_placeholder, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const defaultKegiatan = [
      {
        kategori: "Kaderisasi & Diklat",
        judul: "Pendidikan & Pelatihan Calon Paskibraka Kabupaten Soppeng",
        tanggal: "Juli - Agustus Setiap Tahun",
        lokasi: "Lapangan Gapis Watansoppeng & Pusat Diklat",
        status: "Program Tahunan",
        ringkasan: "Pendampingan, pembinaan fisik, mental kebangsaan, dan tata upacara bendera bagi putra-putri terpilih tingkat SMA/SMK se-Kabupaten Soppeng.",
        detail: "Pelaksanaan materi pembinaan, tata upacara bendera, wawasan kebangsaan, serta kedisiplinan berkarakter.",
        foto_placeholder: "kegiatan-diklat-paskibra.jpg",
        tags: "Pelatihan, Kaderisasi, Paskibraka"
      },
      {
        kategori: "Upacara & Kenegaraan",
        judul: "Peringatan Detik-Detik Proklamasi Kemerdekaan RI di Kab. Soppeng",
        tanggal: "17 Agustus Setiap Tahun",
        lokasi: "Lapangan Merdeka / Stadion Andi Wana, Watansoppeng",
        status: "Agenda Nasional",
        ringkasan: "Partisipasi aktif dalam pengawalan prosesi penaikan dan penurunan duplikat Sang Saka Merah Putih bersama Pemkab Soppeng.",
        detail: "Penugasan protokoler pasukan pengibar duplikat bendera pusaka Merah Putih di Kabupaten Soppeng.",
        foto_placeholder: "kegiatan-upacara-17agustus.jpg",
        tags: "HUT RI, Upacara, Bela Negara"
      },
      {
        kategori: "Sosial Kemasyarakatan",
        judul: "Aksi Bakti Sosial & Kepedulian Lingkungan Purna Paskibraka",
        tanggal: "Bulan Bhakti Pemuda",
        lokasi: "Wilayah Kecamatan di Kabupaten Soppeng",
        status: "Pengabdian Rutin",
        ringkasan: "Kegiatan bakti sosial penyaluran bantuan kepada masyarakat, donor darah, dan aksi bersih lingkungan bersama pemuda daerah.",
        detail: "Bantuan logistik bagi warga prasejahtera, bakti lingkungan, serta aksi tanggap bencana daerah.",
        foto_placeholder: "kegiatan-bakti-sosial.jpg",
        tags: "Bakti Sosial, Kepedulian, Masyarakat"
      },
      {
        kategori: "Kaderisasi & Diklat",
        judul: "Latihan Gabungan & Pra-Seleksi Calon Anggota Paskibraka",
        tanggal: "Maret - April",
        lokasi: "Gedung Pertemuan / Lapangan Olahraga Soppeng",
        status: "Pra-Seleksi",
        ringkasan: "Sosialisasi dan pengenalan materi dasar PBB serta wawasan kebangsaan ke sekolah-sekolah di seluruh kecamatan Kabupaten Soppeng.",
        detail: "Sosialisasi standar tinggi badan, PBB dasar, wawasan kebangsaan, dan tes fisik calon peserta.",
        foto_placeholder: "kegiatan-pra-seleksi.jpg",
        tags: "Sosialisasi, Sekolah, PBB"
      },
      {
        kategori: "Pengembangan Diri",
        judul: "Musyawarah Kabupaten (Muskab) & Silaturahmi Akbar PPI Soppeng",
        tanggal: "Musyawarah 5 Tahunan",
        lokasi: "Aula Kantor Pemerintah / Gedung Pertemuan Soppeng",
        status: "Organisasi",
        ringkasan: "Forum permusyawaratan tertinggi tingkat kabupaten untuk mengevaluasi program kerja serta memilih kepengurusan baru yang demokratis.",
        detail: "Musyawarah pengurus harian dan konsolidasi lintas angkatan purna paskibraka Kabupaten Soppeng.",
        foto_placeholder: "kegiatan-muskab-ppi.jpg",
        tags: "Muskab, Rapat Kerja, Alumni"
      }
    ];

    for (const item of defaultKegiatan) {
      seedInsert.run(
        item.kategori,
        item.judul,
        item.tanggal,
        item.lokasi,
        item.status,
        item.ringkasan,
        item.detail,
        item.foto_placeholder,
        item.tags
      );
    }
  }
}

export default db;
