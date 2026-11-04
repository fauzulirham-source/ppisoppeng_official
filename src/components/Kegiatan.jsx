import React, { useState, useEffect, useMemo } from 'react';
import { siteData } from '../data/siteData';
import PhotoPlaceholder from './PhotoPlaceholder';
import TambahKegiatanModal from './TambahKegiatanModal';
import { fetchKegiatanList } from '../services/api';
import {
  Calendar,
  MapPin,
  Clock,
  Tag,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  X,
  Sparkles,
  Info,
  Plus,
  Database,
} from 'lucide-react';

function normalizeKegiatan(item) {
  const foto =
    item.foto ||
    (item.foto_placeholder &&
    (item.foto_placeholder.startsWith('data:') ||
      item.foto_placeholder.startsWith('http') ||
      item.foto_placeholder.startsWith('/'))
      ? item.foto_placeholder
      : null);

  return {
    ...item,
    id: item.id,
    kategori: item.kategori || 'Kaderisasi & Diklat',
    judul: item.judul || 'Agenda Kegiatan PPI',
    tanggal: item.tanggal || 'Sesuai Jadwal',
    lokasi: item.lokasi || 'Kabupaten Soppeng',
    status: item.status || 'Program Baru',
    ringkasan: item.ringkasan || item.judul || '',
    detail: item.detail || item.ringkasan || '',
    foto: foto,
    fotoPlaceholderName: item.foto_placeholder || item.fotoPlaceholderName || 'kegiatan-diklat-paskibra.jpg',
    tags: Array.isArray(item.tags)
      ? item.tags
      : (typeof item.tags === 'string' && item.tags ? item.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
  };
}

export default function Kegiatan() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeModalKegiatan, setActiveModalKegiatan] = useState(null);
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [kegiatanList, setKegiatanList] = useState(
    siteData.kegiatan.daftar.map(normalizeKegiatan)
  );

  const k = siteData.kegiatan;

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchKegiatanList(siteData.kegiatan.daftar);
        if (res && res.data) {
          setKegiatanList(res.data.map(normalizeKegiatan));
        }
      } catch (err) {
        console.error('Error loading kegiatan:', err);
      }
    }
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('kegiatan-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('kegiatan-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Kategori Dinamis: gabungan kategori default + kategori baru yang di-upload
  const kategoriList = useMemo(() => {
    const list = [...k.kategoriList];
    kegiatanList.forEach(item => {
      if (item.kategori && !list.includes(item.kategori)) {
        list.push(item.kategori);
      }
    });
    return list;
  }, [k.kategoriList, kegiatanList]);

  const filteredKegiatan =
    selectedCategory === 'Semua'
      ? kegiatanList
      : kegiatanList.filter((item) => item.kategori === selectedCategory);

  return (
    <section id="kegiatan" className="py-20 md:py-28 bg-[#0F1115] text-white relative overflow-hidden">
      {/* Decorative Glow Background */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>{k.tagline}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {k.title}
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mt-2" />
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed pt-2">
            Rangkaian agenda pengkaderan, keprotokolan upacara kemerdekaan, bakti sosial, serta pembinaan kompetensi generasi muda purna paskibraka di Kabupaten Soppeng.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {kategoriList.map((kat) => (
            <button
              key={kat}
              onClick={() => setSelectedCategory(kat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === kat
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* Grid Kartu Kegiatan */}
        {filteredKegiatan.length === 0 ? (
          <div className="py-16 px-6 text-center bg-[#161920]/80 rounded-3xl border border-white/10 space-y-3 max-w-lg mx-auto">
            <Clock className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-200">Belum Ada Agenda Kegiatan</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Saat ini belum ada kegiatan pada kategori ini. Setiap agenda kegiatan yang diupload melalui dashboard admin akan otomatis tampil di sini secara real-time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredKegiatan.map((item) => (
              <div
                key={item.id}
                className="group bg-[#161920] rounded-3xl border border-white/10 hover:border-red-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Photo Placeholder Card */}
                  <div className="p-3">
                    <PhotoPlaceholder
                      src={item.foto}
                      fileName={item.fotoPlaceholderName}
                      category={item.kategori}
                      aspectRatio="aspect-[16/10]"
                      recommendedSize="1200 x 800 px"
                      onClick={() => setActiveModalKegiatan(item)}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    {/* Status & Category */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                        {item.status}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        ID: {item.id}
                      </span>
                    </div>

                    {/* Judul Kegiatan */}
                    <h3
                      className="text-base sm:text-lg font-bold text-white group-hover:text-red-400 transition-colors leading-snug cursor-pointer"
                      onClick={() => setActiveModalKegiatan(item)}
                      data-placeholder="true"
                    >
                      {item.judul}
                    </h3>

                    {/* Metadata: Tanggal & Lokasi */}
                    <div className="space-y-1.5 text-xs text-slate-300 pt-1" data-placeholder="true">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                        <span className="truncate">{item.tanggal}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{item.lokasi}</span>
                      </div>
                    </div>

                    {/* Ringkasan */}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 pt-2" data-placeholder="true">
                      {item.ringkasan}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Tags & Button */}
                <div className="p-5 sm:p-6 pt-0 border-t border-white/5 mt-4">
                  <div className="flex flex-wrap gap-1.5 mb-4 pt-4">
                    {item.tags && item.tags.length > 0 ? (
                      item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">
                        #PPI #Soppeng
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveModalKegiatan(item)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-red-600 hover:text-white text-slate-200 text-xs font-semibold border border-white/10 hover:border-red-600 transition-all duration-200 cursor-pointer"
                  >
                    <span>Lihat Rincian Kegiatan</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Rincian Kegiatan */}
        {activeModalKegiatan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-xl bg-[#161920] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/40">
                    {activeModalKegiatan.kategori}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-1" data-placeholder="true">
                    {activeModalKegiatan.judul}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModalKegiatan(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300">
                {activeModalKegiatan.foto ? (
                  <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src={activeModalKegiatan.foto}
                      alt={activeModalKegiatan.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="p-2">
                    <PhotoPlaceholder
                      src={null}
                      fileName={activeModalKegiatan.fotoPlaceholderName}
                      category={activeModalKegiatan.kategori}
                      aspectRatio="aspect-[16/9]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/5">
                  <div data-placeholder="true">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Waktu Pelaksanaan</span>
                    <span className="text-xs font-semibold text-slate-200">{activeModalKegiatan.tanggal}</span>
                  </div>
                  <div data-placeholder="true">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Lokasi Acara</span>
                    <span className="text-xs font-semibold text-slate-200">{activeModalKegiatan.lokasi}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Deskripsi Kegiatan</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-2xl" data-placeholder="true">
                    {activeModalKegiatan.ringkasan}
                  </p>
                </div>

                {!activeModalKegiatan.foto && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>Foto untuk kegiatan ini dapat diletakkan di <code className="font-mono text-white">public/images/{activeModalKegiatan.fotoPlaceholderName}</code>.</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setActiveModalKegiatan(null)}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer"
                >
                  Tutup Rincian
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Modal Input Kegiatan Baru */}
      <TambahKegiatanModal
        isOpen={isTambahModalOpen}
        onClose={() => setIsTambahModalOpen(false)}
        onKegiatanAdded={(newItem) => {
          setKegiatanList(prev => [normalizeKegiatan(newItem), ...prev]);
        }}
      />
    </section>
  );
}
