import React, { useState, useEffect } from 'react';
import PpiLogo from './PpiLogo';
import { Menu, X, PhoneCall, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Tentang', href: '#tentang' },
    { name: 'Kegiatan', href: '#kegiatan' },
    { name: 'Pengurus', href: '#pengurus' },
    { name: 'Kontak', href: '#kontak' },
  ];

  // Efek bayangan saat discroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Deteksi active section berdasarkan posisi scroll
      const sections = ['beranda', 'tentang', 'kegiatan', 'pengurus', 'kontak'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const navHeight = 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(targetId);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0F1115]/90 backdrop-blur-md border-b border-white/10 shadow-xl shadow-black/30 py-3'
            : 'bg-[#0F1115]/70 backdrop-blur-sm border-b border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Identitas */}
            <a
              href="#beranda"
              onClick={(e) => handleNavClick(e, '#beranda')}
              className="focus:outline-none"
              aria-label="Purna Paskibraka Indonesia Kabupaten Soppeng"
            >
              <PpiLogo className="w-10 h-10 sm:w-11 sm:h-11" textColor="text-white" />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative px-3.5 py-2 text-sm font-semibold tracking-wide rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-red-600 rounded-full animate-fade-in" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Tombol Aksi Kanan (Desktop) */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Tombol CTA Kontak */}
              <a
                href="#kontak"
                onClick={(e) => handleNavClick(e, '#kontak')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-md shadow-red-600/30 active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Hubungi Kami</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-colors focus:outline-none"
                aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-black/80 backdrop-blur-md animate-fade-in pt-20 pb-8 px-6 flex flex-col justify-between">
          <div className="space-y-2 mt-4">
            <div className="pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Navigasi Halaman
              </span>
            </div>
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-red-600/20 text-white border border-red-500/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </a>
              );
            })}

          </div>

          <div className="pt-6 border-t border-white/10">
            <a
              href="#kontak"
              onClick={(e) => handleNavClick(e, '#kontak')}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-600/40"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hubungi Sekretariat PPI Soppeng</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
