import React, { useState } from 'react';
import {
  X,
  UserPlus,
  GraduationCap,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { submitAnggotaBaru } from '../services/api';

const TINGKAT_OPTIONS = ['Kabupaten', 'Provinsi', 'Nasional'];

export default function TambahAnggotaModal({ isOpen, onClose, onAnggotaAdded }) {
  const currentYear = new Date().getFullYear().toString();

  const [formData, setFormData] = useState({
    nama: '',
    angkatan: currentYear,
    nra: '',
    tingkat: 'Kabupaten',
    asalSekolah: '',
    tempatTanggalLahir: '',
    alamat: '',
    noHp: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateNra = () => {
    const angkatan = formData.angkatan || currentYear;
    // Format standar NRA PPI Soppeng: [Tahun Angkatan] + [2318 (Kode Wilayah Soppeng)] + [3 Digit Urut/Acak]
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const generatedNra = `${angkatan}2318${randomSeq}`;
    setFormData((prev) => ({ ...prev, nra: generatedNra }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.nama.trim()) {
      setErrorMsg('Nama lengkap anggota wajib diisi!');
      return;
    }

    if (!formData.angkatan.trim()) {
      setErrorMsg('Tahun angkatan wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      const res = await submitAnggotaBaru(formData);
      if (res.success) {
        setSuccessMsg(`Anggota "${formData.nama}" berhasil ditambahkan ke database!`);
        if (onAnggotaAdded && res.data) {
          onAnggotaAdded(res.data);
        }
        setTimeout(() => {
          onClose();
          setSuccessMsg('');
          setFormData({
            nama: '',
            angkatan: currentYear,
            nra: '',
            tingkat: 'Kabupaten',
            asalSekolah: '',
            tempatTanggalLahir: '',
            alamat: '',
            noHp: '',
          });
        }, 1200);
      } else {
        setErrorMsg('Gagal menambahkan anggota. Silakan coba kembali.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#14171F] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-600/10 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Tambah Anggota Baru</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Database Anggota
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Data akan langsung terhubung ke pencarian Verifikasi Keanggotaan di bagian Tentang.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Baris 1: Nama Lengkap & Tahun Angkatan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>Nama Lengkap Anggota</span>
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="nama"
                placeholder="Contoh: Muhammad Rezky Pratama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Angkatan</span>
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="angkatan"
                placeholder="2024"
                value={formData.angkatan}
                onChange={handleChange}
                required
                className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white text-center font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Baris 2: Nomor NRA & Tingkat Penugasan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nomor Registrasi Anggota (NRA)</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateNra}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Buat Otomatis</span>
                </button>
              </div>
              <input
                type="text"
                name="nra"
                placeholder="Contoh: 20242318045 (opsional)"
                value={formData.nra}
                onChange={handleChange}
                className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <p className="text-[10px] text-slate-500">
                Kosongkan jika anggota belum memiliki nomor registrasi resmi.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tingkat Penugasan</span>
              </label>
              <select
                name="tingkat"
                value={formData.tingkat}
                onChange={handleChange}
                className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {TINGKAT_OPTIONS.map((t) => (
                  <option key={t} value={t} className="bg-[#14171F] text-white">
                    Paskibraka Tingkat {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Baris 3: Asal Sekolah & Tempat/Tanggal Lahir */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>Asal Sekolah / Pangkalan</span>
              </label>
              <input
                type="text"
                name="asalSekolah"
                placeholder="Contoh: SMAN 1 Soppeng"
                value={formData.asalSekolah}
                onChange={handleChange}
                className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>Tempat, Tanggal Lahir</span>
              </label>
              <input
                type="text"
                name="tempatTanggalLahir"
                placeholder="Contoh: Watansoppeng, 17 Agustus 2006"
                value={formData.tempatTanggalLahir}
                onChange={handleChange}
                className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Baris 4: Alamat Domisili & No WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Alamat Domisili</span>
              </label>
              <input
                type="text"
                name="alamat"
                placeholder="Contoh: Jl. Kemakmuran No. 12, Lalabata"
                value={formData.alamat}
                onChange={handleChange}
                className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Nomor HP / WhatsApp (Opsional)</span>
              </label>
              <input
                type="text"
                name="noHp"
                placeholder="Contoh: 081234567890"
                value={formData.noHp}
                onChange={handleChange}
                className="w-full bg-[#1B1F2A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Menyimpan...' : 'Simpan Anggota ke Database'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
