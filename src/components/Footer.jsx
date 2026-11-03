import React from 'react';
import { siteData } from '../data/siteData';
import PpiLogo from './PpiLogo';
import {
  ArrowUp,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getSocialIcon } from './SocialIcons';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const navLinks = [
    { label: 'Beranda', id: 'beranda' },
    { label: 'Tentang Organisasi', id: 'tentang' },
    { label: 'Agenda Kegiatan', id: 'kegiatan' },
    { label: 'Pengurus Harian', id: 'pengurus' },
    { label: 'Kontak Sekretariat', id: 'kontak' },
  ];

  return (
    <footer className="bg-[#07090D] text-white border-t border-emerald-500/20 relative overflow-hidden">
      {/* Top Luminous Gradient Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500 via-amber-400 to-transparent opacity-90 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />

      {/* Ambient Corner Light Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* Kolom 1: Brand & Keterangan Resmi (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <PpiLogo className="w-12 h-12 shrink-0 drop-shadow-[0_0_12px_rgba(15,154,74,0.4)]" textColor="text-white" />
            </div>
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{siteData.brand.motto}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm pt-1">
                Wadah pembinaan karakter, integritas kepemudaan, dan pengabdian purna paskibraka di Bumi Latemmamala, Kabupaten Soppeng, Sulawesi Selatan.
              </p>
            </div>

            {/* Media Sosial Resmi Pills */}
            <div className="pt-1 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Saluran Informasi Resmi
              </span>
              <div className="flex flex-wrap gap-2">
                {siteData.kontak.sosialMedia.map((sosmed, idx) => {
                  const iconColors = {
                    Instagram: 'text-pink-400 border-pink-500/30 hover:border-pink-500/60 hover:bg-pink-500/10',
                    TikTok: 'text-cyan-300 border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-500/10',
                    YouTube: 'text-red-400 border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10',
                    Facebook: 'text-blue-400 border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/10',
                  };
                  const colorClass = iconColors[sosmed.platform] || 'text-emerald-400 border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10';

                  return (
                    <a
                      key={idx}
                      href={sosmed.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121620] border ${colorClass} text-xs text-slate-300 hover:text-white transition-all group shadow-sm hover:scale-105 active:scale-95`}
                      title={`${sosmed.platform}: ${sosmed.handle}`}
                    >
                      <span className="shrink-0 group-hover:scale-110 transition-transform">
                        {getSocialIcon(sosmed.platform, 'w-3.5 h-3.5')}
                      </span>
                      <span className="font-semibold text-[11px]">{sosmed.platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Kolom 2: Navigasi Cepat (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Navigasi Halaman
              </h4>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => scrollToSection(e, link.id)}
                    className="group inline-flex items-center gap-2 text-slate-300 hover:text-emerald-300 transition-all duration-200 hover:translate-x-1"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    <span className="group-hover:font-semibold">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak Sekretariat Kabupaten (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Sekretariat Kabupaten
              </h4>
            </div>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-2xl bg-[#121620] border border-white/5 space-y-1.5">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <a
                    href="https://www.google.com/maps?q=-4.351396852156139,119.88233899384068"
                    target="_blank"
                    rel="noreferrer"
                    className="leading-relaxed text-slate-200 hover:text-emerald-300 transition-colors"
                    title="Buka Lokasi di Google Maps"
                  >
                    {siteData.kontak.alamat.teks}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${siteData.kontak.telepon.rawNumber}?text=Halo%20Pengurus%20PPI%20Kabupaten%20Soppeng`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-[#121620] hover:bg-emerald-500/15 border border-white/5 hover:border-emerald-500/30 flex items-center gap-2 transition-all group"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-mono text-[11px] text-slate-300 group-hover:text-white truncate">
                    {siteData.kontak.telepon.teks}
                  </span>
                </a>

                <a
                  href={siteData.kontak.email.mailTo}
                  className="p-3 rounded-xl bg-[#121620] hover:bg-amber-500/15 border border-white/5 hover:border-amber-500/30 flex items-center gap-2 transition-all group"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-mono text-[11px] text-slate-300 group-hover:text-white truncate">
                    {siteData.kontak.email.teks}
                  </span>
                </a>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-400 leading-relaxed block">
                  Media informasi resmi Purna Paskibraka Indonesia Kabupaten Soppeng. Terdaftar dan terverifikasi di bawah SK Pengprov PPI Sulawesi Selatan.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <p>
              &copy; {new Date().getFullYear()} Purna Paskibraka Indonesia Kabupaten Soppeng. Seluruh hak cipta dilindungi.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 hover:from-emerald-500/25 hover:to-teal-500/25 text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            aria-label="Kembali ke Atas"
          >
            <span className="font-semibold text-xs">Kembali ke Atas</span>
            <ArrowUp className="w-4 h-4 text-emerald-400 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}
