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
  UserCheck,
} from 'lucide-react';
import PpiLogo from './PpiLogo';

export default function Pengurus() {
  const [activeTab, setActiveTab] = useState('bph'); // 'bph' | 'bidang' | 'pembina' | 'mpo'
  const [activeBidangModal, setActiveBidangModal] = useState(null);

  const p = siteData.pengurus;

  return (
    <section id="pengurus" className="py-20 md:py-28 bg-[#F8FAFC] text-slate-900 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#0f9a4a]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f9a4a]/10 border border-[#0f9a4a]/30 text-[#0f9a4a] text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>{p.tagline}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {p.title}
          </h2>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 text-amber-400 text-xs font-bold shadow-sm">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{p.periode}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0f9a4a] text-xs font-semibold font-mono">
              <FileText className="w-3.5 h-3.5" />
              <span>No. {p.nomorSk}</span>
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {p.deskripsi}
          </p>
        </div>

        {/* Tab Navigasi Kategori Kepengurusan */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          <button
            onClick={() => setActiveTab('bph')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'bph'
                ? 'bg-[#0f9a4a] text-white shadow-lg shadow-[#0f9a4a]/30 scale-105'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Pengurus Harian (BPH)</span>
          </button>

          <button
            onClick={() => setActiveTab('bidang')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'bidang'
                ? 'bg-[#0f9a4a] text-white shadow-lg shadow-[#0f9a4a]/30 scale-105'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Bidang - Bidang (6 Bidang)</span>
          </button>

          <button
            onClick={() => setActiveTab('pembina')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'pembina'
                ? 'bg-[#0f9a4a] text-white shadow-lg shadow-[#0f9a4a]/30 scale-105'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Pelindung & Pembina</span>
          </button>

          <button
            onClick={() => setActiveTab('mpo')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'mpo'
                ? 'bg-[#0f9a4a] text-white shadow-lg shadow-[#0f9a4a]/30 scale-105'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Majelis Pertimbangan Organisasi (MPO)</span>
          </button>
        </div>

        {/* TAB 1: PENGURUS HARIAN (BPH) */}
        {activeTab === 'bph' && (
          <div className="space-y-6">
            {/* Card Utama: KETUA */}
            {p.pengurusHarian
              .filter((item) => item.isUtama)
              .map((ketua) => (
                <div
                  key={ketua.id}
                  className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-[#14181F] to-slate-900 text-white border-2 border-amber-400/60 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#0f9a4a]/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -left-10 -bottom-10 w-44 h-44 opacity-10 pointer-events-none">
                    <PpiLogo showText={false} className="w-full h-full" />
                  </div>

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                    {/* Avatar Foto Ketua PPI (Kotak Hijau List Kuning/Amber) */}
                    <div className="lg:col-span-3 flex justify-center lg:justify-start">
                      <div className="w-32 h-36 sm:w-36 sm:h-44 rounded-3xl bg-gradient-to-br from-[#0f9a4a] to-emerald-800 p-1 border-2 border-amber-400 shadow-xl shadow-[#0f9a4a]/40 relative overflow-hidden flex items-center justify-center group">
                        <img
                          src={ketua.foto || '/images/ketua-ppi.png'}
                          alt={ketua.nama}
                          className="w-full h-full object-cover object-top rounded-[20px] transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    {/* Informasi Ketua */}
                    <div className="lg:col-span-9 space-y-3 text-center lg:text-left">
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-sm">
                          <Crown className="w-3.5 h-3.5" />
                          <span>{ketua.jabatan}</span>
                        </span>
                        <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-xl">
                          Periode 2026 - 2031
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {ketua.nama}
                      </h3>

                      <p className="text-xs sm:text-sm text-amber-300 font-semibold">
                        {ketua.peran} • Pengurus Kabupaten PPI Soppeng
                      </p>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                        {ketua.tugasUtama}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

            {/* Grid Anggota BPH Lainnya */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {p.pengurusHarian
                .filter((item) => !item.isUtama)
                .map((bph) => (
                  <div
                    key={bph.id}
                    className="rounded-3xl p-6 bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#0f9a4a]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      {/* Top Bar: Role Badge */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0f9a4a]/10 border border-[#0f9a4a]/20 text-[#0f9a4a] text-xs font-bold">
                          <Award className="w-3.5 h-3.5" />
                          <span>{bph.jabatan}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-semibold">
                          BPH
                        </span>
                      </div>

                      {/* Avatar & Nama */}
                      <div className="flex items-center gap-3.5 pt-1">
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-[#0f9a4a]/20 group-hover:to-emerald-100 text-[#0f9a4a] flex items-center justify-center flex-shrink-0 transition-colors border border-slate-200">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0f9a4a] transition-colors leading-snug">
                            {bph.nama}
                          </h4>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                            {bph.peran}
                          </p>
                        </div>
                      </div>

                      {/* Uraian Tugas */}
                      <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                        {bph.tugasUtama}
                      </p>
                    </div>

                    <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Masa Bakti 2026-2031</span>
                      <span className="text-[#0f9a4a] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Aktif
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 2: BIDANG - BIDANG KEPENGURUSAN */}
        {activeTab === 'bidang' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {p.bidangBidang.map((bidang) => (
              <div
                key={bidang.id}
                className="rounded-3xl p-6 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-[#0f9a4a]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Nama Bidang */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider block mb-1">
                      {bidang.singkatan}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0f9a4a] transition-colors leading-snug">
                      {bidang.namaBidang}
                    </h3>
                  </div>

                  {/* Kordinator */}
                  <div className="p-3.5 rounded-2xl bg-[#0f9a4a]/5 border border-[#0f9a4a]/20 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#0f9a4a] tracking-wider block">
                      Kordinator Bidang:
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {bidang.kordinator}
                    </h4>
                  </div>

                  {/* Daftar Anggota */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Anggota ({bidang.anggota.length} orang):
                    </span>
                    <div className="space-y-1 text-xs text-slate-700">
                      {bidang.anggota.map((namaAnggota, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 py-1 px-2.5 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-medium truncate">{namaAnggota}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fokus Tugas */}
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {bidang.fokusTugas}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => setActiveBidangModal(bidang)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-[#0f9a4a] text-slate-700 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Rincian Tugas Bidang</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: PELINDUNG & PEMBINA */}
        {activeTab === 'pembina' && (
          <div className="space-y-8">
            {/* Bagian A: Pelindung */}
            <div className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-600">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    A. Pelindung
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
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-[#0f9a4a]/5 border border-slate-200 hover:border-[#0f9a4a]/30 transition-colors flex items-center gap-3"
                  >
                    <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                      {pelindung.no}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {pelindung.nama}
                      </h4>
                      <span className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider">
                        {pelindung.jabatan}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bagian B: Pembina */}
            <div className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-[#0f9a4a]/10 border border-[#0f9a4a]/30 flex items-center justify-center text-[#0f9a4a]">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    B. Pembina
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pemerintah Kabupaten Soppeng & Instansi Teknis Pembinaan Kepemudaan
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {p.pembina.map((pembina) => (
                  <div
                    key={pembina.no}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-[#0f9a4a]/5 border border-slate-200 hover:border-[#0f9a4a]/30 transition-colors flex items-center gap-3"
                  >
                    <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                      {pembina.no}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {pembina.nama}
                      </h4>
                      <span className="text-[10px] text-[#0f9a4a] font-semibold uppercase tracking-wider">
                        {pembina.jabatan}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MAJELIS PERTIMBANGAN ORGANISASI (MPO) */}
        {activeTab === 'mpo' && (
          <div className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#0f9a4a]/10 border border-[#0f9a4a]/30 flex items-center justify-center text-[#0f9a4a]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
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
                  className="rounded-2xl p-5 bg-gradient-to-br from-slate-900 via-[#12151B] to-slate-900 text-white border border-white/10 shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                      {mpoItem.no}
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest">
                      MPO PPI SOPPENG
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">
                      {mpoItem.nama}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {mpoItem.jabatan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Banner Legalitas SK Penetapan */}
        <div className="mt-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0f9a4a]/10 border border-[#0f9a4a]/30 flex items-center justify-center text-[#0f9a4a] flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                Surat Keputusan Pengurus Provinsi PPI Sulawesi Selatan
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">
                Nomor: <strong className="text-slate-800">{p.nomorSk}</strong> • Tanggal: <strong className="text-slate-800">{p.tanggalSk}</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                {p.dasarHukum}
              </p>
            </div>
          </div>

          <a
            href="#kontak"
            className="px-6 py-3 rounded-2xl bg-[#0f9a4a] hover:bg-[#0c7d3c] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0f9a4a]/30 transition-all flex items-center gap-2 flex-shrink-0 active:scale-95"
          >
            <span>Hubungi Sekretariat</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* Modal Detail Rincian Bidang */}
      {activeBidangModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#12151B] border border-amber-500/40 rounded-3xl p-6 sm:p-7 text-white shadow-2xl overflow-hidden space-y-5">
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
                <div className="space-y-1 text-xs">
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
