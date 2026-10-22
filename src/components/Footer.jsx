import React from 'react';
import { siteData } from '../data/siteData';
import PpiLogo from './PpiLogo';
import { ArrowUp, Heart, Shield, MapPin, Mail, Phone } from 'lucide-react';

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

  return (
    <footer className="bg-[#0A0C0F] text-white border-t border-red-600/30 relative overflow-hidden">
      {/* Red accent line at very top */}
      <div className="h-1 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Kolom 1: Brand & Keterangan (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <PpiLogo className="w-12 h-12" textColor="text-white" />
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm pt-1">
              {siteData.brand.motto}. Wadah pembinaan karakter, integritas kepemudaan, dan pengabdian purna paskibraka di Kabupaten Soppeng, Sulawesi Selatan.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href="https://www.instagram.com/ppisoppeng_official?rpxt=Y2p5M2plMm00cXpv"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#0f9a4a]/20 border border-white/10 hover:border-[#0f9a4a]/40 text-xs text-slate-300 hover:text-white transition-all group"
              >
                <span className="w-2 h-2 rounded-full bg-[#0f9a4a] animate-pulse"></span>
                <span>Instagram: <strong>@ppisoppeng_official</strong></span>
              </a>
              <a
                href="https://www.tiktok.com/@ppisoppeng?_r=1&_t=ZS-9AjZicHTMqk"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#0f9a4a]/20 border border-white/10 hover:border-[#0f9a4a]/40 text-xs text-slate-300 hover:text-white transition-all group"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>TikTok: <strong>@ppisoppeng</strong></span>
              </a>
            </div>

          </div>

          {/* Kolom 2: Navigasi Cepat (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#0f9a4a] uppercase tracking-widest">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <a
                  href="#beranda"
                  onClick={(e) => scrollToSection(e, 'beranda')}
                  className="hover:text-white transition-colors"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#tentang"
                  onClick={(e) => scrollToSection(e, 'tentang')}
                  className="hover:text-white transition-colors"
                >
                  Tentang Organisasi
                </a>
              </li>
              <li>
                <a
                  href="#kegiatan"
                  onClick={(e) => scrollToSection(e, 'kegiatan')}
                  className="hover:text-white transition-colors"
                >
                  Agenda Kegiatan
                </a>
              </li>
              <li>
                <a
                  href="#pengurus"
                  onClick={(e) => scrollToSection(e, 'pengurus')}
                  className="hover:text-white transition-colors"
                >
                  Pengurus Harian
                </a>
              </li>
              <li>
                <a
                  href="#kontak"
                  onClick={(e) => scrollToSection(e, 'kontak')}
                  className="hover:text-white transition-colors"
                >
                  Kontak Sekretariat
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak Singkat & Wilayah (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-[#0f9a4a] uppercase tracking-widest">
              Sekretariat Kabupaten
            </h4>
            
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {siteData.kontak.alamat.teks}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className="font-mono">{siteData.kontak.telepon.teks}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className="font-mono">{siteData.kontak.email.teks}</span>
              </div>
            </div>

            <div className="pt-3">
              <span className="text-[11px] text-slate-500 block leading-tight">
                {siteData.footer.disclaimer}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            {siteData.footer.copyright}
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            aria-label="Kembali ke Atas"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-4 h-4 text-red-500" />
          </button>
        </div>

      </div>
    </footer>
  );
}
