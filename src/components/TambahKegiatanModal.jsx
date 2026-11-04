import React, { useState, useRef } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Clock,
  PlusCircle,
  Tag,
  FileText,
  Sparkles,
  Database,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Trash2,
  Camera,
  Layers,
} from 'lucide-react';
import { submitKegiatanBaru } from '../services/api';

const KATEGORI_OPTIONS = [
  'Kaderisasi & Diklat',
  'Upacara & Kenegaraan',
  'Sosial Kemasyarakatan',
  'Pengembangan Diri',
];

const STATUS_OPTIONS = [
  'Program Tahunan',
  'Agenda Nasional',
  'Pengabdian Rutin',
  'Pra-Seleksi',
  'Organisasi',
  'Program Khusus',
];

// Koleksi preset foto resmi untuk dokumentasi Paskibraka
const PRESET_FOTO = [
  {
    label: 'Upacara Bendera Merah Putih',
    url: '/images/hero-paskibraka.jpg',
    deskripsi: 'Pasukan Pengibar Bendera Pusaka',
  },
  {
    label: 'Formasi Pasukan Pengibar',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    deskripsi: 'Khidmat Upacara Kenegaraan',
  },
  {
    label: 'Latihan Fisik & Kedisiplinan Diklat',
    url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    deskripsi: 'Kaderisasi & Pembinaan Fisik',
  },
  {
    label: 'Aksi Sosial & Bakti Masyarakat',
    url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80',
    deskripsi: 'Kepedulian Pemuda bagi Warga',
  },
];

export default function TambahKegiatanModal({ isOpen, onClose, onKegiatanAdded }) {
  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Kaderisasi & Diklat',
    tanggal: '',
    lokasi: '',
    status: 'Program Tahunan',
    ringkasan: '',
    tags: '',
  });

  const [foto, setFoto] = useState('');
  const [photoTab, setPhotoTab] = useState('upload'); // 'upload' | 'url' | 'preset'
  const [urlInput, setUrlInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Kompresi dan konversi file foto ke Base64 Data URL ringan
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('File harus berformat gambar (JPG, PNG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize otomatis jika terlalu besar agar database & local storage tetap super ringan, jernih & cepat
        const maxDim = 960;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.80);
        setFoto(compressedDataUrl);
        setError('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setFoto(urlInput.trim());
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.judul.trim()) {
      setError('Judul kegiatan wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        tanggal: formData.tanggal.trim() || 'Sesuai Jadwal',
        lokasi: formData.lokasi.trim() || 'Kabupaten Soppeng',
        ringkasan: formData.ringkasan.trim() || formData.judul.trim(),
        detail: '',
        foto: foto || '',
        foto_placeholder: foto ? 'foto-kegiatan.jpg' : 'kegiatan-diklat-paskibra.jpg',
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : ['PPI', 'Soppeng'],
      };

      const res = await submitKegiatanBaru(payload);

      if (res.success) {
        setIsSuccess(true);
        if (onKegiatanAdded) {
          onKegiatanAdded(res.data || {
            id: res.id,
            ...payload,
          });
        }
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({
            judul: '',
            kategori: 'Kaderisasi & Diklat',
            tanggal: '',
            lokasi: '',
            status: 'Program Tahunan',
            ringkasan: '',
            tags: '',
          });
          setFoto('');
          setUrlInput('');
          onClose();
        }, 800);
      }
    } catch (err) {
      setError('Gagal menyimpan kegiatan ke database');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#14171F] border border-white/10 w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#191D26]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Input Agenda Kegiatan & Dokumentasi
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-red-400" />
                Data dan foto kegiatan akan langsung tampil di halaman publik & database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-300 border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          {isSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Kegiatan dan dokumentasi foto berhasil disimpan ke database!</span>
            </div>
          )}

          {/* ==================================================== */}
          {/* SEKSI FOTO / DOKUMENTASI KEGIATAN */}
          {/* ==================================================== */}
          <div className="bg-[#191D26] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-red-400" />
                <span className="text-xs sm:text-sm font-bold text-white">
                  Foto / Dokumentasi Kegiatan
                </span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Tampil di Publik
                </span>
              </div>

              {foto && (
                <button
                  type="button"
                  onClick={() => setFoto('')}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Foto</span>
                </button>
              )}
            </div>

            {/* Live Preview Box jika sudah ada foto terpilih */}
            {foto ? (
              <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-white/20 shadow-xl group">
                <img
                  src={foto}
                  alt="Preview Kegiatan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/90 text-white font-bold backdrop-blur flex items-center gap-1.5 shadow">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Foto Dokumentasi Aktif
                  </span>
                  <button
                    type="button"
                    onClick={() => setFoto('')}
                    className="px-3 py-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs shadow cursor-pointer transition-colors"
                  >
                    Ganti Foto
                  </button>
                </div>
              </div>
            ) : (
              /* Pilihan Metode Tambah Foto */
              <div className="space-y-3">
                {/* Tab Switcher */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPhotoTab('upload')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      photoTab === 'upload'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload dari Komputer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoTab('preset')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      photoTab === 'preset'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Koleksi Dokumentasi PPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoTab('url')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      photoTab === 'url'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Tautan URL Gambar</span>
                  </button>
                </div>

                {/* Sub-tab 1: Upload File */}
                {photoTab === 'upload' && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 hover:border-red-500/60 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04] group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:border-red-500/50 transition-all text-red-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-white mb-1">
                      Klik atau Seret Foto Kegiatan ke Sini
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Mendukung format JPG, PNG, atau WebP (Rekomendasi rasio 16:9 atau 3:2)
                    </p>
                  </div>
                )}

                {/* Sub-tab 2: Preset Koleksi */}
                {photoTab === 'preset' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {PRESET_FOTO.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => setFoto(p.url)}
                        className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-red-500 cursor-pointer transition-all bg-black/40 aspect-[4/3]"
                      >
                        <img
                          src={p.url}
                          alt={p.label}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2 flex flex-col justify-end">
                          <span className="text-[11px] font-bold text-white leading-tight">
                            {p.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub-tab 3: URL Langsung */}
                {photoTab === 'url' && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="url"
                      placeholder="Tempel tautan URL gambar (https://...)"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      className="flex-1 bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer transition-colors"
                    >
                      Terapkan
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Judul Kegiatan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Judul Kegiatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="judul"
              required
              placeholder="Contoh: Latihan Gabungan & Pra-Seleksi Calon Paskibraka 2026"
              value={formData.judul}
              onChange={handleChange}
              className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Kategori & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Kategori Kegiatan
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
              >
                {KATEGORI_OPTIONS.map(opt => (
                  <option key={opt} value={opt} className="bg-[#1B1F2A]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Status / Sifat Agenda
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt} className="bg-[#1B1F2A]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tanggal & Lokasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-red-400" />
                <span>Waktu / Tanggal Pelaksanaan</span>
              </label>
              <input
                type="text"
                name="tanggal"
                placeholder="Contoh: 10 - 15 November 2026"
                value={formData.tanggal}
                onChange={handleChange}
                className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Lokasi Pelaksanaan</span>
              </label>
              <input
                type="text"
                name="lokasi"
                placeholder="Contoh: Gedung Pemuda / Lapangan Gapis"
                value={formData.lokasi}
                onChange={handleChange}
                className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Ringkasan Kegiatan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-red-400" />
              <span>Deskripsi / Penjelasan Kegiatan</span>
            </label>
            <textarea
              name="ringkasan"
              rows={3}
              placeholder="Deskripsi mengenai tujuan, jadwal, dan cakupan kegiatan..."
              value={formData.ringkasan}
              onChange={handleChange}
              className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Kata Kunci / Tag (Pisahkan dengan koma)</span>
            </label>
            <input
              type="text"
              name="tags"
              placeholder="Contoh: Latihan, Kaderisasi, PBB, Pemuda"
              value={formData.tags}
              onChange={handleChange}
              className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs sm:text-sm font-semibold border border-white/10 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan ke Database'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
