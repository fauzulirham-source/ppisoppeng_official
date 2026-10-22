import React, { useState } from 'react';
import { siteData } from '../data/siteData';
import officialLogo from '../assets/logo-ppi-soppeng.png';

/**
 * Komponen Logo Purna Paskibraka Indonesia (PPI) Kabupaten Soppeng.
 * - Menggunakan logo resmi PPI Soppeng (lingkaran hitam emas dengan bunga teratai dan rantai persatuan).
 * - Dilengkapi fallback SVG jika berkas gambar gagal dimuat.
 */
export default function PpiLogo({ className = "w-11 h-11", showText = true, textColor = "text-white" }) {
  const [imgError, setImgError] = useState(false);
  const logoSource = officialLogo || siteData.brand.logoUrl || '/logo-ppi-soppeng.png';

  return (
    <div className="flex items-center gap-3 group select-none">
      {/* Wadah Lambang / Emblem */}
      <div className={`relative flex-shrink-0 ${className} transition-all duration-300 group-hover:scale-105`}>
        {!imgError ? (
          <div className="w-full h-full rounded-full overflow-hidden bg-black border border-amber-400/40 shadow-lg shadow-black/40 ring-1 ring-amber-400/20 group-hover:border-amber-400 transition-colors">
            <img
              src={logoSource}
              alt="Logo Resmi Purna Paskibraka Indonesia Soppeng"
              className="w-full h-full object-cover object-center"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          /* Fallback SVG Emblem Kehormatan jika gambar gagal dimuat */
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md"
            aria-label="Lambang PPI Kabupaten Soppeng"
          >
            <defs>
              <linearGradient id="ppiGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
              <linearGradient id="ppiRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#17af5e" />
                <stop offset="100%" stopColor="#0f9a4a" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="47" fill="#0F1115" stroke="url(#ppiGoldGrad)" strokeWidth="3" />
            <circle cx="50" cy="50" r="43" fill="#0F1115" stroke="url(#ppiGoldGrad)" strokeWidth="1" />
            <path d="M 50,28 C 44,42 44,58 50,66 C 56,58 56,42 50,28 Z" fill="url(#ppiGoldGrad)" />
            <path d="M 50,38 C 40,40 33,52 38,62 C 44,63 48,56 50,52 Z" fill="url(#ppiGoldGrad)" opacity="0.9" />
            <path d="M 50,38 C 60,40 67,52 62,62 C 56,63 52,56 50,52 Z" fill="url(#ppiGoldGrad)" opacity="0.9" />
            <text x="50" y="80" textAnchor="middle" fill="url(#ppiGoldGrad)" fontSize="7" fontWeight="bold">SOPPENG</text>
          </svg>
        )}

        {/* Indikator Ping status aktif organisasi */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-black"></span>
        </span>
      </div>

      {/* Label Identitas Brand */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`text-base font-extrabold tracking-tight ${textColor} group-hover:text-red-500 transition-colors`}>
              {siteData.brand.shortName}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-widest">
              Resmi
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium leading-none tracking-wide">
            Pengurus {siteData.brand.chapter}
          </span>
        </div>
      )}
    </div>
  );
}
