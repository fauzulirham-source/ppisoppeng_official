import React, { useState } from 'react';
import { siteData } from '../data/siteData';
import {
  Users,
  Shield,
  Award,
  Crown,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Info,
  X,
  Building,
  Flag,
  FileText,
  TrendingUp,
  Globe,
  GraduationCap,
  HeartHandshake,
  Share2,
  Building2,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import PpiLogo from './PpiLogo';

const bidangThemes = {
  'bid-1': {
    icon: TrendingUp,
    badgeText: 'Bidang 01',
    tagline: 'Ekonomi & Kewirausahaan Mandiri',
    accentColor: 'from-emerald-500/15 via-amber-500/10 to-transparent',
    iconColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
    hoverBorder: 'hover:border-emerald-500/50',
    initials: 'DE',
  },
  'bid-2': {
    icon: Globe,
    badgeText: 'Bidang 02',
    tagline: 'Teknologi & Transformasi Digital',
    accentColor: 'from-cyan-500/15 via-teal-500/10 to-transparent',
    iconColor: 'text-cyan-700 bg-cyan-100 border-cyan-300',
    hoverBorder: 'hover:border-cyan-500/50',
    initials: 'MA',
  },
  'bid-3': {
    icon: GraduationCap,
    badgeText: 'Bidang 03',
    tagline: 'Kaderisasi & Pelatihan Pemuda',
    accentColor: 'from-emerald-600/15 via-amber-600/10 to-transparent',
    iconColor: 'text-amber-800 bg-amber-100 border-amber-300',
    hoverBorder: 'hover:border-emerald-500/50',
    initials: 'FR',
  },
  'bid-4': {
    icon: HeartHandshake,
    badgeText: 'Bidang 04',
    tagline: 'Kepedulian Sosial & Kemanusiaan',
    accentColor: 'from-rose-500/15 via-amber-500/10 to-transparent',
    iconColor: 'text-rose-700 bg-rose-100 border-rose-300',
    hoverBorder: 'hover:border-rose-500/40',
    initials: 'IH',
  },
  'bid-5': {
    icon: FileText,
    badgeText: 'Bidang 05',
    tagline: 'Tata Kelola Administrasi & Arsip',
    accentColor: 'from-teal-500/15 via-slate-500/10 to-transparent',
    iconColor: 'text-teal-700 bg-teal-100 border-teal-300',
    hoverBorder: 'hover:border-teal-500/50',
    initials: 'MA',
  },
  'bid-6': {
    icon: Share2,
    badgeText: 'Bidang 06',
    tagline: 'Kemitraan Strategis & Forkopimda',
    accentColor: 'from-blue-500/15 via-emerald-500/10 to-transparent',
    iconColor: 'text-blue-700 bg-blue-100 border-blue-300',
    hoverBorder: 'hover:border-blue-500/50',
    initials: 'RS',
  },
};

const bphInitials = {
  'bph-2': 'PA',
  'bph-3': 'RF',
  'bph-4': 'FI',
  'bph-5': 'MF',
  'bph-6': 'AZ',
  'bph-7': 'MR',
};

export default function Pengurus() {
  const [activeTab, setActiveTab] = useState('bph'); // 'bph' | 'bidang' | 'pembina' | 'mpo'
  const [activeBidangModal, setActiveBidangModal] = useState(null);

  const p = siteData.pengurus;

  return (
    <section id="pengurus" className="py-20 md:py-28 bg-[#F8FAFC] text-slate-900 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#0f9a4a]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0f9a4a]/10 border border-[#0f9a4a]/30 text-[#0f9a4a] text-xs font-bold uppercase tracking-wider shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#0f9a4a]" />
            <span>{p.tagline}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-amber-600 font-mono text-[11px] normal-case">Struktur Resmi</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {p.title}
          </h2>

          <div className="flex items-center justify-center gap-2.5 flex-wrap pt-1">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-bold shadow-md">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{p.periode}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300/80 text-emerald-800 text-xs font-semibold font-mono shadow-xs">
              <FileText className="w-3.5 h-3.5 text-[#0f9a4a]" />
              <span>No. {p.nomorSk}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300/80 text-amber-800 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Pengprov PPI Sulsel</span>
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto pt-1 font-normal">
            {p.deskripsi}
          </p>
        </div>

        {/* Tab Navigasi Kategori Kepengurusan (Lurus 1 Baris Sejajar) */}
        <div className="w-full flex justify-center mb-12 overflow-x-auto py-1">
          <div className="w-fit bg-slate-200/80 p-1.5 rounded-2xl sm:rounded-full border border-slate-300/80 shadow-inner flex flex-nowrap items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveTab('bph')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'bph'
                  ? 'bg-gradient-to-r from-[#0f9a4a] via-[#10b981] to-[#0d7b3d] text-white shadow-lg shadow-[#0f9a4a]/30 scale-[1.02]'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 shadow-xs'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>Pengurus Harian (BPH)</span>
            </button>

            <button
              onClick={() => setActiveTab('bidang')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'bidang'
                  ? 'bg-gradient-to-r from-[#0f9a4a] via-[#10b981] to-[#0d7b3d] text-white shadow-lg shadow-[#0f9a4a]/30 scale-[1.02]'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 shadow-xs'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Bidang - Bidang (6 Bidang)</span>
            </button>

            <button
              onClick={() => setActiveTab('pembina')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'pembina'
                  ? 'bg-gradient-to-r from-[#0f9a4a] via-[#10b981] to-[#0d7b3d] text-white shadow-lg shadow-[#0f9a4a]/30 scale-[1.02]'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 shadow-xs'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Pelindung & Pembina</span>
            </button>

            <button
              onClick={() => setActiveTab('mpo')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'mpo'
                  ? 'bg-gradient-to-r from-[#0f9a4a] via-[#10b981] to-[#0d7b3d] text-white shadow-lg shadow-[#0f9a4a]/30 scale-[1.02]'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 shadow-xs'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>MPO (Dewan Senior)</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: PENGURUS HARIAN (BPH)
        ========================================================================= */}
        {activeTab === 'bph' && (
          <div className="space-y-6">
            {/* Card Utama: KETUA UMUM (Executive VIP Card) */}
            {p.pengurusHarian
              .filter((item) => item.isUtama)
              .map((ketua) => (
                <div
                  key={ketua.id}
                  className="rounded-3xl p-6 sm:p-8 md:p-10 bg-gradient-to-br from-[#121620] via-[#161B26] to-[#0F1218] text-white border-2 border-amber-400/50 shadow-2xl shadow-slate-950/30 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-700" />
                  <div className="absolute -left-10 -bottom-10 w-52 h-52 opacity-10 pointer-events-none">
                    <PpiLogo showText={false} className="w-full h-full" />
                  </div>

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                    {/* Avatar Foto Ketua PPI */}
                    <div className="lg:col-span-3 flex justify-center lg:justify-start">
                      <div className="w-36 h-40 sm:w-44 sm:h-52 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-600 p-1 border-2 border-amber-300 shadow-2xl shadow-amber-500/30 relative overflow-hidden flex items-center justify-center group">
                        <img
                          src={ketua.foto || '/images/ketua-andi-nurazizah.png'}
                          alt={ketua.nama}
                          className="w-full h-full object-cover object-[center_15%] rounded-[20px] transition-transform duration-500 group-hover:scale-105 bg-[#121620]"
                        />
                      </div>
                    </div>

                    {/* Informasi Ketua */}
                    <div className="lg:col-span-9 space-y-3.5 text-center lg:text-left">
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
                          <Crown className="w-3.5 h-3.5 fill-current" />
                          <span>{ketua.jabatan}</span>
                        </span>
                        <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                          Masa Bakti: 2026 - 2031
                        </span>
                        <span className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                          SK No. {p.nomorSk}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                        {ketua.nama}
                      </h3>

                      <p className="text-xs sm:text-sm text-amber-300 font-semibold flex items-center justify-center lg:justify-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>{ketua.peran} • Pengurus Kabupaten PPI Soppeng</span>
                      </p>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                        {ketua.tugasUtama}
                      </p>

                      <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mandat Musyawarah Kabupaten IV PPI Soppeng</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {/* Grid 6 Anggota BPH Lainnya */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {p.pengurusHarian
                .filter((item) => !item.isUtama)
                .map((bph) => {
                  const initial = bphInitials[bph.id] || bph.jabatan.slice(0, 2).toUpperCase();
                  return (
                    <div
                      key={bph.id}
                      className="rounded-3xl p-6 bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-[#0f9a4a]/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                    >
                      <div className="space-y-4">
                        {/* Top Bar: Role Badge */}
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f9a4a]/10 border border-[#0f9a4a]/25 text-[#0f9a4a] text-xs font-bold">
                            <Award className="w-3.5 h-3.5" />
                            <span>{bph.jabatan}</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                            BPH
                          </span>
                        </div>

                        {/* Avatar & Nama */}
                        <div className="flex items-center gap-3.5 pt-1">
                          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#0f9a4a] to-emerald-800 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-emerald-500/20 group-hover:scale-105 transition-transform">
                            {initial}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0f9a4a] transition-colors leading-snug line-clamp-1" title={bph.nama}>
                              {bph.nama}
                            </h4>
                            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                              {bph.peran}
                            </p>
                          </div>
                        </div>

                        {/* Uraian Tugas */}
                        <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100 line-clamp-3">
                          {bph.tugasUtama}
                        </p>
                      </div>

                      <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Periode 2026-2031</span>
                        <span className="text-[#0f9a4a] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          SK Resmi
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: BIDANG - BIDANG KEPENGURUSAN (6 BIDANG TEKNIS)
        ========================================================================= */}
        {activeTab === 'bidang' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {p.bidangBidang.map((bidang) => {
              const theme = bidangThemes[bidang.id] || bidangThemes['bid-1'];
              const IconComp = theme.icon;

              return (
                <div
                  key={bidang.id}
                  className={`rounded-3xl p-6 sm:p-7 bg-white hover:bg-slate-50/80 border border-slate-200/90 ${theme.hoverBorder} shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group relative overflow-hidden`}
                >
                  {/* Ambient top corner glow */}
                  <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${theme.accentColor} rounded-full blur-2xl pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity`} />

                  <div className="space-y-4 relative z-10">
                    {/* Header: Singkatan + Badge Icon */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-xs ${theme.iconColor}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black text-amber-700 uppercase tracking-wider">
                          {theme.badgeText}
                        </span>
                      </div>

                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
                        {bidang.anggota.length} Personil
                      </span>
                    </div>

                    {/* Judul Bidang */}
                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-[#0f9a4a] transition-colors leading-snug">
                        {bidang.namaBidang}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {theme.tagline}
                      </p>
                    </div>

                    {/* Kotak Kordinator */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-slate-50 border border-emerald-200/70 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#0f9a4a] tracking-wider block flex items-center gap-1">
                        <Award className="w-3 h-3 text-[#0f9a4a]" />
                        <span>Kordinator Bidang:</span>
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {bidang.kordinator}
                      </h4>
                    </div>

                    {/* Roster Anggota */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold uppercase tracking-wider text-slate-400">
                          Roster Anggota:
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          Divisi Teknis
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-700">
                        {bidang.anggota.map((namaAnggota, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-slate-50/90 hover:bg-white border border-slate-100 hover:border-slate-200 transition-colors shadow-2xs"
                          >
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0f9a4a] font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-medium text-slate-800 truncate text-xs">
                              {namaAnggota}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fokus Tugas Bidang */}
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {bidang.fokusTugas}
                      </p>
                    </div>
                  </div>

                  {/* Tombol Aksi Modal */}
                  <div className="pt-4 mt-4 border-t border-slate-100 relative z-10">
                    <button
                      onClick={() => setActiveBidangModal(bidang)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-[#0f9a4a] text-slate-700 hover:text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>Rincian Tugas & Portofolio Bidang</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            TAB 3: PELINDUNG & PEMBINA (FORKOPIMDA & PEMKAB)
        ========================================================================= */}
        {activeTab === 'pembina' && (
          <div className="space-y-8">
            {/* Bagian A: Pelindung (Forkopimda) */}
            <div className="rounded-3xl p-6 sm:p-8 md:p-10 bg-white border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-600 shadow-sm">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    A. Pelindung Organisasi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Unsur Forum Koordinasi Pimpinan Daerah (Forkopimda) Kabupaten Soppeng
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {p.pelindung.map((pelindung) => (
                  <div
                    key={pelindung.no}
                    className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-amber-50/30 hover:to-amber-50/60 border border-slate-200 hover:border-amber-400/50 shadow-xs hover:shadow-md transition-all flex items-center gap-3.5 group"
                  >
                    <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-800 font-black text-xs flex items-center justify-center shadow-xs flex-shrink-0 group-hover:border-amber-400 group-hover:text-amber-700 transition-colors">
                      {pelindung.no}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate" title={pelindung.nama}>
                        {pelindung.nama}
                      </h4>
                      <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block mt-0.5">
                        {pelindung.jabatan}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bagian B: Pembina (Pemerintah Kabupaten Soppeng) */}
            <div className="rounded-3xl p-6 sm:p-8 md:p-10 bg-white border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-[#0f9a4a]/10 border border-[#0f9a4a]/30 flex items-center justify-center text-[#0f9a4a] shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    B. Pembina Organisasi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pemerintah Kabupaten Soppeng & Instansi Teknis Pembina Kepemudaan
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {p.pembina.map((pembina) => (
                  <div
                    key={pembina.no}
                    className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-emerald-50/30 hover:to-emerald-50/60 border border-slate-200 hover:border-[#0f9a4a]/40 shadow-xs hover:shadow-md transition-all flex items-center gap-3.5 group"
                  >
                    <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-800 font-black text-xs flex items-center justify-center shadow-xs flex-shrink-0 group-hover:border-[#0f9a4a] group-hover:text-[#0f9a4a] transition-colors">
                      {pembina.no}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate" title={pembina.nama}>
                        {pembina.nama}
                      </h4>
                      <span className="text-[10px] text-[#0f9a4a] font-bold uppercase tracking-wider block mt-0.5">
                        {pembina.jabatan}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: MAJELIS PERTIMBANGAN ORGANISASI (MPO)
        ========================================================================= */}
        {activeTab === 'mpo' && (
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 bg-white border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-[#0f9a4a]/10 border border-[#0f9a4a]/30 flex items-center justify-center text-[#0f9a4a] shadow-sm">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  C. Majelis Pertimbangan Organisasi (MPO)
                </h3>
                <p className="text-xs text-slate-500">
                  Dewan Penasehat & Pengarah Senior Purna Paskibraka Indonesia Kabupaten Soppeng
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {p.mpo.map((mpoItem) => (
                <div
                  key={mpoItem.no}
                  className="rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-[#12151B] to-slate-900 text-white border border-white/10 shadow-xl space-y-3 relative overflow-hidden group hover:border-amber-400/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                      {mpoItem.no}
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                      MPO PPI SOPPENG
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {mpoItem.nama}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {mpoItem.jabatan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            BANNER LEGALITAS SK PENETAPAN (OFFICIAL CERTIFICATE BANNER)
        ========================================================================= */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-slate-900 via-[#12151B] to-slate-900 text-white border-2 border-emerald-500/30 shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0f9a4a]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start gap-4 sm:gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-lg">
              <FileText className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" />
                <span>Legitimasi Hukum Sah</span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white">
                Surat Keputusan Pengurus Provinsi PPI Sulawesi Selatan
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-mono">
                Nomor: <strong className="text-amber-300">{p.nomorSk}</strong> • Tanggal Penetapan: <strong className="text-emerald-400">{p.tanggalSk}</strong>
              </p>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                {p.dasarHukum}
              </p>
            </div>
          </div>

          <a
            href="#kontak"
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#0f9a4a] via-emerald-500 to-[#0c7d3c] hover:from-[#13b558] hover:to-[#0f9a4a] text-white text-xs sm:text-sm font-bold shadow-xl shadow-[#0f9a4a]/30 transition-all flex items-center gap-2 flex-shrink-0 active:scale-95 cursor-pointer relative z-10 hover:scale-105"
          >
            <span>Hubungi Sekretariat</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* Modal Detail Rincian Bidang */}
      {activeBidangModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#12151B] border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden space-y-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0f9a4a]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Briefcase className="w-4 h-4" />
                <span>Rincian Personalia Bidang</span>
              </div>
              <button
                onClick={() => setActiveBidangModal(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0f9a4a]/20 border border-[#0f9a4a]/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                  {activeBidangModal.singkatan}
                </span>
                <h4 className="text-xl font-black text-white">
                  {activeBidangModal.namaBidang}
                </h4>
                <p className="text-xs text-amber-300 font-medium mt-0.5">
                  Periode 2026 - 2031 • SK No. {p.nomorSk}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                  Kordinator Bidang:
                </span>
                <h5 className="text-sm font-bold text-white">
                  {activeBidangModal.kordinator}
                </h5>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Daftar Anggota Bidang:
                </span>
                <div className="space-y-1.5 text-xs">
                  {activeBidangModal.anggota.map((nama, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-white/[0.04] border border-white/10"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-slate-200">{nama}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Fokus Program Kerja:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeBidangModal.fokusTugas}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActiveBidangModal(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
