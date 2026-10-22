import React from 'react';
import { X, FileCode, Image, CheckCircle, ExternalLink, Sparkles, BookOpen } from 'lucide-react';

export default function PlaceholderGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#12151B] border border-white/15 rounded-3xl p-6 md:p-8 text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Panduan Penggantian Teks & Foto</h3>
              <p className="text-xs text-slate-400">
                Cara praktis melengkapi data resmi PPI Kabupaten Soppeng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Tutup Panduan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="py-5 overflow-y-auto space-y-6 text-sm text-slate-300 pr-2">
          {/* Card 1: Ganti Teks Terpusat */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2.5 text-base font-semibold text-white mb-2">
              <FileCode className="w-5 h-5 text-red-500" />
              <span>1. Mengganti Seluruh Teks & Informasi (Terpusat)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Semua teks bertanda kurung siku <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono text-xs">[ ... ]</code> berada dalam 1 file terpusat yang sangat mudah diedit:
            </p>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-emerald-400 flex items-center justify-between">
              <span>src/data/siteData.js</span>
              <span className="text-[11px] text-slate-400">Teks Visi, Misi, Sejarah, Kontak, dll.</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              <li>Buka file tersebut di text editor Anda.</li>
              <li>Cari bagian <code className="text-amber-300">tentang</code>, <code className="text-amber-300">kegiatan</code>, atau <code className="text-amber-300">kontak</code>.</li>
              <li>Ganti teks placeholder dengan data resmi PPI Kabupaten Soppeng, lalu simpan.</li>
            </ul>
          </div>

          {/* Card 2: Memasang Logo Resmi */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2.5 text-base font-semibold text-white mb-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>2. Memasang File Logo Asli Organisasi</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              Website sudah dilengkapi lambang teratai PPI SVG resmi bawaan. Jika Anda memiliki file logo transparan (PNG/SVG):
            </p>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-amber-400 mb-2">
              Simpan file di: <span className="text-white">public/logo-ppi.png</span>
            </div>
            <p className="text-xs text-slate-400">
              Lalu di <code className="text-white font-mono">src/data/siteData.js</code>, ubah baris <code className="text-amber-300 font-mono">logoUrl: null</code> menjadi <code className="text-emerald-400 font-mono">logoUrl: '/logo-ppi.png'</code>.
            </p>
          </div>

          {/* Card 3: Menambahkan Foto Dokumentasi */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2.5 text-base font-semibold text-white mb-2">
              <Image className="w-5 h-5 text-cyan-400" />
              <span>3. Memasang Foto Kegiatan & Dokumentasi</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              Setiap kartu kegiatan dan galeri memiliki instruksi nama file rekomendasi. Cukup masukkan file foto ke folder:
            </p>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-cyan-300 mb-2">
              public/images/[nama_foto.jpg]
            </div>
            <p className="text-xs text-slate-400">
              Rekomendasi rasio foto adalah <strong className="text-white">3:2</strong> atau <strong className="text-white">16:9</strong> dengan resolusi minimal 1200x800 pixel agar tampil tajam di layar desktop dan ponsel.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Website siap digunakan & dideploy
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs tracking-wide transition-colors shadow-lg shadow-red-600/30"
          >
            Mengerti, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
