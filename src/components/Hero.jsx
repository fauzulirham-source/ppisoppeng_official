import React, { useState, useEffect } from 'react';
import { siteData } from '../data/siteData';
import { Shield, ArrowRight, Award, Compass, Flag, Users, CheckCircle2, Sparkles, MapPin, Camera } from 'lucide-react';
import { fetchKegiatanList } from '../services/api';

export default function Hero() {
  const [latestDokumentasi, setLatestDokumentasi] = useState(null);

  useEffect(() => {
    async function loadLatest() {
      try {
        const res = await fetchKegiatanList(siteData.kegiatan.daftar);
        if (res.data && res.data.length > 0) {
          // Cari kegiatan terbaru yang memiliki foto valid (diurutkan dari id terbesar/terbaru)
          const withPhoto = res.data.find(
            item => item.foto && (item.foto.startsWith('data:') || item.foto.startsWith('http') || item.foto.startsWith('/'))
          );
          if (withPhoto) {
            setLatestDokumentasi(withPhoto);
          } else {
            setLatestDokumentasi(null);
          }
        }
      } catch (e) {
        console.error('Error loading latest hero documentation:', e);
      }
    }

    loadLatest();

    const handleUpdate = () => loadLatest();
    window.addEventListener('kegiatan-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('kegiatan-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);
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
    <section id="beranda" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#0F1115] text-white">
      {/* Background Glow & Lighting Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0f9a4a]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F1115] to-transparent pointer-events-none z-10" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Sisi Kiri: Headline & Deskripsi */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Badge Resmi */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f9a4a]/15 border border-[#0f9a4a]/40 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <Shield className="w-3.5 h-3.5 text-[#0f9a4a]" />
              <span>{siteData.brand.badgeText}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-amber-300 font-mono text-[11px]">Bumi Latemmamala</span>
            </div>

            {/* Headline Utama */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              PPI BIG. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f9a4a] via-emerald-400 to-amber-300">
                Bersahaja, Inovatif, Global
              </span>
            </h1>

            {/* Sub-judul & Teks Pengantar */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {siteData.brand.subMotto} Menjaga kehormatan Sang Merah Putih, mengokohkan semangat Pancasila, serta membangun karakter kepemimpinan pemuda yang tangguh dan berintegritas.
            </p>

            {/* Nilai / Pilar Mini Tags */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                <Flag className="w-3.5 h-3.5 text-[#0f9a4a]" />
                Pancasila & UUD 1945
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Kaderisasi Pemuda Berprestasi
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Kabupaten Soppeng
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3">
              <a
                href="#tentang"
                onClick={(e) => scrollToSection(e, 'tentang')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#0f9a4a] via-[#0f9a4a] to-[#0c7d3c] hover:from-[#13b558] hover:to-[#0f9a4a] text-white font-bold text-sm tracking-wide shadow-xl shadow-[#0f9a4a]/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <span>Pelajari Profil & Visi</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#kegiatan"
                onClick={(e) => scrollToSection(e, 'kegiatan')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/15 font-semibold text-sm transition-all duration-300"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Agenda Kegiatan</span>
              </a>

              <a
                href="#kontak"
                onClick={(e) => scrollToSection(e, 'kontak')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-transparent hover:border-white/10 font-medium text-sm transition-colors"
              >
                <span>Kontak Sekretariat</span>
              </a>
            </div>
          </div>

          {/* Sisi Kanan: Foto Showcase & Dokumentasi Monumental (Real-Time dari Upload Kegiatan) */}
          <div className="lg:col-span-5 relative group">
            {/* Outer Glow Halo Efek Sinematik */}
            <div className="absolute -inset-1.5 rounded-[36px] bg-gradient-to-r from-[#0f9a4a]/40 via-amber-500/30 to-[#0f9a4a]/40 blur-2xl opacity-60 group-hover:opacity-90 transition duration-700 pointer-events-none" />

            {/* Main Container Card dengan Glassmorphism Frame */}
            <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-b from-[#181D26] to-[#0E1117] border-2 border-white/15 group-hover:border-[#0f9a4a]/50 shadow-2xl transition-all duration-500">
              
              {/* Gambar Utama Upacara Pengibaran Bendera / Dokumentasi Terbaru */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-slate-950">
                <img
                  src={latestDokumentasi?.foto || "/images/hero-upacara-soppeng.jpg"}
                  alt={latestDokumentasi?.judul || "Upacara Pengibaran Bendera Paskibraka Kabupaten Soppeng"}
                  className="w-full h-full object-cover object-[center_35%] transform group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[1.03] contrast-[1.05]"
                />
                
                {/* Gradient Vignette Overlay Sinematik */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1117] via-black/20 to-transparent pointer-events-none" />

                {/* Badge Atas Kiri: Sang Saka Merah Putih / Dokumentasi Terkini */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-xl">
                  {latestDokumentasi?.foto ? (
                    <>
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Dokumentasi Terkini</span>
                    </>
                  ) : (
                    <>
                      <Flag className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
                      <span>Sang Saka Merah Putih</span>
                    </>
                  )}
                </div>

                {/* Badge Atas Kanan: Wilayah Kabupaten Soppeng */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/25 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-bold shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span className="truncate max-w-[140px]">{latestDokumentasi?.lokasi || "Kab. Soppeng"}</span>
                </div>
              </div>

              {/* Keterangan Dokumentasi Gagah & Menarik */}
              <div className="p-5 sm:p-6 bg-gradient-to-b from-[#141820] to-[#0D1016] border-t border-white/10 space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-white flex items-center gap-2 tracking-tight line-clamp-1">
                    <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{latestDokumentasi?.judul || "Upacara Detik-Detik Proklamasi RI"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0f9a4a] animate-pulse"></span>
                    {latestDokumentasi?.foto ? "Real-Time Update" : "Dokumentasi Resmi"}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal line-clamp-2">
                  {latestDokumentasi?.ringkasan ||
                    "Barisan kehormatan Pasukan Pengibar Bendera Pusaka (Paskibraka) Kabupaten Soppeng saat menjalankan tugas mulia di hadapan Sang Merah Putih, Bumi Latemmamala."}
                </p>

                {/* Micro Tags di Bawah */}
                <div className="pt-2 flex items-center gap-2 flex-wrap text-[10px] text-slate-400 font-medium border-t border-white/5">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                    #{latestDokumentasi?.kategori ? latestDokumentasi.kategori.replace(/\s+/g, '') : "PaskibrakaSoppeng"}
                  </span>
                  {latestDokumentasi?.tanggal && (
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                      {latestDokumentasi.tanggal}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-[#0f9a4a]/30 text-emerald-300">
                    Bumi Latemmamala
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Kolom Kartu Statistik / Highlight di Bagian Bawah Hero */}
        <div className="mt-14 sm:mt-18 pt-10 border-t border-white/10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {siteData.heroStats.map((stat, idx) => (
              <div
                key={idx}
                className="relative p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all duration-300 group"
                data-placeholder="true"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#0f9a4a] opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-[#0f9a4a] transition-colors">
                  {stat.value}
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {stat.caption}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
