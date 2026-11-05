import React, { useState, useEffect } from 'react';
import { siteData } from '../data/siteData';
import { Shield, ArrowRight, Award, Compass, Flag, Users, CheckCircle2, Sparkles, MapPin, Camera } from 'lucide-react';
import { fetchKegiatanList, fetchCustomAnggotaList, subscribeToKegiatanSync } from '../services/api';
import { databaseAnggota } from '../data/databaseAnggota';

export default function Hero() {
  const [latestDokumentasi, setLatestDokumentasi] = useState(null);
  const [customAnggotaCount, setCustomAnggotaCount] = useState(() => {
    try {
      const raw = localStorage.getItem('ppi_custom_anggota');
      return raw ? JSON.parse(raw).length : 0;
    } catch (e) {
      return 0;
    }
  });

  useEffect(() => {
    async function loadLatest() {
      try {
        const res = await fetchKegiatanList(siteData.kegiatan.daftar);
        if (res && res.data && res.data.length > 0) {
          // Selalu prioritaskan kegiatan yang paling baru ditambahkan (urutan pertama)
          const latest = res.data[0];
          setLatestDokumentasi(latest);
        }
      } catch (e) {
        console.error('Error loading latest hero documentation:', e);
      }
    }

    async function loadAnggotaStats() {
      try {
        const res = await fetchCustomAnggotaList();
        if (res.data) setCustomAnggotaCount(res.data.length);
      } catch (e) {
        console.error(e);
      }
    }

    loadLatest();
    loadAnggotaStats();

    const handleUpdate = () => {
      loadLatest();
      loadAnggotaStats();
    };

    // Langganan real-time sync (BroadcastChannel, CustomEvent, Storage, Focus, Visibility & Polling)
    const unsubscribeSync = subscribeToKegiatanSync(() => {
      handleUpdate();
    });

    window.addEventListener('anggota-updated', handleUpdate);
    return () => {
      unsubscribeSync();
      window.removeEventListener('anggota-updated', handleUpdate);
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
              <button
                type="button"
                onClick={(e) => scrollToSection(e, 'tentang')}
                className="button button-primary w-full sm:w-auto"
              >
                <span className="button-content">
                  <span>Pelajari Profil & Visi</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
                <div className="hoverEffect">
                  <div></div>
                </div>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection(e, 'kegiatan')}
                className="button button-gold w-full sm:w-auto"
              >
                <span className="button-content">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>Agenda Kegiatan</span>
                </span>
                <div className="hoverEffect">
                  <div></div>
                </div>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection(e, 'kontak')}
                className="button button-outline w-full sm:w-auto"
              >
                <span className="button-content">
                  <span>Kontak Sekretariat</span>
                </span>
                <div className="hoverEffect">
                  <div></div>
                </div>
              </button>
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
                    <span>{latestDokumentasi?.judul || siteData.kegiatan.daftar[0]?.judul || "Pendidikan & Pelatihan Calon Paskibraka"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0f9a4a] animate-pulse"></span>
                    {latestDokumentasi?.status || "Real-Time Update"}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal line-clamp-2">
                  {latestDokumentasi?.ringkasan ||
                    siteData.kegiatan.daftar[0]?.ringkasan ||
                    "Barisan kehormatan Pasukan Pengibar Bendera Pusaka (Paskibraka) Kabupaten Soppeng saat menjalankan tugas mulia di hadapan Sang Merah Putih, Bumi Latemmamala."}
                </p>

                {/* Micro Tags di Bawah */}
                <div className="pt-2 flex items-center gap-2 flex-wrap text-[10px] text-slate-400 font-medium border-t border-white/5">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                    #{latestDokumentasi?.kategori ? latestDokumentasi.kategori.replace(/\s+/g, '') : "PaskibrakaSoppeng"}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                    {latestDokumentasi?.tanggal || "Program Tahunan"}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-[#0f9a4a]/30 text-emerald-300">
                    {latestDokumentasi?.lokasi || "Bumi Latemmamala"}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Kolom Kartu Statistik / Highlight di Bagian Bawah Hero */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-white/10 relative">
          {/* Subtle horizontal gradient accent on border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-[1.5px] bg-gradient-to-r from-transparent via-[#0f9a4a] to-transparent pointer-events-none" />

          {/* Mini Section Headline */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-slate-300 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Jejak Langkah & Rekam Jejak Pengabdian</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Data Keorganisasian Resmi Terverifikasi</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {siteData.heroStats.map((stat, idx) => {
              const statCardDetails = [
                {
                  icon: Award,
                  accentBorder: 'group-hover:border-emerald-500/50',
                  iconBox: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25 group-hover:bg-emerald-500/20 group-hover:scale-110',
                  glowBg: 'from-emerald-500/20 via-emerald-600/10 to-transparent',
                  badgeText: 'Dedikasi Nyata',
                  badgeStyle: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
                  footerInfo: 'Pencetak Generasi Tangguh',
                },
                {
                  icon: Users,
                  accentBorder: 'group-hover:border-[#0f9a4a]/50',
                  iconBox: 'text-teal-300 bg-teal-500/10 border-teal-500/25 group-hover:bg-teal-500/20 group-hover:scale-110',
                  glowBg: 'from-[#0f9a4a]/25 via-teal-600/10 to-transparent',
                  badgeText: 'Kader Pemuda',
                  badgeStyle: 'text-teal-300 bg-teal-500/10 border-teal-500/20',
                  footerInfo: 'Terdata di Database PPI',
                },
                {
                  icon: MapPin,
                  accentBorder: 'group-hover:border-amber-500/50',
                  iconBox: 'text-amber-400 bg-amber-500/10 border-amber-500/25 group-hover:bg-amber-500/20 group-hover:scale-110',
                  glowBg: 'from-amber-500/20 via-amber-600/10 to-transparent',
                  badgeText: '100% Tercover',
                  badgeStyle: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
                  footerInfo: 'Seluruh Penjuru Soppeng',
                },
                {
                  icon: CheckCircle2,
                  accentBorder: 'group-hover:border-emerald-400/50',
                  iconBox: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25 group-hover:bg-emerald-500/20 group-hover:scale-110',
                  glowBg: 'from-emerald-400/25 via-emerald-600/10 to-transparent',
                  badgeText: 'Legal & Sah',
                  badgeStyle: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
                  isLive: true,
                  footerInfo: 'Kemenkumham RI Terverifikasi',
                },
              ];

              const detail = statCardDetails[idx] || statCardDetails[0];
              const IconComponent = detail.icon;
              const displayValue =
                stat.label === 'Alumni Purna'
                  ? `${(databaseAnggota.length + customAnggotaCount).toLocaleString('id-ID')}+`
                  : stat.value.replace(/\[|\]/g, '');

              return (
                <div
                  key={idx}
                  className={`relative p-6 rounded-3xl bg-gradient-to-b from-[#181D26]/90 via-[#131720]/80 to-[#0E1117]/95 border border-white/10 ${detail.accentBorder} shadow-xl hover:shadow-2xl hover:shadow-[#0f9a4a]/15 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden group`}
                >
                  {/* Top shimmer line on hover */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/10 group-hover:via-[#0f9a4a] to-transparent transition-all duration-500" />

                  {/* Radial ambient glow in the card corner */}
                  <div
                    className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-2xl bg-gradient-to-br ${detail.glowBg} opacity-30 group-hover:opacity-80 group-hover:scale-125 transition-all duration-700 pointer-events-none`}
                  />

                  {/* Card Header: Icon + Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-md ${detail.iconBox}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${detail.badgeStyle}`}
                    >
                      {detail.isLive && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                        </span>
                      )}
                      <span>{detail.badgeText}</span>
                    </div>
                  </div>

                  {/* Stat Value */}
                  <div className="my-2.5">
                    <div className="text-3xl sm:text-4xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-emerald-300 group-hover:to-amber-300 transition-all duration-300">
                      {displayValue}
                    </div>
                  </div>

                  {/* Label & Caption */}
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-200 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
                      {stat.label}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {stat.caption}
                    </p>
                  </div>

                  {/* Card Footer Divider & Info */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>{detail.footerInfo}</span>
                    <span className="text-[#0f9a4a] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0 font-bold">
                      &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
