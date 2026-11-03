/**
 * ============================================================================
 * DATA WEBSITE PURNA PASKIBRAKA INDONESIA (PPI) KABUPATEN SOPPENG
 * ============================================================================
 * File ini merupakan pusat seluruh teks, tautan, dan placeholder pada website.
 * Anda dapat dengan mudah mengubah atau melengkapi data asli organisasi di sini
 * tanpa perlu membongkar kode tampilan komponen.
 * 
 * Teks di dalam tanda kurung siku "[ ... ]" adalah placeholder yang disiapkan
 * untuk diganti dengan data resmi PPI Kabupaten Soppeng.
 */

import { databaseAnggota } from './databaseAnggota';

export const siteData = {
  // --- IDENTITAS & BRANDING ORGANISASI ---
  brand: {
    name: "Purna Paskibraka Indonesia",
    chapter: "Kabupaten Soppeng",
    shortName: "PPI SOPPENG",
    motto: "PPI BIG. Bersahaja, Inovatif, Global",
    subMotto: "Wadah persatuan, keteladanan, dan kaderisasi kepemudaan Purna Paskibraka di Bumi Latemmamala, Kabupaten Soppeng.",
    establishedYear: "[Tahun Berdiri PPI Soppeng, contoh: 1989]",
    badgeText: "Pengurus Kabupaten PPI Soppeng",
    // Logo resmi PPI Kabupaten Soppeng
    logoUrl: '/logo-ppi-soppeng.png', 
  },

  // --- STATISTIK RINGKAS / HIGHLIGHT HERO ---
  heroStats: [
    {
      label: "Tahun Pengabdian",
      value: "30+",
      caption: "Sejak awal perintisan di Soppeng",
    },
    {
      label: "Alumni Purna",
      value: `${databaseAnggota.length.toLocaleString('id-ID')}+`,
      caption: "Kader pemuda & purna paskibraka",
    },
    {
      label: "Kecamatan",
      value: "8",
      caption: "Jangkauan wilayah Kab. Soppeng",
    },
    {
      label: "Status Organisasi",
      value: "Aktif",
      caption: "Terdaftar & Berbadan Hukum Resmi",
    },
  ],

  // --- TENTANG ORGANISASI (PROFIL, VISI, MISI, SEJARAH) ---
  tentang: {
    tagline: "Tentang Organisasi",
    title: "Membina Karakter Kebangsaan & Kepemimpinan Pemuda Soppeng",
    
    // Sambutan / Catatan Pengurus
    sambutan: {
      jabatan: "Ketua Pengurus Kabupaten PPI Soppeng",
      nama: "Andi Nurazizah Ramadhani, S.H.",
      fotoPlaceholder: "/images/ketua-ppi.png",
      pesan: "Purna Paskibraka Indonesia Kabupaten Soppeng senantiasa berkomitmen menjaga marwah Pancasila, membina generasi muda yang disiplin, tangguh, berakhlak mulia, serta siap berkontribusi nyata bagi kemajuan daerah dan bangsa tercinta.",
      periode: "Masa Bakti 2026 - 2031",
    },

    // Visi
    visi: "Mewujudkan PPI Kabupaten Soppeng yang Solid, Berintegritas, Berprestasi, dan Berkelanjutan sebagai organisasi yang mampu melahirkan regenerasi berkualitas serta memberikan kontribusi nyata bagi daerah dan masyarakat.",

    // Misi
    misi: [
      {
        judul: "Memperkuat persatuan dan kekeluargaan",
        deskripsi: "Membangun PPI Soppeng sebagai rumah bersama bagi seluruh Purna Paskibraka, dengan mengedepankan kebersamaan, komunikasi, dan rasa saling menghargai antarangkatan.",
      },
      {
        judul: "Mewujudkan kepemimpinan yang berintegritas",
        deskripsi: "Menjalankan organisasi secara transparan, amanah, profesional, bertanggung jawab, serta menjadikan kepentingan organisasi sebagai prioritas utama.",
      },
      {
        judul: "Membangun sistem regenerasi yang berkelanjutan",
        deskripsi: "Mempersiapkan kader-kader muda melalui pembinaan, pendampingan, dan pemberian kesempatan untuk terlibat aktif dalam organisasi.",
      },
      {
        judul: "Meningkatkan kapasitas dan prestasi anggota",
        deskripsi: "Mendorong anggota untuk berkembang melalui pelatihan kepemimpinan, keterampilan, kewirausahaan, pendidikan, olahraga, seni, dan kegiatan positif lainnya.",
      },
      {
        judul: "Menghidupkan kembali peran sosial PPI",
        deskripsi: "Menjadikan PPI Soppeng lebih aktif dalam kegiatan kemanusiaan, sosial, lingkungan, kepemudaan, dan pengabdian kepada masyarakat.",
      },
      {
        judul: "Memperkuat sinergi dengan pemerintah dan stakeholder",
        deskripsi: "Membangun hubungan yang harmonis dan produktif dengan Pemerintah Kabupaten Soppeng, sekolah, organisasi kepemudaan, komunitas, serta seluruh pihak yang mendukung kemajuan PPI.",
      },
      {
        judul: "Mewujudkan organisasi yang terbuka dan aspiratif",
        deskripsi: "Membuka ruang bagi seluruh anggota untuk menyampaikan gagasan, aspirasi, kritik, dan inovasi demi terciptanya organisasi yang lebih baik.",
      },
    ],

    // Profil Singkat & Sejarah
    sejarah: {
      ringkasan: "Purna Paskibraka Indonesia (PPI) Kabupaten Soppeng merupakan wadah berhimpun kekeluargaan putra-putri terbaik daerah Bumi Latemmamala yang telah mengemban tugas mulia mengibarkan Sang Merah Putih.",
      dasarHukum: "Surat Keputusan Pengurus Provinsi PPI Sulawesi Selatan Nomor: SK.006 /PPI.23/IX/2026 (Masa Bakti 2026 - 2031)",
      kedudukan: "Bumi Latemmamala, Kabupaten Soppeng, Sulawesi Selatan",
    },

    // Struktur Pengurus Harian Resmi (SK.006 /PPI.23/IX/2026)
    strukturPengurus: [
      {
        jabatan: "Ketua",
        nama: "Andi Nurazizah Ramadhani, S.H.",
        angkatan: "Periode 2026 - 2031",
      },
      {
        jabatan: "Wakil Ketua I",
        nama: "Pardedi Agung Putra",
        angkatan: "Periode 2026 - 2031",
      },
      {
        jabatan: "Wakil Ketua II",
        nama: "Rahmat Farhan Asmir, S.H.",
        angkatan: "Periode 2026 - 2031",
      },
      {
        jabatan: "Sekretaris",
        nama: "Fauzul Irham Mahesa",
        angkatan: "Periode 2026 - 2031",
      },
      {
        jabatan: "Wakil Sekretaris I",
        nama: "Muhammad Fadhil",
        angkatan: "Periode 2026 - 2031",
      },
      {
        jabatan: "Bendahara",
        nama: "Andi Zaskia Zahra Al Humairah",
        angkatan: "Periode 2026 - 2031",
      },
      {
        jabatan: "Wakil Bendahara I",
        nama: "Miftahul Rahma, S.E.",
        angkatan: "Periode 2026 - 2031",
      },
    ],
  },

  // --- VERIFIKASI KEANGGOTAAN & DATABASE ANGGOTA ---
  verifikasiKeanggotaan: {
    tagline: "Verifikasi Keanggotaan",
    title: "Pencarian Database Anggota",
    deskripsi: "Silakan lakukan pencarian menggunakan Nama Lengkap atau Nomor KPA / NRA untuk memverifikasi status keanggotaan Purna Paskibraka Indonesia Kabupaten Soppeng serta data asal sekolah, alamat, dan kepemilikan nomor registrasi anggota (NRA).",
    inputPlaceholder: "Ketik Nama Lengkap, Nomor NRA, Asal Sekolah, atau Alamat...",
    daftarAnggota: databaseAnggota.map((anggota) => {
      const hasNra = Boolean(anggota.nra && String(anggota.nra).trim() !== '' && String(anggota.nra).trim() !== '0');
      return {
        id: `kpa-${anggota.angkatan}-${anggota.no}`,
        no: anggota.no,
        nama: anggota.nama,
        nomorKpa: hasNra ? String(anggota.nra).trim() : '-',
        nra: hasNra ? String(anggota.nra).trim() : '',
        hasNra: hasNra,
        angkatan: String(anggota.angkatan),
        status: hasNra ? "NRA Terdaftar" : "Belum Ada NRA",
        asalSekolah: anggota.asalSekolah || '',
        tempatTanggalLahir: anggota.tempatTanggalLahir || '',
        alamat: anggota.alamat || '',
        tingkat: anggota.tingkat || '',
        noHp: anggota.noHp || '',
        tugas: anggota.tingkat ? `Tingkat ${anggota.tingkat}` : `Purna Paskibraka Angkatan ${anggota.angkatan}`,
      };
    }),
  },

  // --- PROGRAM & KEGIATAN ORGANISASI ---
  kegiatan: {
    tagline: "Program & Agenda",
    title: "Kegiatan Pengabdian & Kaderisasi Kepemudaan",
    kategoriList: ["Semua", "Kaderisasi & Diklat", "Upacara & Kenegaraan", "Sosial Kemasyarakatan", "Pengembangan Diri"],
    
    daftar: [
      {
        id: "keg-1",
        kategori: "Kaderisasi & Diklat",
        judul: "[Pendidikan & Pelatihan Calon Paskibraka Kabupaten Soppeng]",
        tanggal: "[Contoh: Juli - Agustus Setiap Tahun]",
        lokasi: "[Contoh: Lapangan Gapis Watansoppeng & Pusat Diklat]",
        status: "Program Tahunan",
        ringkasan: "[Silakan isi deskripsi kegiatan ini. Contoh: Pendampingan, pembinaan fisik, mental kebangsaan, dan tata upacara bendera bagi putra-putri terpilih tingkat SMA/SMK se-Kabupaten Soppeng.]",
        detail: "[Silakan lengkapi detail teknis pelaksanaan, materi pembinaan, dan keterlibatan pelatih purna paskibraka di lapangan.]",
        fotoPlaceholderName: "kegiatan-diklat-paskibra.jpg",
        tags: ["Pelatihan", "Kaderisasi", "Paskibraka"],
      },
      {
        id: "keg-2",
        kategori: "Upacara & Kenegaraan",
        judul: "[Peringatan Detik-Detik Proklamasi Kemerdekaan RI di Kab. Soppeng]",
        tanggal: "[17 Agustus Setiap Tahun]",
        lokasi: "[Contoh: Lapangan Merdeka / Stadion Andi Wana, Watansoppeng]",
        status: "Agenda Nasional",
        ringkasan: "[Silakan isi deskripsi kegiatan ini. Contoh: Partisipasi aktif dalam pengawalan prosesi penaikan dan penurunan duplikat Sang Saka Merah Putih bersama Pemkab Soppeng.]",
        detail: "[Silakan lengkapi informasi susunan protokoler, pasukan pengibar, dan evaluasi upacara peringatan kemerdekaan.]",
        fotoPlaceholderName: "kegiatan-upacara-17agustus.jpg",
        tags: ["HUT RI", "Upacara", "Bela Negara"],
      },
      {
        id: "keg-3",
        kategori: "Sosial Kemasyarakatan",
        judul: "[Aksi Bakti Sosial & Kepedulian Lingkungan Purna Paskibraka]",
        tanggal: "[Contoh: Tanggal / Bulan Pelaksanaan]",
        lokasi: "[Contoh: Wilayah Kecamatan di Kabupaten Soppeng]",
        status: "Pengabdian Rutin",
        ringkasan: "[Silakan isi deskripsi kegiatan ini. Contoh: Kegiatan bakti sosial penyaluran bantuan kepada masyarakat, donor darah, dan aksi bersih lingkungan bersama pemuda daerah.]",
        detail: "[Silakan masukkan rincian sasaran penerima manfaat, kolaborator, dan hasil capaian aksi kemanusiaan.]",
        fotoPlaceholderName: "kegiatan-bakti-sosial.jpg",
        tags: ["Bakti Sosial", "Kepedulian", "Masyarakat"],
      },
      {
        id: "keg-4",
        kategori: "Kaderisasi & Diklat",
        judul: "[Latihan Gabungan & Pra-Seleksi Calon Anggota Paskibraka]",
        tanggal: "[Contoh: Maret - April]",
        lokasi: "[Contoh: Gedung Pertemuan / Lapangan Olahraga Soppeng]",
        status: "Pra-Seleksi",
        ringkasan: "[Silakan isi deskripsi kegiatan ini. Contoh: Sosialisasi dan pengenalan materi dasar PBB serta wawasan kebangsaan ke sekolah-sekolah di seluruh kecamatan Kabupaten Soppeng.]",
        detail: "[Silakan masukkan panduan seleksi, syarat fisik dan akademik untuk calon peserta seleksi Paskibraka.]",
        fotoPlaceholderName: "kegiatan-pra-seleksi.jpg",
        tags: ["Sosialisasi", "Sekolah", "PBB"],
      },
      {
        id: "keg-5",
        kategori: "Pengembangan Diri",
        judul: "[Musyawarah Kabupaten (Muskab) & Silaturahmi Akbar PPI Soppeng]",
        tanggal: "[Contoh: Sesuai Periode / Akhir Tahun]",
        lokasi: "[Contoh: Aula Kantor Pemerintah / Gedung Pertemuan Soppeng]",
        status: "Organisasi",
        ringkasan: "[Silakan isi deskripsi kegiatan ini. Contoh: Forum permusyawaratan tertinggi tingkat kabupaten untuk mengevaluasi program kerja serta memilih kepengurusan baru yang demokratis.]",
        detail: "[Silakan masukkan agenda musyawarah, tata tertib sidang, dan laporan pertanggungjawaban kepengurusan.]",
        fotoPlaceholderName: "kegiatan-muskab-ppi.jpg",
        tags: ["Muskab", "Rapat Kerja", "Alumni"],
      },
      {
        id: "keg-6",
        kategori: "Pengembangan Diri",
        judul: "[Workshop Kepemimpinan & Kewirausahaan Pemuda Mandiri]",
        tanggal: "[Contoh: Jadwal Tentatif / Semester 2]",
        lokasi: "[Contoh: Ruang Rapat / Kampus Lokal di Soppeng]",
        status: "Pengembangan",
        ringkasan: "[Silakan isi deskripsi kegiatan ini. Contoh: Pembekalan kapasitas soft skill, kepemimpinan digital, serta literasi karier untuk anggota purna paskibraka muda.]",
        detail: "[Silakan masukkan daftar pemateri, topik bahasan, dan sertifikasi pelatihan.]",
        fotoPlaceholderName: "kegiatan-workshop-pemuda.jpg",
        tags: ["Workshop", "Karier", "Pemuda"],
      },
    ],
  },

  // --- SUSUNAN PENGURUS KABUPATEN (PERIODE 2026 - 2031) ---
  pengurus: {
    tagline: "Struktur Organisasi",
    title: "Susunan Pengurus Kabupaten",
    periode: "Periode 2026 - 2031",
    nomorSk: "SK.006 /PPI.23/IX/2026",
    tanggalSk: "27 September 2026",
    tempatPenetapan: "Makassar",
    dasarHukum: "Hasil Musyawarah Kabupaten IV PPI Soppeng (12 September 2026 di Aula Kantor Kecamatan Lalabata)",
    deskripsi: "Komposisi dan Personalia Susunan Pengurus Kabupaten Purna Paskibraka Indonesia (PPI) Kabupaten Soppeng Periode 2026 - 2031 berdasarkan Surat Keputusan Pengurus Provinsi PPI Sulawesi Selatan.",
    kategoriList: ["Semua", "Pengurus Harian (BPH)", "Bidang-Bidang", "Pelindung & Pembina", "MPO"],
    
    // A. PELINDUNG
    pelindung: [
      { no: 1, nama: "Bupati Soppeng", jabatan: "Pelindung" },
      { no: 2, nama: "Wakil Bupati Soppeng", jabatan: "Pelindung" },
      { no: 3, nama: "Ketua DPRD Soppeng", jabatan: "Pelindung" },
      { no: 4, nama: "Dandim 1425 Soppeng", jabatan: "Pelindung" },
      { no: 5, nama: "Kapolres Soppeng", jabatan: "Pelindung" },
      { no: 6, nama: "Kajari Soppeng", jabatan: "Pelindung" },
    ],

    // B. PEMBINA
    pembina: [
      { no: 1, nama: "A. Ahmad Ahsan Said, SE", jabatan: "Pembina" },
      { no: 2, nama: "A. Agus Salim, S.STP, M.Si", jabatan: "Pembina" },
      { no: 3, nama: "Roslinda Genda, SE., MM", jabatan: "Pembina" },
      { no: 4, nama: "A. Ahmad Firdaus, S.Sos.", jabatan: "Pembina" },
    ],

    // C. MAJELIS PERTIMBANGAN ORGANISASI (MPO)
    mpo: [
      { no: 1, nama: "Dzul Fadhli M, S.H.", jabatan: "Majelis Pertimbangan Organisasi" },
      { no: 2, nama: "Sulkifli, S.Or.", jabatan: "Majelis Pertimbangan Organisasi" },
      { no: 3, nama: "Hairul Sukarni, S.Pd.", jabatan: "Majelis Pertimbangan Organisasi" },
    ],

    // D. PENGURUS HARIAN (BPH)
    pengurusHarian: [
      {
        id: "bph-1",
        jabatan: "Ketua",
        kategori: "Pengurus Harian (BPH)",
        nama: "Andi Nurazizah Ramadhani, S.H.",
        peran: "Pimpinan Tertinggi Organisasi",
        tugasUtama: "Memimpin pelaksanaan organisasi, penanggung jawab umum arah kebijakan strategis, dan representasi resmi PPI Kabupaten Soppeng.",
        foto: "/images/ketua-ppi.png",
        isUtama: true,
      },
      {
        id: "bph-2",
        jabatan: "Wakil Ketua I",
        kategori: "Pengurus Harian (BPH)",
        nama: "Pardedi Agung Putra",
        peran: "Koordinator Internal & Keorganisasian",
        tugasUtama: "Mendampingi Ketua dan mengoordinasikan bidang organisasi, usaha, diklat, dan kaderisasi internal.",
        foto: null,
      },
      {
        id: "bph-3",
        jabatan: "Wakil Ketua II",
        kategori: "Pengurus Harian (BPH)",
        nama: "Rahmat Farhan Asmir, S.H.",
        peran: "Koordinator Eksternal & Hubungan Lembaga",
        tugasUtama: "Membantu Ketua dalam mengoordinasikan bidang pengabdian masyarakat, hubungan antar lembaga, dan kemitraan strategis.",
        foto: null,
      },
      {
        id: "bph-4",
        jabatan: "Sekretaris",
        kategori: "Pengurus Harian (BPH)",
        nama: "Fauzul Irham Mahesa",
        peran: "Tata Kelola Administrasi & Persuratan",
        tugasUtama: "Mengelola administrasi persuratan resmi, dokumentasi keputusan, inventarisasi, dan tata kelola sekretariat.",
        foto: null,
      },
      {
        id: "bph-5",
        jabatan: "Wakil Sekretaris I",
        kategori: "Pengurus Harian (BPH)",
        nama: "Muhammad Fadhil",
        peran: "Administrasi & Pengarsipan Digital",
        tugasUtama: "Mendukung kelancaran administrasi harian, notulensi rapat, dan pemutakhiran sistem data organisasi.",
        foto: null,
      },
      {
        id: "bph-6",
        jabatan: "Bendahara",
        kategori: "Pengurus Harian (BPH)",
        nama: "Andi Zaskia Zahra Al Humairah",
        peran: "Pengelolaan Keuangan & Anggaran",
        tugasUtama: "Mengelola perbendaharaan organisasi, pencatatan kas, pembukuan anggaran, serta pelaporan keuangan transparan.",
        foto: null,
      },
      {
        id: "bph-7",
        jabatan: "Wakil Bendahara I",
        kategori: "Pengurus Harian (BPH)",
        nama: "Miftahul Rahma, S.E.",
        peran: "Akuntansi & Verifikasi Anggaran",
        tugasUtama: "Membantu tata kelola keuangan, pertanggungjawaban dana kegiatan, dan verifikasi anggaran program kerja.",
        foto: null,
      },
    ],

    // E. BIDANG - BIDANG KEPENGURUSAN
    bidangBidang: [
      {
        id: "bid-1",
        namaBidang: "Bidang Usaha dan Koperasi",
        kategori: "Bidang-Bidang",
        singkatan: "Usaha & Koperasi",
        kordinator: "Dwi Eldhelya Enggar Sari, A.Md.Keb.",
        anggota: [
          "Ahmad Fikrul Ridha, S.H.",
          "Muhammad Rafli Ramadansyah",
          "Adwin Tahar",
          "Muhammad Al Furqan",
        ],
        fokusTugas: "Pengembangan usaha mandiri organisasi, pengelolaan merchandise PPI, kemitraan ekonomi, dan inisiatif koperasi purna.",
      },
      {
        id: "bid-2",
        namaBidang: "Bidang Sistem Informasi Strategi",
        kategori: "Bidang-Bidang",
        singkatan: "Sistem Informasi",
        kordinator: "Muhammad Arham Pratama",
        anggota: [
          "A. Arya Phandita Ahyar",
          "A. Muh. Akhdan Mufri",
          "Adwin Tahar",
          "Ahmad Irza Muhafidz, S.A.P.",
        ],
        fokusTugas: "Pengelolaan database anggota, sistem informasi digital, website resmi, teknologi informasi, dan analisis data strategis organisasi.",
      },
      {
        id: "bid-3",
        namaBidang: "Bidang Diklat dan Pengembangan Sumber Daya Manusia",
        kategori: "Bidang-Bidang",
        singkatan: "Diklat & PSDM",
        kordinator: "Ferdi Risqullah",
        anggota: [
          "Nur Mufida",
          "A. Muhammad Yusuf Asangkari",
          "Aisyah Mardatillah Ruslan",
          "Achmad Raihanul",
        ],
        fokusTugas: "Pendidikan dan pelatihan paskibraka, pembinaan kedisiplinan dan baris-berbaris, kurikulum kepemimpinan, dan peningkatan kapasitas SDM pemuda.",
      },
      {
        id: "bid-4",
        namaBidang: "Bidang Pengabdian Masyarakat",
        kategori: "Bidang-Bidang",
        singkatan: "Pengabdian Masyarakat",
        kordinator: "Ikhsanul Hidayah",
        anggota: [
          "Andi Pramudya Pasha",
          "Muh Agus Pratama",
          "Angkatan 2025",
          "Angkatan 2026",
        ],
        fokusTugas: "Aksi kepedulian sosial, tanggap bencana, program kemanusiaan, pelestarian lingkungan, dan sinergi kemasyarakatan di Kabupaten Soppeng.",
      },
      {
        id: "bid-5",
        namaBidang: "Bidang Kesekretariatan",
        kategori: "Bidang-Bidang",
        singkatan: "Kesekretariatan",
        kordinator: "Muhammad Aprilyansah Pratama Rusli, S.Pd.",
        anggota: [
          "Muh. Ikhsan",
          "Arika Zhara",
          "Alfiah Nurul Amalia",
          "Besse Fauziah Salsabila",
          "Muh. Rifqi Aulia",
        ],
        fokusTugas: "Dukungan operasional sekretariat, inventaris perlengkapan, dokumentasi kegiatan kepengurusan, dan ketertiban tata persuratan.",
      },
      {
        id: "bid-6",
        namaBidang: "Bidang Hubungan Antar Lembaga",
        kategori: "Bidang-Bidang",
        singkatan: "Hubungan Antar Lembaga",
        kordinator: "Rega Setiawan",
        anggota: [
          "Andi Muhammad Iqbal",
          "Muhammad Nurfajrie, S.H.",
          "Azzahra Dwi NurMaulana, S.Psi.",
          "M. Alimyallah Suwardi",
          "Muh. Idil Febriansyah",
        ],
        fokusTugas: "Membangun relasi kemitraan dengan Pemerintah Daerah, TNI-Polri, organisasi kepemudaan, sekolah-sekolah, dan pihak eksternal.",
      },
    ],
  },

  // --- INFORMASI KONTAK & SEKRETARIAT ---
  kontak: {
    tagline: "Hubungi Kami",
    title: "Sekretariat & Kanal Komunikasi Resmi",
    deskripsi: "Silakan gunakan informasi kontak di bawah ini untuk urusan koordinasi kelembagaan, kemitraan kepemudaan, atau pendataan anggota Purna Paskibraka Indonesia Kabupaten Soppeng.",
    
    // Informasi Alamat & Kontak Resmi PPI Kabupaten Soppeng
    alamat: {
      label: "Alamat Sekretariat",
      teks: "Jln. A. Abd. Muis (Griya Harapan Permai Blok d/12), Kel. Bila, Kec. Lalabata, Kab. Soppeng, Sul-Sel, 90814",
      catatanLokasi: "Griya Harapan Permai Blok D/12, Kel. Bila, Kec. Lalabata",
      koordinat: "-4.351396852156139, 119.88233899384068",
      mapsUrl: "https://www.google.com/maps?q=-4.351396852156139,119.88233899384068",
      mapsEmbedUrl: "https://maps.google.com/maps?q=-4.351396852156139,119.88233899384068&z=17&output=embed",
      mapsEmbedUrlPlaceholder: "https://www.google.com/maps?q=-4.351396852156139,119.88233899384068",
    },

    telepon: {
      label: "Telepon / WhatsApp Narahubung",
      teks: "+62 822-1354-2782",
      rawNumber: "6282213542782", // Untuk tautan wa.me
      jamLayanan: "Senin - Sabtu: 08.00 - 17.00 WITA",
    },

    email: {
      label: "Email Resmi Organisasi",
      teks: "ppi2318soppeng@gmail.com",
      mailTo: "mailto:ppi2318soppeng@gmail.com",
    },

    jamOperasional: {
      label: "Waktu Pelayanan Piket",
      teks: "[Senin - Jumat: 09.00 - 16.00 WITA | Sabtu - Minggu: Pelayanan Khusus / Janji Temu]",
    },

    sosialMedia: [
      {
        platform: "Instagram",
        handle: "@ppisoppeng_official",
        url: "https://www.instagram.com/ppisoppeng_official?rpxt=Y2p5M2plMm00cXpv",
      },
      {
        platform: "Facebook",
        handle: "PPI Kabupaten Soppeng",
        url: "https://facebook.com/",
      },
      {
        platform: "YouTube",
        handle: "PPI Soppeng Official",
        url: "https://youtube.com/",
      },
      {
        platform: "TikTok",
        handle: "@ppisoppeng",
        url: "https://www.tiktok.com/@ppisoppeng?_r=1&_t=ZS-9AjZicHTMqk",
      },
    ],
  },

  // --- PERTANYAAN UMUM (FAQ) SEPUTAR PPI SOPPENG ---
  faq: [
    {
      tanya: "Apakah organisasi ini resmi menaungi seluruh alumni Paskibraka di Kabupaten Soppeng?",
      jawab: "[Ya, Purna Paskibraka Indonesia (PPI) merupakan satu-satunya organisasi kemasyarakatan resmi yang menjadi wadah berhimpun para alumni Paskibraka yang telah dikukuhkan, baik di tingkat kabupaten, provinsi, maupun nasional.]",
    },
    {
      tanya: "Bagaimana cara alumni Paskibraka Soppeng mendaftarkan atau memperbarui data keanggotaan?",
      jawab: "[Alumni dapat menghubungi sekretariat Pengurus Kabupaten PPI Soppeng melalui kontak WhatsApp resmi atau mengisi formulir pendataan berkala yang dibagikan oleh bidang keanggotaan.]",
    },
    {
      tanya: "Kapan seleksi Calon Paskibraka Kabupaten Soppeng biasanya dimulai setiap tahunnya?",
      jawab: "[Tahapan seleksi biasanya dimulai pada triwulan pertama (Maret - Mei) dengan koordinasi antara Kesbangpol/Dispora Kabupaten Soppeng dan Pengurus PPI Kabupaten Soppeng.]",
    },
    {
      tanya: "Apakah PPI Soppeng membuka kerja sama untuk kegiatan sosial kemasyarakatan?",
      jawab: "[Tentu. PPI Soppeng sangat terbuka untuk berkolaborasi dengan pemerintah daerah, organisasi kepemudaan, sekolah, dan komunitas dalam berbagai agenda positif kemanusiaan dan kebangsaan.]",
    },
  ],

  // --- FOOTER & HAK CIPTA ---
  footer: {
    disclaimer: "Website ini merupakan media profil informasi resmi Purna Paskibraka Indonesia Kabupaten Soppeng. Seluruh teks dan foto bertanda [placeholder] siap diganti dengan arsip resmi organisasi.",
    copyright: `© ${new Date().getFullYear()} Purna Paskibraka Indonesia Kabupaten Soppeng. Seluruh hak cipta dilindungi.`,
  },
};
