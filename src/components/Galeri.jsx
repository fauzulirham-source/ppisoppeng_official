import React, { useState } from 'react';
import { siteData } from '../data/siteData';
import PhotoPlaceholder from './PhotoPlaceholder';
import {
  Image as ImageIcon,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Sparkles,
  Download,
} from 'lucide-react';

export default function Galeri() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const g = siteData.galeri;

  const filteredPhotos =
    selectedCategory === 'Semua'
      ? g.fotoList
      : g.fotoList.filter((item) => item.kategori === selectedCategory);

  const activePhoto =
    lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) =>
        prev === 0 ? filteredPhotos.length - 1 : prev - 1
      );
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) =>
        prev === filteredPhotos.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <section id="galeri" className="py-20 md:py-28 bg-[#F8FAFC] text-slate-900 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-slate-300/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{g.tagline}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {g.title}
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mt-2" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-2">
            {g.deskripsi}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {g.kategoriList.map((kat) => (
            <button
              key={kat}
              onClick={() => setSelectedCategory(kat)}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                selectedCategory === kat
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* Galeri Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((foto, idx) => (
            <div
              key={foto.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-xl hover:border-red-500/50 transition-all duration-300 cursor-pointer"
            >
              {/* Photo / Placeholder Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <PhotoPlaceholder
                  src={foto.sampleImageUrl}
                  fileName={foto.fileRekomendasi.replace('public/images/', '')}
                  category={foto.kategori}
                  aspectRatio="aspect-[4/3]"
                  recommendedSize={foto.rekomendasiUkuran}
                  showBadge={true}
                />

                {/* Hover Overlay with Zoom Icon */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Caption & Metadata Bar */}
              <div className="p-4 sm:p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    {foto.kategori}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px]" data-placeholder="true">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {foto.tanggal}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1" data-placeholder="true">
                  {foto.judul}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed" data-placeholder="true">
                  {foto.keterangan}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono" data-placeholder="true">
                  <span className="truncate">{foto.fileRekomendasi}</span>
                  <span className="text-emerald-600 font-semibold">{foto.sampleImageUrl ? 'Contoh Nyata' : 'Placeholder'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Tutup Pratinjau"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            {filteredPhotos.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm"
                  aria-label="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm"
                  aria-label="Foto Selanjutnya"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Lightbox Content Container */}
            <div className="relative max-w-4xl w-full bg-[#161920] rounded-3xl border border-white/15 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Media View */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-black flex items-center justify-center overflow-hidden">
                {activePhoto.sampleImageUrl ? (
                  <img
                    src={activePhoto.sampleImageUrl}
                    alt={activePhoto.judul}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="p-8 text-center text-white space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-red-500">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <p className="text-base font-semibold text-slate-200">
                      Pratinjau Placeholder Foto
                    </p>
                    <p className="text-xs text-amber-300 font-mono">
                      File: {activePhoto.fileRekomendasi}
                    </p>
                  </div>
                )}
              </div>

              {/* Lightbox Information Bar */}
              <div className="p-6 bg-[#161920] border-t border-white/10 text-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/40 font-semibold">
                      {activePhoto.kategori}
                    </span>
                    <span className="text-slate-400 font-mono" data-placeholder="true">
                      {activePhoto.tanggal}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {lightboxIndex + 1} dari {filteredPhotos.length}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold" data-placeholder="true">
                  {activePhoto.judul}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed" data-placeholder="true">
                  {activePhoto.keterangan}
                </p>

                <div className="pt-2 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 border-t border-white/5">
                  <span className="flex items-center gap-1.5" data-placeholder="true">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {activePhoto.lokasiPlaceholder}
                  </span>
                  <span className="font-mono text-amber-400/90">
                    Rekomendasi: {activePhoto.rekomendasiUkuran}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
