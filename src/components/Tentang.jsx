import React, { useState } from 'react';
import { siteData } from '../data/siteData';
import {
  ShieldCheck,
  Target,
  Compass,
  FileText,
  Users,
  Award,
  ChevronDown,
  Quote,
  Sparkles,
  BookOpen,
  Calendar,
  Building2,
} from 'lucide-react';
import VerifikasiKeanggotaan from './VerifikasiKeanggotaan';

export default function Tentang() {
  const [activeTab, setActiveTab] = useState('visimisi');
  const [isSejarahExpanded, setIsSejarahExpanded] = useState(true);

  const t = siteData.tentang;

  return (
    <section id="tentang" className="py-20 md:py-28 bg-[#F8FAFC] text-[#0F1115] relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0f9a4a]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-[#0f9a4a]" />
            <span>{t.tagline}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <div className="w-16 h-1 bg-[#0f9a4a] mx-auto rounded-full mt-2" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-2">
            Purna Paskibraka Indonesia (PPI) Kabupaten Soppeng berhimpun untuk membina generasi muda yang tangguh, setia pada Pancasila, dan siap mengabdi untuk kemajuan Bumi Latemmamala.
          </p>
        </div>

        {/* Baris Utama: Sambutan Ketua (Kiri) & Visi Misi (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Kolom Kiri: Sambutan Ketua Pengurus */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            {/* Top accent badge */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span className="text-xs font-bold text-[#0f9a4a] uppercase tracking-wider flex items-center gap-1.5">
                <Quote className="w-4 h-4" />
                Catatan Pengurus
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                {t.sambutan.periode}
              </span>
            </div>

            {/* Profile Avatar Foto Ketua */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-18 rounded-2xl bg-gradient-to-br from-[#0f9a4a] to-emerald-800 p-0.5 border-2 border-amber-400 shadow-md relative overflow-hidden flex-shrink-0">
                <img
                  src={t.sambutan.fotoPlaceholder || '/images/ketua-ppi.png'}
                  alt={t.sambutan.nama}
                  className="w-full h-full object-cover object-top rounded-[13px]"
                />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {t.sambutan.nama}
                </h4>
                <p className="text-xs font-semibold text-[#0f9a4a]">{t.sambutan.jabatan}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {t.sambutan.periode}
                </p>
              </div>
            </div>

            {/* Isi Pesan Sambutan */}
            <div className="relative">
              <p className="text-sm text-slate-700 leading-relaxed italic bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                "{t.sambutan.pesan}"
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Sekretariat Kab. Soppeng
              </span>
              <span className="font-semibold text-slate-700">PPI Soppeng</span>
            </div>
          </div>

          {/* Kolom Kanan: Visi & Misi */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Kartu Visi */}
            <div className="bg-gradient-to-br from-[#0F1115] via-[#161920] to-[#1E222B] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#0f9a4a]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#0f9a4a]/20 border border-[#0f9a4a]/40 flex items-center justify-center text-[#0f9a4a]">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-white">Visi Organisasi</h3>
                  <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">Arah & Cita-Cita PPI Soppeng</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mt-3">
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                  {t.visi}
                </p>
              </div>
            </div>

            {/* Kartu Misi */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/40">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">Misi Organisasi</h3>
                  <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">Langkah Strategis Pengabdian</p>
                </div>
              </div>

              <div className="space-y-3">
                {t.misi.map((misiItem, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-100 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#0f9a4a] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                      {misiItem}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Fitur Verifikasi Keanggotaan & Pencarian Database Anggota */}
        <VerifikasiKeanggotaan />

        {/* Sejarah & Legalitas Organisasi (Accordion / Linimasa) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#0f9a4a]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Profil Singkat, Sejarah & Dasar Hukum
                </h3>
                <p className="text-xs text-slate-500">
                  Keterangan historis dan legalitas kepengurusan PPI di Kabupaten Soppeng
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSejarahExpanded(!isSejarahExpanded)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <span>{isSejarahExpanded ? 'Tutup Rincian' : 'Buka Rincian'}</span>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${isSejarahExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {isSejarahExpanded && (
            <div className="pt-6 space-y-6 text-sm">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0f9a4a] uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  <span>Sejarah Perjalanan Organisasi</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                  {t.sejarah.ringkasan}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    Legalitas & Surat Keputusan (SK)
                  </span>
                  <p className="text-xs font-mono text-slate-800 font-semibold">
                    {t.sejarah.dasarHukum}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Wilayah Kedudukan Organisasi
                  </span>
                  <p className="text-xs font-medium text-slate-800">
                    {t.sejarah.kedudukan}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Struktur Inti Badan Pengurus Harian */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Susunan Pengurus Harian Kabupaten
              </h3>
              <p className="text-xs text-slate-500">
                Badan Pengurus Harian (BPH) PPI Kabupaten Soppeng Periode 2026 - 2031 (SK.006 /PPI.23/IX/2026)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#0f9a4a] bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
                Masa Bakti 2026 - 2031
              </span>
              <a
                href="#pengurus"
                className="text-xs font-semibold text-white bg-[#0f9a4a] hover:bg-[#0c7c3b] px-3.5 py-1.5 rounded-full transition-colors inline-flex items-center gap-1 shadow-sm"
              >
                Struktur Lengkap &rarr;
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {t.strukturPengurus.map((pengurus, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-[#0f9a4a]/40 hover:shadow-md transition-all flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0f9a4a] to-emerald-800 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                  {pengurus.jabatan.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-[#0f9a4a] uppercase tracking-wider block">
                    {pengurus.jabatan}
                  </span>
                  <p className="text-xs font-bold text-slate-900 truncate" title={pengurus.nama}>
                    {pengurus.nama}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {pengurus.angkatan}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
