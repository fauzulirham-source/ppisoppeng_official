import React, { useState } from 'react';
import { Image as ImageIcon, Camera, Sparkles, AlertCircle } from 'lucide-react';

/**
 * Komponen PhotoPlaceholder
 * Menyediakan tampilan foto yang bersih dan adaptif:
 * - Jika ada URL gambar valid (misal: /images/hero-paskibraka.jpg), foto akan dimuat dengan anggun.
 * - Jika foto belum ada / error, komponen akan menampilkan visual placeholder yang rapi,
 *   berwibawa, dan dilengkapi instruksi letak file serta rekomendasi resolusi.
 */
export default function PhotoPlaceholder({
  src = null,
  alt = "Foto Kegiatan Purna Paskibraka Indonesia Soppeng",
  fileName = "kegiatan-ppi.jpg",
  recommendedSize = "1200 x 800 px",
  aspectRatio = "aspect-[16/10]",
  category = "Dokumentasi",
  className = "",
  showBadge = true,
  onClick = null,
}) {
  const [loadError, setLoadError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const hasValidImage = src && !loadError;

  return (
    <div
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#12151B] via-[#1A1E26] to-[#0F1115] border border-white/10 group ${aspectRatio} ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {hasValidImage ? (
        <>
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            onError={() => setLoadError(true)}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none opacity-80 group-hover:opacity-90 transition-opacity" />
        </>
      ) : (
        /* Tampilan Placeholder Grafis Berwibawa */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none">
          {/* Grid background texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#0f9a4a_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          
          {/* Subtle red glow in center */}
          <div className="absolute w-32 h-32 rounded-full bg-red-600/15 blur-2xl pointer-events-none" />

          {/* Camera Viewfinder Crosshairs */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-red-500/50" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-red-500/50" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-red-500/50" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-red-500/50" />

          {/* Icon Badge */}
          <div className="relative z-10 mb-3 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-inner group-hover:border-red-500/50 group-hover:scale-110 transition-all duration-300">
            <Camera className="w-7 h-7 text-red-500" />
          </div>

          {/* Text Placeholder Instructions */}
          <div className="relative z-10 max-w-xs space-y-1.5" data-placeholder="true">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3 h-3" />
              Tempat Foto Kegiatan
            </span>
            <p className="text-xs font-mono font-medium text-slate-300 tracking-tight break-all">
              public/images/{fileName}
            </p>
            <p className="text-[11px] text-slate-400">
              Rekomendasi: <span className="text-slate-300 font-semibold">{recommendedSize}</span>
            </p>
          </div>
        </div>
      )}

      {/* Floating Category Badge */}
      {showBadge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-white/15 shadow-sm">
            {category}
          </span>
        </div>
      )}

      {/* Placeholder Tag Pill at bottom if image is loaded */}
      {hasValidImage && (
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-red-600/80 text-white backdrop-blur shadow">
            Contoh Foto Aktif
          </span>
        </div>
      )}
    </div>
  );
}
