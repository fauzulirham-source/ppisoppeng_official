import React, { useState, useMemo, useEffect, useRef } from 'react';
import { siteData } from '../data/siteData';
import {
  ShieldCheck,
  Search,
  X,
  CreditCard,
  QrCode,
  UserCheck,
  CalendarDays,
  GraduationCap,
  Home,
  ExternalLink,
  Award,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Users,
  Filter,
  ArrowRight,
} from 'lucide-react';
import PpiLogo from './PpiLogo';

export default function VerifikasiKeanggotaan() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedAngkatan, setSelectedAngkatan] = useState('Semua');
  const [filterNra, setFilterNra] = useState('semua'); // 'semua' | 'terdaftar' | 'belum'
  const [activeKtaModal, setActiveKtaModal] = useState(null);

  const modalInputRef = useRef(null);

  const v = siteData.verifikasiKeanggotaan;

  // Daftar angkatan unik untuk filter chip
  const angkatanList = useMemo(() => {
    const list = Array.from(new Set(v.daftarAnggota.map((a) => a.angkatan)));
    list.sort((a, b) => (b > a ? 1 : -1));
    return ['Semua', ...list];
  }, [v.daftarAnggota]);

  // Statistik terdaftar NRA
  const nraStats = useMemo(() => {
    let terdaftar = 0;
    for (const a of v.daftarAnggota) {
      if (a.hasNra) terdaftar++;
    }
    return {
      terdaftar,
      belum: v.daftarAnggota.length - terdaftar,
      total: v.daftarAnggota.length,
    };
  }, [v.daftarAnggota]);

  // Hasil pencarian real-time
  const filteredAnggota = useMemo(() => {
    return v.daftarAnggota.filter((anggota) => {
      const query = searchTerm.toLowerCase().trim();
      const matchQuery =
        !query ||
        anggota.nama.toLowerCase().includes(query) ||
        anggota.nomorKpa.toLowerCase().includes(query) ||
        (anggota.asalSekolah && anggota.asalSekolah.toLowerCase().includes(query)) ||
        (anggota.tempatTanggalLahir && anggota.tempatTanggalLahir.toLowerCase().includes(query)) ||
        (anggota.alamat && anggota.alamat.toLowerCase().includes(query)) ||
        (anggota.tingkat && anggota.tingkat.toLowerCase().includes(query)) ||
        anggota.angkatan.includes(query);

      const matchAngkatan =
        selectedAngkatan === 'Semua' || anggota.angkatan === selectedAngkatan;

      const matchNra =
        filterNra === 'semua' ||
        (filterNra === 'terdaftar' && anggota.hasNra) ||
        (filterNra === 'belum' && !anggota.hasNra);

      return matchQuery && matchAngkatan && matchNra;
    });
  }, [v.daftarAnggota, searchTerm, selectedAngkatan, filterNra]);

  // Buka popup saat mulai mengetik di input halaman utama
  const handleMainInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim().length > 0) {
      setIsSearchModalOpen(true);
    }
  };

  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
    setTimeout(() => {
      if (modalInputRef.current) {
        modalInputRef.current.focus();
      }
    }, 100);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  // Keyboard shortcut ESC untuk menutup modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeKtaModal) {
          setActiveKtaModal(null);
        } else if (isSearchModalOpen) {
          setIsSearchModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeKtaModal, isSearchModalOpen]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-6 sm:p-8 md:p-10 mb-16 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0f9a4a]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Fitur Verifikasi */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#0f9a4a]" />
          <span>{v.tagline}</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {v.title}
        </h3>

        <div className="w-16 h-1 bg-[#0f9a4a] mx-auto rounded-full" />

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          {v.deskripsi}
        </p>
      </div>

      {/* Ringkasan Statistik Database */}
      <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 relative z-10">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Total Anggota Terdata
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
            {nraStats.total}
          </span>
          <span className="text-[10px] text-slate-400">Purna Paskibraka Kab. Soppeng</span>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
            NRA Terdaftar Resmi
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#0f9a4a] mt-1 block">
            {nraStats.terdaftar}
          </span>
          <span className="text-[10px] text-emerald-600/80">Memiliki No. Registrasi Anggota</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
            Proses Registrasi
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 mt-1 block">
            {nraStats.belum}
          </span>
          <span className="text-[10px] text-amber-700/80">Menunggu Pemutakhiran NRA</span>
        </div>
      </div>

      {/* Box Kolom Pencarian Utama (Trigger Pop-up) */}
      <div className="max-w-2xl mx-auto mb-6 relative z-10">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-1.5 rounded-3xl shadow-lg border border-slate-700/50">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#12151B] p-2 rounded-[22px]">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-[#0f9a4a]" />
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={handleMainInputChange}
                onFocus={() => {
                  if (searchTerm.trim().length > 0) setIsSearchModalOpen(true);
                }}
                placeholder={v.inputPlaceholder}
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-[#0f9a4a] focus:bg-white/10 text-xs sm:text-sm transition-all"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                  title="Bersihkan Pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={handleOpenSearchModal}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0f9a4a] hover:bg-[#0c7c3b] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0f9a4a]/30 transition-all flex-shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Cari Data</span>
            </button>
          </div>
        </div>

        {/* Petunjuk & Quick Filter Tags */}
        <div className="mt-4 text-center space-y-2.5">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0f9a4a]" />
            <span>
              Ketik nama lengkap, nomor NRA, asal sekolah, atau tahun angkatan di atas untuk memunculkan jendela pop-up hasil verifikasi.
            </span>
          </p>

          <div className="flex items-center justify-center gap-1.5 flex-wrap text-[11px] text-slate-500">
            <span className="font-semibold text-slate-400">Pencarian Cepat:</span>
            {['2024', '2023', '2022', '2021', '2020'].map((thn) => (
              <button
                key={thn}
                onClick={() => {
                  setSearchTerm(thn);
                  setIsSearchModalOpen(true);
                }}
                className="px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-[#0f9a4a] border border-slate-200 text-slate-600 transition-colors font-medium"
              >
                Angkatan {thn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          POP-UP MODAL HASIL PENCARIAN DATABASE ANGGOTA
          (Hanya Muncul Saat Diketik di Kolom Pencarian / Dibuka)
      ========================================================================= */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Header Pop-up Modal */}
            <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex-shrink-0">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0f9a4a] to-emerald-700 text-white flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      Hasil Pencarian Database Anggota
                    </h4>
                    <p className="text-xs text-slate-500">
                      Purna Paskibraka Indonesia Kabupaten Soppeng
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCloseSearchModal}
                  className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-600 hover:text-slate-900 transition-colors"
                  title="Tutup Jendela (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Kolom Pencarian di Dalam Pop-up */}
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4 text-[#0f9a4a]" />
                  </div>

                  <input
                    ref={modalInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ketik nama, no. NRA, asal sekolah, alamat, atau angkatan..."
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-white border-2 border-slate-300 focus:border-[#0f9a4a] focus:outline-none text-slate-900 text-xs sm:text-sm placeholder-slate-400 shadow-sm transition-all"
                  />

                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      title="Bersihkan"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filter Status NRA & Filter Angkatan di Pop-up */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  {/* Status NRA */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider mr-1">
                      Status NRA:
                    </span>
                    <button
                      onClick={() => setFilterNra('semua')}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-all ${
                        filterNra === 'semua'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Semua ({nraStats.total})
                    </button>
                    <button
                      onClick={() => setFilterNra('terdaftar')}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-all flex items-center gap-1 ${
                        filterNra === 'terdaftar'
                          ? 'bg-[#0f9a4a] text-white shadow-sm'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Terdaftar ({nraStats.terdaftar})
                    </button>
                    <button
                      onClick={() => setFilterNra('belum')}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-all ${
                        filterNra === 'belum'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      Belum ({nraStats.belum})
                    </button>
                  </div>

                  {/* Indikator Hasil */}
                  <div className="text-[11px] font-semibold text-slate-600">
                    Ditemukan <strong className="text-[#0f9a4a] text-xs font-bold">{filteredAnggota.length}</strong> dari {nraStats.total} anggota
                  </div>
                </div>

                {/* Filter Chip Angkatan Scrollable */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider mr-1 flex-shrink-0">
                    Angkatan:
                  </span>
                  {angkatanList.map((angkatan) => (
                    <button
                      key={angkatan}
                      onClick={() => setSelectedAngkatan(angkatan)}
                      className={`px-2.5 py-0.5 rounded-lg font-semibold text-xs transition-all flex-shrink-0 ${
                        selectedAngkatan === angkatan
                          ? 'bg-[#0f9a4a] text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {angkatan}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Konten Scrollable: Grid Kartu Anggota */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {filteredAnggota.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredAnggota.map((anggota) => (
                    <div
                      key={anggota.id}
                      className="bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-[#0f9a4a]/50 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-2.5">
                        {/* Top Bar: Angkatan & Status Pill */}
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            <Award className="w-3 h-3 text-[#0f9a4a]" />
                            Purna {anggota.angkatan}
                          </span>
                          {anggota.hasNra ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                              <CheckCircle2 className="w-3 h-3 text-[#0f9a4a]" />
                              NRA Terdaftar
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium text-[10px]">
                              Belum Ada NRA
                            </span>
                          )}
                        </div>

                        {/* Nama Anggota */}
                        <div>
                          <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#0f9a4a] transition-colors line-clamp-1">
                            {anggota.nama}
                          </h5>
                          <p className="text-[11px] font-mono mt-0.5">
                            <span className="text-slate-500 font-semibold">No. NRA: </span>
                            {anggota.hasNra ? (
                              <span className="text-slate-900 font-bold font-mono">{anggota.nomorKpa}</span>
                            ) : (
                              <span className="text-slate-400 italic font-sans">Belum terdaftar</span>
                            )}
                          </p>
                        </div>

                        {/* Metadata: Asal Sekolah, TTL, Tingkat, Alamat */}
                        <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                          {anggota.asalSekolah && (
                            <div className="flex items-center gap-1.5 truncate" title={`Asal Sekolah: ${anggota.asalSekolah}`}>
                              <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{anggota.asalSekolah}</span>
                            </div>
                          )}

                          {anggota.tempatTanggalLahir && (
                            <div className="flex items-center gap-1.5 truncate" title={`Tempat/Tgl Lahir: ${anggota.tempatTanggalLahir}`}>
                              <CalendarDays className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{anggota.tempatTanggalLahir}</span>
                            </div>
                          )}

                          {anggota.tingkat && (
                            <div className="flex items-center gap-1.5 truncate" title={`Tingkat: ${anggota.tingkat}`}>
                              <Award className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="truncate">Tingkat {anggota.tingkat}</span>
                            </div>
                          )}

                          {anggota.alamat && (
                            <div className="flex items-center gap-1.5 truncate" title={`Alamat: ${anggota.alamat}`}>
                              <Home className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{anggota.alamat}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tombol Lihat e-KTA Digital */}
                      <div className="pt-3 mt-2 border-t border-slate-200/60">
                        <button
                          onClick={() => setActiveKtaModal(anggota)}
                          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-xl bg-slate-900 hover:bg-[#0f9a4a] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Lihat Kartu Anggota (e-KTA)</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State Jika Data Tidak Ditemukan */
                <div className="py-12 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Data Anggota Tidak Ditemukan
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                    Tidak ditemukan data anggota dengan kata kunci <strong>"{searchTerm}"</strong>. Silakan coba kata kunci lain atau bersihkan filter.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedAngkatan('Semua');
                        setFilterNra('semua');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      Reset Pencarian
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Pop-up Modal */}
            <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs flex-shrink-0">
              <span className="text-slate-500 font-mono text-[11px]">
                Total: {filteredAnggota.length} data ditampilkan
              </span>
              <button
                onClick={handleCloseSearchModal}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#0f9a4a] text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DIGITAL e-KTA ANGGOTA PPI SOPPENG
      ========================================================================= */}
      {activeKtaModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#12151B] border border-amber-500/30 rounded-3xl p-6 sm:p-7 text-white shadow-2xl overflow-hidden">
            {/* Hologram Gradient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0f9a4a]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header Modal e-KTA */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <CreditCard className="w-4 h-4" />
                <span>Kartu Purna Anggota Elektronik (e-KTA)</span>
              </div>
              <button
                onClick={() => setActiveKtaModal(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Kartu e-KTA */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1C2028] via-[#12151B] to-[#0A0C0F] border border-amber-400/40 shadow-2xl relative overflow-hidden space-y-4">
              {/* Watermark Logo */}
              <div className="absolute -right-6 -bottom-6 w-36 h-36 opacity-10 pointer-events-none">
                <PpiLogo showText={false} className="w-full h-full" />
              </div>

              {/* Card Top Branding */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <PpiLogo showText={false} className="w-9 h-9" />
                  <div>
                    <h5 className="text-xs font-extrabold text-white tracking-tight">
                      PURNA PASKIBRAKA INDONESIA
                    </h5>
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                      PENGURUS KABUPATEN SOPPENG
                    </p>
                  </div>
                </div>

                {activeKtaModal.hasNra ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold uppercase tracking-wider">
                    NRA TERVERIFIKASI
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold uppercase tracking-wider">
                    BELUM ADA NRA
                  </span>
                )}
              </div>

              {/* Data Anggota di Kartu */}
              <div className="pt-2 space-y-2 relative z-10">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">
                    Nama Lengkap Anggota
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                    {activeKtaModal.nama}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                      Nomor NRA Resmi
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {activeKtaModal.hasNra ? activeKtaModal.nomorKpa : 'Belum Terdaftar'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                      Angkatan
                    </span>
                    <span className="font-bold text-slate-200">
                      Purna Tahun {activeKtaModal.angkatan}
                    </span>
                  </div>
                </div>

                {/* Asal Sekolah */}
                {activeKtaModal.asalSekolah && (
                  <div className="text-xs space-y-0.5 pt-0.5">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                      Asal Sekolah
                    </span>
                    <p className="text-[11px] text-slate-200 font-medium">
                      {activeKtaModal.asalSekolah}
                    </p>
                  </div>
                )}

                {/* Tempat / Tanggal Lahir */}
                {activeKtaModal.tempatTanggalLahir && (
                  <div className="text-xs space-y-0.5 pt-0.5">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                      Tempat, Tanggal Lahir
                    </span>
                    <p className="text-[11px] text-slate-200 font-medium">
                      {activeKtaModal.tempatTanggalLahir}
                    </p>
                  </div>
                )}

                {/* Alamat */}
                {activeKtaModal.alamat && (
                  <div className="text-xs space-y-0.5 pt-0.5">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                      Alamat Terdata
                    </span>
                    <p className="text-[11px] text-slate-200 font-medium">
                      {activeKtaModal.alamat}
                    </p>
                  </div>
                )}

                {/* Penugasan / Tingkat */}
                <div className="text-xs space-y-0.5 pt-0.5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                    Keterangan / Tingkat
                  </span>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {activeKtaModal.tugas}
                  </p>
                </div>
              </div>

              {/* Card Bottom: Barcode / QR Mockup & Verification Code */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-white p-0.5 flex items-center justify-center">
                    <QrCode className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] text-slate-300">
                      SECURE ID: {activeKtaModal.id.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-emerald-400">Status Aktif Resmi</span>
                  </div>
                </div>

                <span className="text-[9px] font-mono text-slate-400">
                  Kab. Soppeng
                </span>
              </div>
            </div>

            {/* Modal Footer Action */}
            <div className="pt-4 mt-2 flex justify-end">
              <button
                onClick={() => setActiveKtaModal(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Tutup Kartu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
