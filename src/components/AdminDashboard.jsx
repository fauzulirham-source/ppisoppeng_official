import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Plus,
  Trash2,
  Search,
  Filter,
  ExternalLink,
  Database,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Phone,
  Mail,
  RefreshCw,
  Tag,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  Lock,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  Users,
  UserPlus,
  GraduationCap,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Award,
  X,
  Share2,
  Copy,
  Download,
  Upload,
  Cloud,
  Server,
  Check,
} from 'lucide-react';
import {
  fetchPesanKontak,
  updateStatusPesan,
  deletePesanKontak,
  fetchKegiatanList,
  submitKegiatanBaru,
  deleteKegiatanItem,
  fetchCustomAnggotaList,
  deleteAnggotaItem,
  subscribeToKegiatanSync,
  exportKegiatanJson,
  importKegiatanJson,
  getActiveDatabaseInfo,
  migrateLocalKegiatanToSupabase,
} from '../services/api';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  testSupabaseConnection,
} from '../services/supabaseClient';
import { SUPABASE_SQL_SCHEMA } from '../data/supabaseSqlScript';
import TambahKegiatanModal from './TambahKegiatanModal';
import TambahAnggotaModal from './TambahAnggotaModal';
import { siteData } from '../data/siteData';
import { databaseAnggota } from '../data/databaseAnggota';

export default function AdminDashboard({ onNavigateToHome }) {
  // Autentikasi Admin Sederhana (Session Storage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('ppi_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState('kegiatan'); // 'kegiatan' | 'anggota' | 'kontak' | 'pin' | 'supabase'
  
  // State Ubah PIN Admin
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState({ type: '', text: '' });
  const [showPin, setShowPin] = useState(false);

  // State Supabase Database Cloud
  const [supabaseCreds, setSupabaseCreds] = useState(() => getSupabaseCredentials());
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => getSupabaseCredentials().url || '');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(() => getSupabaseCredentials().anonKey || '');
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState(null);
  const [isMigratingSupabase, setIsMigratingSupabase] = useState(false);
  const [supabaseMigrateResult, setSupabaseMigrateResult] = useState(null);
  const [copySqlSuccess, setCopySqlSuccess] = useState(false);

  // Helper mendapatkan PIN aktif
  const getStoredPin = () => {
    return localStorage.getItem('ppi_admin_pin') || 'ppisoppeng2318';
  };

  // State Kegiatan
  const [kegiatanList, setKegiatanList] = useState([]);
  const [loadingKegiatan, setLoadingKegiatan] = useState(false);
  const [searchKegiatan, setSearchKegiatan] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [importText, setImportText] = useState('');
  const [importMsg, setImportMsg] = useState({ type: '', text: '' });

  const handleCopyData = async () => {
    try {
      const json = exportKegiatanJson();
      await navigator.clipboard.writeText(json);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (e) {
      alert('Gagal menyalin otomatis. Silakan unduh file cadangan.');
    }
  };

  const handleDownloadBackup = () => {
    const json = exportKegiatanJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kegiatan_ppi_soppeng_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    e.preventDefault();
    setImportMsg({ type: '', text: '' });
    if (!importText.trim()) {
      setImportMsg({ type: 'error', text: 'Silakan tempelkan kode data kegiatan terlebih dahulu!' });
      return;
    }

    const res = importKegiatanJson(importText.trim());
    if (res.success) {
      setImportMsg({ type: 'success', text: `Berhasil menyinkronkan ${res.count} kegiatan ke browser ini!` });
      setImportText('');
      loadKegiatan();
      setTimeout(() => {
        setIsSyncModalOpen(false);
        setImportMsg({ type: '', text: '' });
      }, 1500);
    } else {
      setImportMsg({ type: 'error', text: res.message || 'Gagal menerapkan data' });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setImportText(content);
      }
    };
    reader.readAsText(file);
  };

  // State Database Anggota
  const [customAnggotaList, setCustomAnggotaList] = useState([]);
  const [loadingAnggota, setLoadingAnggota] = useState(false);
  const [searchAnggota, setSearchAnggota] = useState('');
  const [filterAnggotaAngkatan, setFilterAnggotaAngkatan] = useState('Semua');
  const [filterAnggotaNra, setFilterAnggotaNra] = useState('semua'); // 'semua' | 'terdaftar' | 'belum' | 'kustom'
  const [isTambahAnggotaOpen, setIsTambahAnggotaOpen] = useState(false);
  const [pageAnggota, setPageAnggota] = useState(1);
  const itemsPerPageAnggota = 20;

  // State Kontak
  const [messages, setMessages] = useState([]);
  const [loadingPesan, setLoadingPesan] = useState(false);
  const [searchPesan, setSearchPesan] = useState('');
  const [filterStatusPesan, setFilterStatusPesan] = useState('Semua');
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Status Koneksi
  const [isOffline, setIsOffline] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();
    const validPin = getStoredPin();

    if (cleanPin === validPin) {
      sessionStorage.setItem('ppi_admin_auth', 'true');
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('PIN atau kata sandi pengurus salah. Silakan coba lagi.');
    }
  };

  const handleUpdatePin = (e) => {
    e.preventDefault();
    setPinChangeMsg({ type: '', text: '' });

    const validPin = getStoredPin();
    if (currentPinInput.trim() !== validPin) {
      setPinChangeMsg({ type: 'error', text: 'PIN / Kata sandi saat ini tidak sesuai!' });
      return;
    }

    if (newPinInput.trim().length < 4) {
      setPinChangeMsg({ type: 'error', text: 'PIN / Kata sandi baru minimal 4 karakter.' });
      return;
    }

    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setPinChangeMsg({ type: 'error', text: 'Konfirmasi PIN / Kata sandi baru tidak sama!' });
      return;
    }

    // Simpan PIN baru ke localStorage
    localStorage.setItem('ppi_admin_pin', newPinInput.trim());
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setPinChangeMsg({
      type: 'success',
      text: 'PIN / Kata sandi admin berhasil diubah! Gunakan PIN baru ini untuk login berikutnya.'
    });
  };

  const handleResetPinDefault = () => {
    if (window.confirm('Kembalikan PIN Admin ke pengaturan bawaan ("ppisoppeng2318")?')) {
      localStorage.setItem('ppi_admin_pin', 'ppisoppeng2318');
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setPinChangeMsg({
        type: 'success',
        text: 'PIN Admin berhasil dikembalikan ke default: "ppisoppeng2318".'
      });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ppi_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Load Data Kegiatan
  const loadKegiatan = async () => {
    setLoadingKegiatan(true);
    try {
      const res = await fetchKegiatanList(siteData.kegiatan.daftar);
      setKegiatanList(res.data || []);
      if (res.isOffline) setIsOffline(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingKegiatan(false);
    }
  };

  // Load Data Pesan Kontak
  const loadPesan = async () => {
    setLoadingPesan(true);
    try {
      const res = await fetchPesanKontak();
      setMessages(res.data || []);
      if (res.isOffline) setIsOffline(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPesan(false);
    }
  };

  // Load Data Anggota Kustom
  const loadAnggota = async () => {
    setLoadingAnggota(true);
    try {
      const res = await fetchCustomAnggotaList();
      setCustomAnggotaList(res.data || []);
      if (res.isOffline) setIsOffline(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAnggota(false);
    }
  };

  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    setSupabaseTestResult(null);
    const res = await testSupabaseConnection(supabaseUrlInput, supabaseKeyInput);
    setSupabaseTestResult(res);
    setIsTestingSupabase(false);
  };

  const handleSaveSupabaseConfig = (e) => {
    e.preventDefault();
    saveSupabaseCredentials(supabaseUrlInput, supabaseKeyInput);
    const updated = getSupabaseCredentials();
    setSupabaseCreds(updated);
    setSupabaseTestResult({
      success: updated.isConfigured,
      message: updated.isConfigured
        ? 'Konfigurasi Supabase berhasil disimpan! Database Cloud aktif dan siap digunakan.'
        : 'Konfigurasi Supabase dikosongkan. Sistem beralih ke penyimpanan lokal browser.'
    });
    loadKegiatan();
    loadAnggota();
    loadPesan();
  };

  const handleClearSupabaseConfig = () => {
    if (window.confirm('Hapus konfigurasi Supabase dari browser ini dan kembali ke mode penyimpanan lokal?')) {
      saveSupabaseCredentials('', '');
      setSupabaseUrlInput('');
      setSupabaseKeyInput('');
      setSupabaseCreds(getSupabaseCredentials());
      setSupabaseTestResult({ success: true, message: 'Kredensial Supabase telah dibersihkan.' });
      loadKegiatan();
      loadAnggota();
      loadPesan();
    }
  };

  const handleMigrateToSupabase = async () => {
    setIsMigratingSupabase(true);
    setSupabaseMigrateResult(null);
    const res = await migrateLocalKegiatanToSupabase();
    setSupabaseMigrateResult(res);
    setIsMigratingSupabase(false);
    if (res.success) {
      loadKegiatan();
    }
  };

  const handleCopySqlSchema = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopySqlSuccess(true);
      setTimeout(() => setCopySqlSuccess(false), 3000);
    } catch (e) {
      alert('Gagal menyalin otomatis. Anda dapat membuka file supabase_schema.sql di folder proyek.');
    }
  };

  useEffect(() => {
    loadKegiatan();
    loadPesan();
    loadAnggota();

    const handleAnggotaUpdated = () => {
      loadAnggota();
    };

    const handleKegiatanUpdated = () => {
      loadKegiatan();
    };

    const unsubscribeKegiatan = subscribeToKegiatanSync(handleKegiatanUpdated);
    window.addEventListener('anggota-updated', handleAnggotaUpdated);
    return () => {
      unsubscribeKegiatan();
      window.removeEventListener('anggota-updated', handleAnggotaUpdated);
    };
  }, []);

  // Handler Hapus Anggota Kustom
  const handleDeleteAnggota = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus data anggota "${nama}" dari database?`)) {
      await deleteAnggotaItem(id);
      setCustomAnggotaList(prev => prev.filter(a => a.id !== id && a.rawId !== id));
    }
  };

  // Gabungkan Database Anggota Bawaan + Anggota Tambahan Admin
  const defaultMappedAnggota = useMemo(() => {
    return databaseAnggota.map((a, idx) => {
      const hasNra = Boolean(a.nra && String(a.nra).trim() !== '' && String(a.nra).trim() !== '0');
      const nraStr = hasNra ? String(a.nra).trim() : '';
      return {
        id: `default-${a.angkatan}-${a.no || idx}`,
        rawId: null,
        no: a.no || (idx + 1),
        nama: a.nama,
        nomorKpa: hasNra ? nraStr : '-',
        nra: nraStr,
        hasNra: hasNra,
        angkatan: String(a.angkatan),
        status: hasNra ? "NRA Terdaftar" : "Belum Ada NRA",
        asalSekolah: a.asalSekolah || '',
        tempatTanggalLahir: a.tempatTanggalLahir || '',
        alamat: a.alamat || '',
        tingkat: a.tingkat || 'Kabupaten',
        noHp: a.noHp || '',
        isCustom: false,
      };
    });
  }, []);

  const allAnggota = useMemo(() => {
    return [...customAnggotaList, ...defaultMappedAnggota];
  }, [customAnggotaList, defaultMappedAnggota]);

  // Daftar angkatan unik untuk filter
  const angkatanAnggotaList = useMemo(() => {
    const list = Array.from(new Set(allAnggota.map(a => a.angkatan)));
    list.sort((a, b) => (b > a ? 1 : -1));
    return ['Semua', ...list];
  }, [allAnggota]);

  // Statistik Anggota
  const anggotaStats = useMemo(() => {
    let terdaftarNra = 0;
    for (const a of allAnggota) {
      if (a.hasNra) terdaftarNra++;
    }
    return {
      total: allAnggota.length,
      customCount: customAnggotaList.length,
      terdaftarNra,
      belumNra: allAnggota.length - terdaftarNra,
    };
  }, [allAnggota, customAnggotaList]);

  // Filter Anggota
  const filteredAnggota = useMemo(() => {
    return allAnggota.filter(item => {
      const q = searchAnggota.toLowerCase().trim();
      const matchQ =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.nomorKpa.toLowerCase().includes(q) ||
        (item.asalSekolah && item.asalSekolah.toLowerCase().includes(q)) ||
        (item.tempatTanggalLahir && item.tempatTanggalLahir.toLowerCase().includes(q)) ||
        (item.alamat && item.alamat.toLowerCase().includes(q)) ||
        item.angkatan.includes(q);

      const matchAngkatan =
        filterAnggotaAngkatan === 'Semua' || item.angkatan === filterAnggotaAngkatan;

      const matchNra =
        filterAnggotaNra === 'semua' ||
        (filterAnggotaNra === 'terdaftar' && item.hasNra) ||
        (filterAnggotaNra === 'belum' && !item.hasNra) ||
        (filterAnggotaNra === 'kustom' && item.isCustom);

      return matchQ && matchAngkatan && matchNra;
    });
  }, [allAnggota, searchAnggota, filterAnggotaAngkatan, filterAnggotaNra]);

  // Pagination Anggota
  const totalPagesAnggota = Math.ceil(filteredAnggota.length / itemsPerPageAnggota) || 1;
  const paginatedAnggota = useMemo(() => {
    const start = (pageAnggota - 1) * itemsPerPageAnggota;
    return filteredAnggota.slice(start, start + itemsPerPageAnggota);
  }, [filteredAnggota, pageAnggota]);

  // Handler Hapus Kegiatan
  const handleDeleteKegiatan = async (id, judul) => {
    if (window.confirm(`Yakin ingin menghapus kegiatan "${judul}" dari database?`)) {
      await deleteKegiatanItem(id);
      setKegiatanList(prev => prev.filter(k => String(k.id) !== String(id)));
    }
  };

  // Handler Update Status Pesan
  const handleUpdateStatusPesan = async (id, newStatus) => {
    await updateStatusPesan(id, newStatus);
    setMessages(prev =>
      prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(prev => ({ ...prev, status: newStatus }));
    }
  };

  // Handler Hapus Pesan
  const handleDeletePesan = async (id) => {
    if (window.confirm('Yakin ingin menghapus pesan ini dari database?')) {
      await deletePesanKontak(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  // Filter Kegiatan
  const filteredKegiatan = kegiatanList.filter(item => {
    const matchesKategori = filterKategori === 'Semua' || item.kategori === filterKategori;
    const q = searchKegiatan.toLowerCase();
    const matchesSearch =
      (item.judul && item.judul.toLowerCase().includes(q)) ||
      (item.lokasi && item.lokasi.toLowerCase().includes(q)) ||
      (item.ringkasan && item.ringkasan.toLowerCase().includes(q));
    return matchesKategori && matchesSearch;
  });

  // Filter Pesan
  const unreadPesanCount = messages.filter(
    m => !m.status || m.status === 'Belum Dibaca'
  ).length;

  const filteredPesan = messages.filter(item => {
    const matchesStatus =
      filterStatusPesan === 'Semua' ||
      (filterStatusPesan === 'Belum Dibaca' && (!item.status || item.status === 'Belum Dibaca')) ||
      item.status === filterStatusPesan;
    const q = searchPesan.toLowerCase();
    const matchesSearch =
      (item.nama && item.nama.toLowerCase().includes(q)) ||
      (item.subjek && item.subjek.toLowerCase().includes(q)) ||
      (item.pesan && item.pesan.toLowerCase().includes(q)) ||
      (item.whatsapp && item.whatsapp.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  // JIKA BELUM LOGIN: Tampilkan Layar Verifikasi PIN Admin
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0C0E12] text-slate-100 flex flex-col items-center justify-center p-4 font-sans selection:bg-red-600 selection:text-white">
        <div className="w-full max-w-md bg-[#14171F] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-300">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-amber-500 p-0.5 mx-auto flex items-center justify-center shadow-xl shadow-red-600/30">
              <div className="w-full h-full bg-[#14171F] rounded-[14px] flex items-center justify-center">
                <Lock className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Portal Admin PPI Soppeng
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Akses terbatas khusus Pengurus Kabupaten Purna Paskibraka Indonesia Soppeng.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {pinError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium text-center">
                {pinError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-red-400" />
                <span>Masukkan PIN / Kata Sandi Admin</span>
              </label>
              <input
                type="password"
                placeholder="Ketik PIN atau kata sandi..."
                autoFocus
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 text-center tracking-widest focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              Buka Panel Admin
            </button>
          </form>

          <div className="pt-2 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={onNavigateToHome}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Halaman Utama</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0E12] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Top Navbar Admin */}
      <header className="sticky top-0 z-40 bg-[#14171F]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-red-600/20">
            <div className="w-full h-full bg-[#14171F] rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                Admin Panel PPI Soppeng
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
                Database Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
              {supabaseCreds.isConfigured ? (
                <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <Cloud className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Cloud DB: Supabase Online (Realtime)</span>
                </span>
              ) : isOffline ? (
                <span className="text-amber-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-400" />
                  <span>Storage: Browser Local</span>
                </span>
              ) : (
                <span className="text-blue-400 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-blue-400" />
                  <span>Storage: SQLite Backend (localhost:5000)</span>
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateToHome}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lihat Website</span>
          </button>

          <button
            onClick={handleLogout}
            title="Kunci / Keluar dari Admin"
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kunci</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('kegiatan')}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'kegiatan'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105'
                  : 'bg-[#161920] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Kelola Kegiatan ({kegiatanList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('anggota')}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'anggota'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                  : 'bg-[#161920] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Database Anggota ({allAnggota.length.toLocaleString('id-ID')})</span>
              {customAnggotaList.length > 0 && (
                <span className="ml-0.5 px-2 py-0.2 text-[10px] font-black bg-emerald-500 text-white rounded-full">
                  +{customAnggotaList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('kontak')}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
                activeTab === 'kontak'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                  : 'bg-[#161920] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Kotak Masuk Pesan</span>
              {unreadPesanCount > 0 && (
                <span className="ml-1 px-2 py-0.2 text-[10px] font-black bg-red-500 text-white rounded-full">
                  {unreadPesanCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('supabase')}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'supabase'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                  : 'bg-[#161920] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Cloud className="w-4 h-4 text-emerald-400" />
              <span>Database Supabase</span>
              {supabaseCreds.isConfigured ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ) : (
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                  Setup
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('pin')}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'pin'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                  : 'bg-[#161920] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Ubah PIN Admin</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'kegiatan' && (
              <>
                <button
                  type="button"
                  onClick={() => setIsSyncModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105"
                  title="Pindahkan dan sinkronkan data kegiatan antar browser (Edge ⇄ Chrome ⇄ HP)"
                >
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Sinkronkan ke</span> Chrome / HP
                </button>
                <button
                  onClick={() => setIsTambahModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Kegiatan Baru</span>
                </button>
              </>
            )}
            {activeTab === 'anggota' && (
              <button
                onClick={() => setIsTambahAnggotaOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Tambah Anggota Baru</span>
              </button>
            )}
            {activeTab === 'kontak' && (
              <button
                onClick={loadPesan}
                disabled={loadingPesan}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingPesan ? 'animate-spin' : ''}`} />
                <span>Refresh Pesan</span>
              </button>
            )}
            {activeTab === 'pin' && (
              <div className="text-xs text-slate-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Proteksi Akses</span>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: KELOLA KEGIATAN */}
        {/* ======================================================== */}
        {activeTab === 'kegiatan' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Filter & Search Bar */}
            <div className="bg-[#14171F] p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari judul kegiatan, lokasi, atau deskripsi..."
                  value={searchKegiatan}
                  onChange={e => setSearchKegiatan(e.target.value)}
                  className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                {['Semua', 'Kaderisasi & Diklat', 'Upacara & Kenegaraan', 'Sosial Kemasyarakatan', 'Pengembangan Diri'].map(kategori => (
                  <button
                    key={kategori}
                    onClick={() => setFilterKategori(kategori)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      filterKategori === kategori
                        ? 'bg-red-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {kategori}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Daftar Kegiatan */}
            {loadingKegiatan ? (
              <div className="p-12 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-red-500" />
                Memuat data kegiatan dari database...
              </div>
            ) : filteredKegiatan.length === 0 ? (
              <div className="p-12 text-center bg-[#14171F] rounded-3xl border border-white/10 text-slate-400">
                <p className="text-sm">Belum ada kegiatan yang sesuai pencarian atau kategori.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKegiatan.map(item => (
                  <div
                    key={item.id}
                    className="bg-[#14171F] rounded-2xl border border-white/10 hover:border-red-500/30 p-5 flex flex-col justify-between shadow-xl transition-all space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Thumbnail Foto Dokumentasi */}
                      {item.foto ? (
                        <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 shadow group-hover:border-red-500/40 transition-colors">
                          <img
                            src={item.foto}
                            alt={item.judul}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-24 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-slate-500 text-xs gap-2">
                          <Camera className="w-4 h-4 text-slate-600" />
                          <span>Placeholder Foto PPI</span>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-300 border border-red-500/30">
                          {item.kategori}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          {item.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                        {item.judul}
                      </h3>

                      <div className="space-y-1 text-xs text-slate-400">
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.tanggal}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.lokasi}</span>
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                        {item.ringkasan}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-mono">
                        ID: #{item.id}
                      </span>
                      <button
                        onClick={() => handleDeleteKegiatan(item.id, item.judul)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: DATABASE ANGGOTA (TERHUBUNG KE BAGIAN TENTANG) */}
        {/* ======================================================== */}
        {activeTab === 'anggota' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* 4 Kartu Statistik Anggota */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#14171F] border border-white/10 shadow-lg space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Total Anggota</span>
                </span>
                <p className="text-xl sm:text-2xl font-black text-white">
                  {anggotaStats.total.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-slate-500">
                  Seluruh angkatan PPI Soppeng
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#14171F] border border-emerald-500/20 shadow-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tambahan Admin</span>
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-emerald-400">
                  +{anggotaStats.customCount} Orang
                </p>
                <p className="text-[10px] text-emerald-300/70">
                  Sinkron ke Bagian Tentang
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#14171F] border border-white/10 shadow-lg space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>NRA Terdaftar</span>
                </span>
                <p className="text-xl sm:text-2xl font-black text-emerald-400">
                  {anggotaStats.terdaftarNra.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-slate-500">
                  Memiliki nomor registrasi resmi
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#14171F] border border-white/10 shadow-lg space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Belum Ada NRA</span>
                </span>
                <p className="text-xl sm:text-2xl font-black text-amber-400">
                  {anggotaStats.belumNra.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-slate-500">
                  Dalam proses registrasi
                </p>
              </div>
            </div>

            {/* Filter & Search Bar Anggota */}
            <div className="bg-[#14171F] p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama anggota, nomor NRA, asal sekolah, alamat, atau angkatan..."
                  value={searchAnggota}
                  onChange={e => {
                    setSearchAnggota(e.target.value);
                    setPageAnggota(1);
                  }}
                  className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                {searchAnggota && (
                  <button
                    onClick={() => {
                      setSearchAnggota('');
                      setPageAnggota(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Angkatan Dropdown */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-1.5 bg-[#1B1F2A] border border-white/10 rounded-xl px-3 py-1.5 text-slate-300">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-slate-400">Angkatan:</span>
                  <select
                    value={filterAnggotaAngkatan}
                    onChange={e => {
                      setFilterAnggotaAngkatan(e.target.value);
                      setPageAnggota(1);
                    }}
                    className="bg-transparent text-white focus:outline-none font-bold cursor-pointer"
                  >
                    {angkatanAnggotaList.map(thn => (
                      <option key={thn} value={thn} className="bg-[#14171F] text-white">
                        {thn === 'Semua' ? 'Semua Angkatan' : `Angkatan ${thn}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter Status Chips */}
                <div className="flex items-center gap-1">
                  {[
                    { id: 'semua', label: 'Semua' },
                    { id: 'kustom', label: `✨ Tambahan Admin (${customAnggotaList.length})` },
                    { id: 'terdaftar', label: 'NRA Terdaftar' },
                    { id: 'belum', label: 'Belum Ada NRA' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setFilterAnggotaNra(tab.id);
                        setPageAnggota(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        filterAnggotaNra === tab.id
                          ? tab.id === 'kustom'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                            : 'bg-white/10 text-white border border-white/20'
                          : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabel Daftar Anggota */}
            <div className="bg-[#14171F] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Daftar Anggota Paskibraka</span>
                    <span className="text-[11px] font-normal text-slate-400">
                      ({filteredAnggota.length.toLocaleString('id-ID')} anggota ditemukan)
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Anggota yang ditambahkan melalui panel ini otomatis muncul di pencarian publik pada bagian Tentang.
                  </p>
                </div>

                <button
                  onClick={() => setIsTambahAnggotaOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Anggota</span>
                </button>
              </div>

              {filteredAnggota.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <Users className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-sm">Tidak ditemukan anggota dengan kriteria pencarian tersebut.</p>
                  <button
                    onClick={() => {
                      setSearchAnggota('');
                      setFilterAnggotaAngkatan('Semua');
                      setFilterAnggotaNra('semua');
                    }}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-[#101217] text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                        <th className="py-3.5 px-4 w-12 text-center">#</th>
                        <th className="py-3.5 px-4">Nama Lengkap</th>
                        <th className="py-3.5 px-4">Angkatan</th>
                        <th className="py-3.5 px-4">Nomor NRA</th>
                        <th className="py-3.5 px-4">Sekolah & Domisili</th>
                        <th className="py-3.5 px-4">Tingkat</th>
                        <th className="py-3.5 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {paginatedAnggota.map((item, idx) => {
                        const itemNum = (pageAnggota - 1) * itemsPerPageAnggota + idx + 1;
                        return (
                          <tr
                            key={item.id}
                            className={`hover:bg-white/[0.03] transition-colors ${
                              item.isCustom ? 'bg-emerald-500/[0.04]' : ''
                            }`}
                          >
                            <td className="py-3 px-4 text-center text-slate-500 font-mono text-xs">
                              {itemNum}
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">
                                  {item.nama}
                                </span>
                                {item.isCustom && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold whitespace-nowrap">
                                    Tambahan Admin
                                  </span>
                                )}
                              </div>
                              {item.noHp && (
                                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                                  WA: {item.noHp}
                                </p>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-mono font-bold">
                                {item.angkatan}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              {item.hasNra ? (
                                <span className="font-mono text-emerald-400 font-bold text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                  {item.nomorKpa}
                                </span>
                              ) : (
                                <span className="text-slate-500 text-xs italic">
                                  Belum Ada NRA
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-xs text-slate-300">
                              <p className="font-medium truncate max-w-[200px]" title={item.asalSekolah}>
                                {item.asalSekolah || '-'}
                              </p>
                              {item.alamat && (
                                <p className="text-[11px] text-slate-400 truncate max-w-[200px]" title={item.alamat}>
                                  {item.alamat}
                                </p>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                                {item.tingkat || 'Kabupaten'}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-center">
                              {item.isCustom ? (
                                <button
                                  onClick={() => handleDeleteAnggota(item.rawId || item.id, item.nama)}
                                  className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Hapus data anggota kustom ini"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Hapus</span>
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-medium">
                                  Database Bawaan
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              {totalPagesAnggota > 1 && (
                <div className="p-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3 text-xs bg-[#101217]">
                  <span className="text-slate-400">
                    Menampilkan <strong className="text-white">{(pageAnggota - 1) * itemsPerPageAnggota + 1}</strong> - <strong className="text-white">{Math.min(pageAnggota * itemsPerPageAnggota, filteredAnggota.length)}</strong> dari <strong className="text-white">{filteredAnggota.length}</strong> anggota
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPageAnggota(prev => Math.max(prev - 1, 1))}
                      disabled={pageAnggota === 1}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Sebelumnya</span>
                    </button>

                    <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-bold font-mono">
                      {pageAnggota} / {totalPagesAnggota}
                    </span>

                    <button
                      onClick={() => setPageAnggota(prev => Math.min(prev + 1, totalPagesAnggota))}
                      disabled={pageAnggota === totalPagesAnggota}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Berikutnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: KOTAK MASUK KONTAK */}
        {/* ======================================================== */}
        {activeTab === 'kontak' && (
          <div className="space-y-6 animate-in fade-in duration-200 flex-1 flex flex-col">
            
            {/* Filter & Search Bar */}
            <div className="bg-[#14171F] p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari pengirim, subjek, pesan, atau WhatsApp..."
                  value={searchPesan}
                  onChange={e => setSearchPesan(e.target.value)}
                  className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                {['Semua', 'Belum Dibaca', 'Sudah Dibaca', 'Dibalas'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatusPesan(status)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      filterStatusPesan === status
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Master-Detail Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 bg-[#14171F] rounded-3xl border border-white/10 overflow-hidden shadow-2xl min-h-[550px] flex-1">
              
              {/* Kolom Kiri: List Pesan */}
              <div className="md:col-span-5 border-r border-white/10 overflow-y-auto divide-y divide-white/5 bg-[#101217] max-h-[600px]">
                {loadingPesan ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
                    Memuat daftar pesan...
                  </div>
                ) : filteredPesan.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Tidak ada pesan yang sesuai filter.
                  </div>
                ) : (
                  filteredPesan.map(item => {
                    const isSelected = selectedMessage?.id === item.id;
                    const isUnread = !item.status || item.status === 'Belum Dibaca';

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedMessage(item);
                          if (isUnread) handleUpdateStatusPesan(item.id, 'Sudah Dibaca');
                        }}
                        className={`p-4 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-950/40 border-l-4 border-emerald-500'
                            : isUnread
                            ? 'bg-white/[0.03] hover:bg-white/[0.06]'
                            : 'opacity-70 hover:opacity-100 hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-white truncate max-w-[180px]">
                            {item.nama}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {item.created_at ? item.created_at.split(' ')[0] : '-'}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-emerald-300 truncate mb-1">
                          {item.subjek}
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {item.pesan}
                        </p>

                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'Dibalas'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : item.status === 'Sudah Dibaca'
                                ? 'bg-slate-700/50 text-slate-300 border border-slate-600/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {item.status || 'Belum Dibaca'}
                          </span>

                          {item.whatsapp && item.whatsapp !== '-' && (
                            <span className="text-slate-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {item.whatsapp}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Kolom Kanan: Rincian Pesan Terpilih */}
              <div className="md:col-span-7 p-6 overflow-y-auto flex flex-col justify-between bg-[#14171F]">
                {selectedMessage ? (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-white/10 flex items-start justify-between">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1">
                          {selectedMessage.subjek}
                        </h4>
                        <p className="text-xs text-slate-400 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          Diterima: {selectedMessage.created_at || 'Baru Saja'}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeletePesan(selectedMessage.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>

                    <div className="bg-[#1B1F2A] p-4 rounded-2xl border border-white/5 space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Nama Pengirim:</span>
                        <span className="font-bold text-white">{selectedMessage.nama}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="font-mono text-emerald-300">{selectedMessage.email || '-'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Nomor WhatsApp:</span>
                        <span className="font-mono text-white">{selectedMessage.whatsapp || '-'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Isi Pesan:
                      </label>
                      <div className="bg-[#0E1015] p-5 rounded-2xl border border-white/5 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.pesan}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                      {selectedMessage.whatsapp && selectedMessage.whatsapp !== '-' && (
                        <a
                          href={`https://wa.me/${selectedMessage.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Halo ${selectedMessage.nama}, terima kasih telah menghubungi Pengurus PPI Kabupaten Soppeng perihal: ${selectedMessage.subjek}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleUpdateStatusPesan(selectedMessage.id, 'Dibalas')}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Balas via WhatsApp</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                        </a>
                      )}

                      {selectedMessage.status !== 'Dibalas' && (
                        <button
                          onClick={() => handleUpdateStatusPesan(selectedMessage.id, 'Dibalas')}
                          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-medium text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Tandai Sudah Dibalas</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                    <MessageSquare className="w-12 h-12 mb-3 stroke-[1.5] text-slate-600" />
                    <p className="text-sm">Pilih salah satu pesan di sebelah kiri untuk melihat rincian.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: UBAH PIN / KATA SANDI ADMIN */}
        {/* ======================================================== */}
        {activeTab === 'pin' && (
          <div className="max-w-2xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div className="bg-[#14171F] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <KeyRound className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white tracking-tight">
                      Ubah PIN / Kata Sandi Admin
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Kelola keamanan akses Portal Pengurus PPI Kabupaten Soppeng.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Akses Terproteksi</span>
                </div>
              </div>

              {/* Status Alert */}
              {pinChangeMsg.text && (
                <div
                  className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-start gap-3 ${
                    pinChangeMsg.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  {pinChangeMsg.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-bold">
                      {pinChangeMsg.type === 'success' ? 'Berhasil!' : 'Perhatian!'}
                    </p>
                    <p className="opacity-90 leading-relaxed">{pinChangeMsg.text}</p>
                  </div>
                </div>
              )}

              {/* Form Input PIN */}
              <form onSubmit={handleUpdatePin} className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      PIN / Kata Sandi Saat Ini
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {showPin ? (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Sembunyikan Sandi</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Lihat Sandi</span>
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    type={showPin ? 'text' : 'password'}
                    placeholder="Masukkan PIN yang sedang aktif..."
                    value={currentPinInput}
                    onChange={e => setCurrentPinInput(e.target.value)}
                    required
                    className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      PIN / Kata Sandi Baru
                    </label>
                    <input
                      type={showPin ? 'text' : 'password'}
                      placeholder="Minimal 4 karakter..."
                      value={newPinInput}
                      onChange={e => setNewPinInput(e.target.value)}
                      required
                      className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      Ulangi PIN / Kata Sandi Baru
                    </label>
                    <input
                      type={showPin ? 'text' : 'password'}
                      placeholder="Ketik ulang PIN baru..."
                      value={confirmPinInput}
                      onChange={e => setConfirmPinInput(e.target.value)}
                      required
                      className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
                  <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Catatan Pengurus:</span>
                  </p>
                  <p>
                    PIN baru yang Anda simpan akan aktif digunakan pada browser perangkat ini. Jika Anda lupa kata sandi atau berpindah perangkat baru, PIN bawaan resminya adalah <code className="text-emerald-400 font-mono bg-black/40 px-1.5 py-0.5 rounded">ppisoppeng2318</code>.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan PIN</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetPinDefault}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Reset ke Default (ppisoppeng2318)
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* TAB 5: PENGATURAN SUPABASE CLOUD DATABASE */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            
            {/* Header Card Status */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#161B26] via-[#12151D] to-[#0D1017] border border-white/10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
                    <Cloud className="w-3.5 h-3.5" />
                    <span>Supabase Cloud Database & Realtime</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Penyimpanan Terpusat & Sinkronisasi Global
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Dengan menghubungkan database Supabase, setiap kali Anda menambah atau menghapus kegiatan dari peramban manapun (Edge, Chrome, atau HP), datanya <strong>tersimpan aman di cloud</strong> dan langsung <strong>terupdate secara real-time</strong> ke semua perangkat di seluruh dunia.
                  </p>
                </div>

                {/* Status Box */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 min-w-[260px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Status Koneksi</span>
                    {supabaseCreds.isConfigured ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Aktif Online
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold border border-amber-500/30">
                        Belum Terhubung
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 font-mono break-all">
                    {supabaseCreds.isConfigured ? supabaseCreds.url : 'Penyimpanan: Browser LocalStorage'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {supabaseCreds.isConfigured
                      ? 'WebSocket Realtime aktif: Pembaruan terkirim instan!'
                      : 'Data hanya tersimpan di peramban ini.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Kolom Kiri: Form Kredensial Supabase */}
              <div className="lg:col-span-7 bg-[#14171F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <span>Konfigurasi API Supabase</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Masukkan URL Proyek dan Public Anon Key dari dashboard Supabase Anda
                  </p>
                </div>

                <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Supabase Project URL</span>
                      <span className="text-[11px] text-slate-500 font-normal">Contoh: https://xyzcompany.supabase.co</span>
                    </label>
                    <input
                      type="url"
                      value={supabaseUrlInput}
                      onChange={(e) => setSupabaseUrlInput(e.target.value)}
                      placeholder="https://xxxxxxxxxxxxxxxxxxxx.supabase.co"
                      required
                      className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Supabase Anon / Public Key</span>
                      <span className="text-[11px] text-slate-500 font-normal">Kunci publik aman untuk frontend</span>
                    </label>
                    <textarea
                      rows={3}
                      value={supabaseKeyInput}
                      onChange={(e) => setSupabaseKeyInput(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      required
                      className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono resize-none"
                    />
                  </div>

                  {/* Feedback Hasil Test / Simpan */}
                  {supabaseTestResult && (
                    <div
                      className={`p-4 rounded-xl text-xs flex items-start gap-3 leading-relaxed ${
                        supabaseTestResult.success
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                          : 'bg-red-500/15 border border-red-500/30 text-red-300'
                      }`}
                    >
                      {supabaseTestResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <span>{supabaseTestResult.message}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTestSupabase}
                        disabled={isTestingSupabase || !supabaseUrlInput.trim() || !supabaseKeyInput.trim()}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isTestingSupabase ? 'animate-spin' : ''}`} />
                        <span>{isTestingSupabase ? 'Menguji...' : 'Uji Koneksi'}</span>
                      </button>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan & Aktifkan</span>
                      </button>
                    </div>

                    {supabaseCreds.isConfigured && (
                      <button
                        type="button"
                        onClick={handleClearSupabaseConfig}
                        className="px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        Hapus Kredensial
                      </button>
                    )}
                  </div>
                </form>

                {/* Migrasi Cepat */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Migrasi Data Lokal ke Supabase</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {kegiatanList.length} Kegiatan di Browser
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Unggah seluruh kegiatan yang saat ini tersimpan di browser Anda ke tabel database Supabase dalam 1 kali klik:
                  </p>
                  <button
                    type="button"
                    onClick={handleMigrateToSupabase}
                    disabled={isMigratingSupabase || !supabaseCreds.isConfigured}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isMigratingSupabase ? 'Mengunggah ke Supabase...' : 'Unggah Semua Kegiatan ke Supabase'}</span>
                  </button>

                  {supabaseMigrateResult && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                        supabaseMigrateResult.success
                          ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                          : 'bg-red-500/20 border border-red-500/30 text-red-300'
                      }`}
                    >
                      {supabaseMigrateResult.success ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{supabaseMigrateResult.message}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Kolom Kanan: Panduan 3 Langkah & Skrip SQL */}
              <div className="lg:col-span-5 bg-[#14171F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span>Panduan Setup Supabase</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Ikuti 3 langkah mudah ini untuk mengaktifkan database gratis:
                    </p>
                  </div>

                  <ol className="space-y-3.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                      <div>
                        <p className="font-semibold text-white">Buat Project Gratis di Supabase</p>
                        <p className="text-slate-400 mt-0.5">
                          Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3" /></a>, buat akun, lalu klik <strong>New Project</strong> (pilih Region Singapore).
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                      <div>
                        <p className="font-semibold text-white">Jalankan Skrip Tabel SQL</p>
                        <p className="text-slate-400 mt-0.5">
                          Buka menu <strong>SQL Editor</strong> di Supabase, klik <em>New Query</em>, lalu klik tombol di bawah untuk menyalin seluruh tabel database PPI Soppeng:
                        </p>
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handleCopySqlSchema}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                              copySqlSuccess
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                            }`}
                          >
                            {copySqlSuccess ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Skrip SQL Tersalin ke Clipboard!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-amber-400" />
                                <span>Salin Skrip SQL Schema Supabase</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </li>

                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                      <div>
                        <p className="font-semibold text-white">Salin Kredensial API</p>
                        <p className="text-slate-400 mt-0.5">
                          Buka <strong>Project Settings</strong> &rarr; <strong>API</strong>. Salin <code>Project URL</code> dan <code>anon / public key</code>, lalu tempelkan di form sebelah kiri atau tambahkan di pengaturan Vercel!
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-slate-400 space-y-1">
                  <p className="font-semibold text-blue-300">Tips untuk Vercel Deployment:</p>
                  <p>
                    Anda juga dapat memasukkan variabel <code className="text-emerald-400 font-mono">VITE_SUPABASE_URL</code> dan <code className="text-emerald-400 font-mono">VITE_SUPABASE_ANON_KEY</code> pada tab <em>Environment Variables</em> di dashboard Vercel agar semua pengunjung langsung terhubung otomatis.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* Modal Tambah Kegiatan */}
      <TambahKegiatanModal
        isOpen={isTambahModalOpen}
        onClose={() => setIsTambahModalOpen(false)}
        onKegiatanAdded={(newItem) => {
          setKegiatanList(prev => [newItem, ...prev.filter(k => String(k.id) !== String(newItem.id))]);
        }}
      />

      {/* Modal Tambah Anggota */}
      <TambahAnggotaModal
        isOpen={isTambahAnggotaOpen}
        onClose={() => setIsTambahAnggotaOpen(false)}
        onAnggotaAdded={(newAnggota) => {
          setCustomAnggotaList(prev => [newAnggota, ...prev]);
        }}
      />

      {/* Modal Sinkronisasi Lintas Browser (Edge ⇄ Chrome ⇄ HP) */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#14171F] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Sinkronisasi Antar Browser & Perangkat
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pindahkan data kegiatan dari Microsoft Edge ke Google Chrome / HP secara instan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Penjelasan Singkat */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 space-y-1.5 leading-relaxed">
              <p className="font-semibold text-blue-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Mengapa di Microsoft Edge muncul tapi di Chrome belum?</span>
              </p>
              <p>
                Setiap peramban web (Edge, Chrome, Safari, HP) memiliki sistem penyimpanan lokal terpisah (<em>Storage Sandbox</em>) demi keamanan. Saat Anda mengunggah kegiatan di Microsoft Edge pada mode tanpa server backend, kegiatan tersimpan di memori Edge.
              </p>
              <p className="text-slate-400">
                Gunakan alat di bawah ini untuk <strong>menyalin dalam 1 klik</strong> dari Edge dan <strong>menerapkannya ke Chrome</strong> agar semua kegiatan tampil persis sama!
              </p>
            </div>

            {/* Langkah 1: Dari Edge */}
            <div className="p-5 rounded-2xl bg-[#1A1D26] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[11px]">1</span>
                  Langkah 1: Salin dari Microsoft Edge
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {kegiatanList.length} Kegiatan Terdata
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Klik tombol di bawah untuk menyalin seluruh data kegiatan saat ini ke papan klip (clipboard) Anda:
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCopyData}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    copySuccess
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Berhasil Tersalin ke Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Semua Data Kegiatan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Unduh File .json Cadangan</span>
                </button>
              </div>
            </div>

            {/* Langkah 2: Ke Chrome */}
            <form onSubmit={handleImportData} className="p-5 rounded-2xl bg-[#1A1D26] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px]">2</span>
                  Langkah 2: Terapkan di Google Chrome / Browser Lain
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Buka panel admin ini di Google Chrome, lalu tempel (Paste / Ctrl+V) data yang sudah Anda salin di sini, atau unggah file .json:
              </p>

              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='Tempelkan kode kegiatan di sini (contoh: [{"id": 1, "judul": ...}])...'
                rows={4}
                className="w-full bg-[#101217] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 resize-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <label className="text-xs text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Unggah dari file .json</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="submit"
                  disabled={!importText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Terapkan ke Chrome Sekarang</span>
                </button>
              </div>

              {/* Status Pesan Import */}
              {importMsg.text && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    importMsg.type === 'success'
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/20 border border-red-500/30 text-red-300'
                  }`}
                >
                  {importMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{importMsg.text}</span>
                </div>
              )}
            </form>

            {/* Footer Modal */}
            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
