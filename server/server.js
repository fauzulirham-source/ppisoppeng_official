import http from 'node:http';
import { URL } from 'node:url';
import db, { initDatabase } from './db.js';

// Initialize Database Tables & Seed Data
initDatabase();

const PORT = process.env.PORT || 5000;

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const json = body ? JSON.parse(body) : {};
        resolve(json);
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  try {
    // ==========================================
    // 1. ENDPOINTS KONTAK (Pesan Masuk)
    // ==========================================

    // GET /api/kontak - Daftar semua pesan
    if (pathname === '/api/kontak' && method === 'GET') {
      const rows = db.prepare('SELECT * FROM pesan_kontak ORDER BY created_at DESC').all();
      return sendJson(res, 200, { success: true, total: rows.length, data: rows });
    }

    // POST /api/kontak - Kirim pesan baru dari form kontak
    if (pathname === '/api/kontak' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { nama, email, whatsapp, subjek, pesan } = body;

      if (!nama || !pesan) {
        return sendJson(res, 400, { success: false, message: 'Nama dan pesan wajib diisi!' });
      }

      const stmt = db.prepare(`
        INSERT INTO pesan_kontak (nama, email, whatsapp, subjek, pesan, status)
        VALUES (?, ?, ?, ?, ?, 'Belum Dibaca')
      `);

      const result = stmt.run(
        nama,
        email || '-',
        whatsapp || '-',
        subjek || 'Informasi Umum',
        pesan
      );

      return sendJson(res, 201, {
        success: true,
        message: 'Pesan berhasil disimpan ke database!',
        id: result.lastInsertRowid,
      });
    }

    // PATCH /api/kontak/:id - Update status pesan (Sudah Dibaca, dll)
    if (pathname.startsWith('/api/kontak/') && method === 'PATCH') {
      const id = pathname.split('/')[3];
      const body = await parseJsonBody(req);
      const { status } = body;

      const stmt = db.prepare('UPDATE pesan_kontak SET status = ? WHERE id = ?');
      stmt.run(status || 'Sudah Dibaca', id);

      return sendJson(res, 200, { success: true, message: 'Status pesan berhasil diperbarui' });
    }

    // DELETE /api/kontak/:id - Hapus pesan
    if (pathname.startsWith('/api/kontak/') && method === 'DELETE') {
      const id = pathname.split('/')[3];
      const stmt = db.prepare('DELETE FROM pesan_kontak WHERE id = ?');
      stmt.run(id);

      return sendJson(res, 200, { success: true, message: 'Pesan berhasil dihapus' });
    }

    // ==========================================
    // 2. ENDPOINTS KEGIATAN
    // ==========================================

    // GET /api/kegiatan - Ambil semua kegiatan
    if (pathname === '/api/kegiatan' && method === 'GET') {
      const rows = db.prepare('SELECT * FROM kegiatan ORDER BY id DESC').all();
      return sendJson(res, 200, { success: true, total: rows.length, data: rows });
    }

    // POST /api/kegiatan - Tambah kegiatan baru
    if (pathname === '/api/kegiatan' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { kategori, judul, tanggal, lokasi, status, ringkasan, detail, foto, foto_placeholder, tags } = body;

      if (!judul || !kategori) {
        return sendJson(res, 400, { success: false, message: 'Judul dan kategori kegiatan wajib diisi!' });
      }

      const stmt = db.prepare(`
        INSERT INTO kegiatan (kategori, judul, tanggal, lokasi, status, ringkasan, detail, foto, foto_placeholder, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        kategori,
        judul,
        tanggal || 'Sesuai Jadwal',
        lokasi || 'Kabupaten Soppeng',
        status || 'Program Baru',
        ringkasan || judul,
        detail || '',
        foto || '',
        foto_placeholder || 'kegiatan-diklat-paskibra.jpg',
        tags || ''
      );

      return sendJson(res, 201, {
        success: true,
        message: 'Kegiatan baru berhasil disimpan ke database!',
        id: result.lastInsertRowid,
      });
    }

    // DELETE /api/kegiatan/:id - Hapus kegiatan
    if (pathname.startsWith('/api/kegiatan/') && method === 'DELETE') {
      const id = pathname.split('/')[3];
      const stmt = db.prepare('DELETE FROM kegiatan WHERE id = ?');
      stmt.run(id);

      return sendJson(res, 200, { success: true, message: 'Kegiatan berhasil dihapus' });
    }

    // ==========================================
    // 3. ENDPOINTS DATABASE ANGGOTA (Kustom)
    // ==========================================

    // GET /api/anggota - Daftar anggota kustom
    if (pathname === '/api/anggota' && method === 'GET') {
      const rows = db.prepare('SELECT * FROM anggota ORDER BY id DESC').all();
      return sendJson(res, 200, { success: true, total: rows.length, data: rows });
    }

    // POST /api/anggota - Tambah anggota baru
    if (pathname === '/api/anggota' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { nama, angkatan, nra, tempat_lahir, tempatTanggalLahir, sekolah, asalSekolah, alamat, tingkat, no_hp, noHp } = body;

      if (!nama || !angkatan) {
        return sendJson(res, 400, { success: false, message: 'Nama lengkap dan angkatan wajib diisi!' });
      }

      const stmt = db.prepare(`
        INSERT INTO anggota (nama, angkatan, nra, tempat_lahir, sekolah, alamat, tingkat, no_hp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        nama.trim(),
        String(angkatan).trim(),
        nra ? String(nra).trim() : '',
        tempatTanggalLahir || tempat_lahir || '',
        asalSekolah || sekolah || '',
        alamat || '',
        tingkat || 'Kabupaten',
        noHp || no_hp || ''
      );

      return sendJson(res, 201, {
        success: true,
        message: 'Data anggota berhasil ditambahkan ke database!',
        id: result.lastInsertRowid,
      });
    }

    // DELETE /api/anggota/:id - Hapus anggota kustom
    if (pathname.startsWith('/api/anggota/') && method === 'DELETE') {
      const id = pathname.split('/')[3];
      const stmt = db.prepare('DELETE FROM anggota WHERE id = ?');
      stmt.run(id);

      return sendJson(res, 200, { success: true, message: 'Data anggota berhasil dihapus' });
    }

    // Default 404
    return sendJson(res, 404, { success: false, message: 'Endpoint tidak ditemukan' });
  } catch (error) {
    console.error('Server Error:', error);
    return sendJson(res, 500, { success: false, message: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`[PPI Database Server] Berjalan aktif di http://localhost:${PORT}`);
});
