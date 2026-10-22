# Website Statis Landing Page - Purna Paskibraka Indonesia (PPI) Soppeng

Website profil resmi satu halaman (*single-page landing page*) untuk **Purna Paskibraka Indonesia (PPI) Kabupaten Soppeng**. Dirancang dengan tampilan yang rapi, berwibawa, modern, dan sepenuhnya responsif untuk perangkat ponsel (smartphone), tablet, maupun desktop.

---

## 🌟 Fitur Utama Website

1. **Navigasi Satu Halaman Terintegrasi (Smooth Scroll & Active Spy)**:
   - **Beranda**: Tajuk utama yang berwibawa, semboyan organisasi, kartu statistik (tahun pengabdian, purna paskibraka, kecamatan), serta showcase kehormatan merah putih.
   - **Tentang**: Sambutan resmi Ketua Pengurus Kabupaten, visi & misi, 4 pilar nilai kehormatan PPI, linimasa sejarah singkat, dasar hukum/SK kepengurusan, dan struktur inti pengurus.
   - **Kegiatan**: Program kerja terstruktur dengan filter kategori interaktif (*Kaderisasi & Diklat*, *Upacara & Kenegaraan*, *Sosial Kemasyarakatan*, *Pengembangan Diri*), kartu kegiatan dengan status, serta modal *popup* detail rundown.
   - **Galeri**: Galeri foto dokumentasi dengan filter kategori, kartu placeholder foto rapi, serta *interactive Lightbox modal* (preview ukuran besar, navigasi slide, dan rekomendasi ukuran).
   - **Kontak**: Kartu informasi resmi (alamat sekretariat, narahubung WhatsApp, email, jam piket, saluran media sosial) dilengkapi tombol **Salin Instan (Copy to Clipboard)** serta formulir aspirasi interaktif dengan opsi teruskan ke WhatsApp.
   - **FAQ (Tanya Jawab)**: Accordion pertanyaan umum seputar keanggotaan dan rekrutmen.

2. **Sistem Placeholder Aman & Mudah Diganti**:
   - Seluruh teks sejarah, alamat, prestasi, dan kontak menggunakan penanda format `[ ... ]` yang aman dan tidak mengarang data asli.
   - Tersedia tombol **"Sorot Placeholder"** di navigasi yang dapat diaktifkan untuk menyorot secara visual seluruh teks yang perlu dilengkapi.
   - Tersedia tombol **"Panduan Edit Data"** yang membuka panduan interaktif langsung di website.

3. **Desain & Palet Warna**:
   - **Merah PPI**: Melambangkan keberanian, semangat merah putih, dan patriotisme.
   - **Putih Bersih**: Melambangkan ketulusan dan kesucian pengabdian.
   - **Aksen Gelap & Charcoal**: Memberikan kesan formal, berwibawa, elegan, dan kokoh.
   - **Aksen Emas (Gold)**: Sentuhan kehormatan lencana Teratai dan Garuda Paskibraka.

---

## 📂 Struktur File Penting

```text
website-statis-ppi/
├── public/
│   ├── favicon.svg                  # Favicon website
│   ├── logo-ppi-soppeng.png         # Logo resmi PPI Kabupaten Soppeng (Hitam-Emas)
│   └── images/
│       ├── hero-paskibraka.jpg      # Foto banner utama pasukan pengibar bendera
│       └── [nama_foto_kegiatan.jpg] # Letakkan file foto dokumentasi kegiatan di sini
├── src/
│   ├── data/
│   │   └── siteData.js              # PUSAT SELURUH DATA TEKS, VISI, MISI, KONTAK & PLACEHOLDER
│   ├── components/
│   │   ├── Navbar.jsx               # Menu navigasi sticky & mobile drawer
│   │   ├── Hero.jsx                 # Bagian Beranda & Statistik
│   │   ├── Tentang.jsx              # Profil, Sambutan, Visi-Misi, Nilai & Sejarah
│   │   ├── Kegiatan.jsx             # Agenda program kegiatan & modal detail
│   │   ├── Galeri.jsx               # Galeri dokumentasi & Lightbox modal
│   │   ├── Faq.jsx                  # Tanya jawab seputar organisasi
│   │   ├── Kontak.jsx               # Informasi sekretariat, form pesan & maps
│   │   ├── Footer.jsx               # Footer, hak cipta & tautan cepat
│   │   ├── PpiLogo.jsx              # Lambang Teratai Paskibraka SVG resmi & fallback
│   │   ├── PhotoPlaceholder.jsx     # Komponen tempat foto yang adaptif
│   │   └── PlaceholderGuideModal.jsx# Modal pop-up panduan cara ganti data
│   ├── App.jsx                      # Perakitan komponen utama
│   ├── index.css                    # Desain sistem Tailwind & variabel warna
│   └── main.jsx                     # Titik masuk React
├── package.json
└── vite.config.js
```

---

## 🛠️ Cara Mengubah Konten Website

### 1. Mengganti Seluruh Teks & Data Organisasi (Terpusat)
Buka file:
```text
src/data/siteData.js
```
Di dalam file ini, Anda dapat langsung mengedit semua teks bertanda `[ ... ]` sesuai data asli PPI Kabupaten Soppeng:
- Nama Ketua dan kata sambutan
- Rumusan Visi & Misi resmi
- Sejarah pembentukan PPI Soppeng & nomor SK kepengurusan
- Jadwal, tanggal, dan lokasi kegiatan
- Alamat sekretariat, nomor WhatsApp, email, dan akun media sosial

### 2. Memasang File Logo Asli Organisasi
Website sudah menyertakan lambang Teratai PPI format vektor SVG bawaan yang sangat tajam. Jika Anda ingin menggunakan file gambar logo resmi organisasi (PNG/SVG):
1. Simpan file logo di: `public/logo-ppi.png`
2. Buka `src/data/siteData.js`, lalu ubah:
   ```javascript
   logoUrl: '/logo-ppi.png',
   ```

### 3. Memasukkan Foto Dokumentasi Kegiatan & Galeri
1. Masukkan file foto beresolusi tinggi (rekomendasi **1200 x 800 px**, rasio 3:2 atau 16:9) ke dalam folder `public/images/`.
2. Sesuaikan nama file di `src/data/siteData.js` pada bagian `kegiatan` atau `galeri` (misalnya `sampleImageUrl: '/images/galeri-upacara-1.jpg'`).

---

## 🚀 Menjalankan Website Secara Lokal

### Prasyarat
- Pastikan [Node.js](https://nodejs.org/) (versi 18+) sudah terpasang di komputer Anda.

### Menjalankan Mode Pengembangan (Development)
Buka terminal (PowerShell / Command Prompt) di folder proyek:
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```
Akses di peramban (browser):
```
http://localhost:5173/
```

### Membuat Berkas Siap Rilis (Production Build)
Untuk menghasilkan berkas HTML, CSS, dan JavaScript statis murni yang siap diunggah ke server hosting atau cPanel:
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run build"
```
Hasil build akan tersimpan di dalam folder `dist/`.

---

## 🌐 Panduan Deployment (Publikasi Online)

Folder `dist/` dapat langsung dipublikasikan secara gratis dan cepat ke berbagai platform:
- **Vercel / Netlify**: Hubungkan repositori GitHub atau unggah langsung folder `dist/`.
- **GitHub Pages**: Jalankan deploy pada branch `gh-pages` dari folder `dist/`.
- **cPanel / Web Hosting Biasa**: Unggah seluruh isi di dalam folder `dist/` ke direktori `public_html`.
