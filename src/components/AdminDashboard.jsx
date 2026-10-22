import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import {
  fetchPesanKontak,
  updateStatusPesan,
  deletePesanKontak,
  fetchKegiatanList,
  submitKegiatanBaru,
  deleteKegiatanItem,
} from '../services/api';
import TambahKegiatanModal from './TambahKegiatanModal';
import { siteData } from '../data/siteData';

export default function AdminDashboard({ onNavigateToHome }) {
  // Autentikasi Admin Sederhana (Session Storage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('ppi_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState('kegiatan'); // 'kegiatan' | 'kontak' | 'pin'
  
  // State Ubah PIN Admin
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState({ type: '', text: '' });
  const [showPin, setShowPin] = useState(false);

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

  useEffect(() => {
    loadKegiatan();
    loadPesan();
  }, []);

  // Handler Hapus Kegiatan
  const handleDeleteKegiatan = async (id, judul) => {
    if (window.confirm(`Yakin ingin menghapus kegiatan "${judul}" dari database?`)) {
      await deleteKegiatanItem(id);
      setKegiatanList(prev => prev.filter(k => k.id !== id));
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
              <Database className="w-3 h-3 text-emerald-400" />
              {isOffline ? 'Storage: Browser Local' : 'Storage: SQLite Backend (localhost:5000)'}
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('kegiatan')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'kegiatan'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105'
                  : 'bg-[#161920] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Kelola Kegiatan ({kegiatanList.length})</span>
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
              <button
                onClick={() => setIsTambahModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Kegiatan Baru</span>
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
        {/* TAB 2: KOTAK MASUK KONTAK */}
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

      </div>

      {/* Modal Tambah Kegiatan */}
      <TambahKegiatanModal
        isOpen={isTambahModalOpen}
        onClose={() => setIsTambahModalOpen(false)}
        onKegiatanAdded={(newItem) => {
          setKegiatanList(prev => [newItem, ...prev]);
        }}
      />

    </div>
  );
}
