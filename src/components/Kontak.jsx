import React, { useState } from 'react';
import { siteData } from '../data/siteData';
import { submitPesanKontak } from '../services/api';
import AdminPesanModal from './AdminPesanModal';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  ExternalLink,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Sparkles,
  Database,
} from 'lucide-react';

export default function Kontak() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    whatsapp: '',
    subjek: 'Informasi Umum',
    pesan: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const k = siteData.kontak;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitPesanKontak(formData);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendToWhatsApp = () => {
    const text = `Halo Pengurus PPI Kabupaten Soppeng,%0A%0ASaya: ${encodeURIComponent(
      formData.nama || '[Nama]'
    )}%0AEmail: ${encodeURIComponent(formData.email || '-')}%0APerihal: ${encodeURIComponent(
      formData.subjek
    )}%0APesan: ${encodeURIComponent(formData.pesan || '-')}`;
    window.open(`https://wa.me/${k.telepon.rawNumber}?text=${text}`, '_blank');
  };

  return (
    <section id="kontak" className="py-20 md:py-28 bg-[#0F1115] text-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#0f9a4a]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-[#0f9a4a]/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-[#0f9a4a]" />
            <span>{k.tagline}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {k.title}
          </h2>
          <div className="w-16 h-1 bg-[#0f9a4a] mx-auto rounded-full mt-2" />
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed pt-2">
            {k.deskripsi}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          
          {/* Kolom Kiri: Kartu Informasi Kontak Resmi */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Alamat Sekretariat Card */}
            <div className="bg-[#161920] p-6 rounded-3xl border border-white/10 shadow-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0f9a4a]/20 border border-[#0f9a4a]/30 flex items-center justify-center text-[#0f9a4a]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{k.alamat.label}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Kabupaten Soppeng</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(k.alamat.teks, 'alamat')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1 border border-white/10 transition-colors cursor-pointer"
                  title="Salin Alamat"
                >
                  {copiedField === 'alamat' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-black/40 p-3.5 rounded-2xl border border-white/5">
                {k.alamat.teks}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{k.alamat.catatanLokasi}</span>
                <a
                  href={k.alamat.mapsEmbedUrlPlaceholder}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <span>Peta Digital</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Telepon & WhatsApp Card */}
            <div className="bg-[#161920] p-6 rounded-3xl border border-white/10 shadow-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0f9a4a]/20 border border-[#0f9a4a]/30 flex items-center justify-center text-[#0f9a4a]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{k.telepon.label}</h3>
                    <p className="text-[11px] text-slate-400">{k.telepon.jamLayanan}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(k.telepon.teks, 'telepon')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1 border border-white/10 transition-colors cursor-pointer"
                  title="Salin Kontak"
                >
                  {copiedField === 'telepon' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                <a
                  href={`https://wa.me/${k.telepon.rawNumber}?text=Halo%20Pengurus%20PPI%20Kabupaten%20Soppeng`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs sm:text-sm font-bold text-slate-200 hover:text-[#0f9a4a] transition-colors"
                >
                  {k.telepon.teks}
                </a>
                <a
                  href={`https://wa.me/${k.telepon.rawNumber}?text=Halo%20Pengurus%20PPI%20Kabupaten%20Soppeng`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Chat WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Email Resmi Card */}
            <div className="bg-[#161920] p-6 rounded-3xl border border-white/10 shadow-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{k.email.label}</h3>
                    <p className="text-[11px] text-slate-400">Surat & Administrasi Resmi</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(k.email.teks, 'email')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1 border border-white/10 transition-colors cursor-pointer"
                  title="Salin Email"
                >
                  {copiedField === 'email' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                <a
                  href={k.email.mailTo}
                  className="font-mono text-xs sm:text-sm text-slate-200 hover:text-amber-400 transition-colors block truncate"
                >
                  {k.email.teks}
                </a>
                <a
                  href={k.email.mailTo}
                  className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 transition-colors flex-shrink-0 ml-2"
                >
                  Kirim Email
                </a>
              </div>
            </div>

            {/* Media Sosial Resmi Pills */}
            <div className="bg-[#161920] p-5 rounded-3xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5 text-[#0f9a4a]" />
                  <span>Saluran Media Sosial Organisasi</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold normal-case">
                  Klik untuk kunjungi &rarr;
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {k.sosialMedia.map((sosmed, idx) => (
                  <a
                    key={idx}
                    href={sosmed.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-black/40 hover:bg-white/5 border border-white/5 hover:border-[#0f9a4a]/40 flex flex-col transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        {sosmed.platform}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <span className="text-xs text-slate-300 group-hover:text-white font-mono truncate mt-0.5">
                      {sosmed.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Kolom Kanan: Formulir Pesan & Aspirasi */}
          <div className="lg:col-span-7 bg-[#161920] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative">
            <div className="mb-6 space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Kirim Pesan & Koordinasi
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Sampaikan aspirasi, konfirmasi keanggotaan purna, atau penawaran kerja sama kegiatan kepemudaan.
              </p>
            </div>

            {isSubmitted ? (
              /* State Sukses Pengiriman */
              <div className="py-12 px-6 text-center space-y-4 animate-fade-in bg-white/5 rounded-2xl border border-emerald-500/30">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">
                  Pesan Berhasil Tersimpan di Database!
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Terima kasih, <strong>{formData.nama || 'Rekan'}</strong>. Pesan Anda telah berhasil tersimpan ke sistem basis data PPI Kabupaten Soppeng. Anda juga dapat meneruskan pesan ini langsung ke nomor WhatsApp narahubung ({k.telepon.teks}).
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleSendToWhatsApp}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0f9a4a] hover:bg-[#0c7c3b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0f9a4a]/30 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Lanjutkan via WhatsApp</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ nama: '', email: '', whatsapp: '', subjek: 'Informasi Umum', pesan: '' });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    Kirim Pesan Baru
                  </button>
                </div>
              </div>
            ) : (
              /* Form Input */
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-slate-300">
                      Nama Lengkap <span className="text-[#0f9a4a]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama Anda"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#0f9a4a] text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-slate-300">
                      Alamat Email <span className="text-[#0f9a4a]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@anda.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#0f9a4a] text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-slate-300">
                      No. WhatsApp / HP
                    </label>
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#0f9a4a] text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-slate-300">
                      Kategori / Subjek
                    </label>
                    <select
                      value={formData.subjek}
                      onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#0f9a4a] text-white focus:outline-none transition-colors"
                    >
                      <option value="Informasi Umum">Informasi Umum Organisasi</option>
                      <option value="Kemitraan Kegiatan">Kerja Sama & Kemitraan</option>
                      <option value="Pendataan Alumni Purna">Pendataan Alumni Paskibraka</option>
                      <option value="Seleksi Paskibraka">Pertanyaan Seleksi Paskibraka</option>
                      <option value="Lainnya">Lain-lain</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Isi Pesan / Aspirasi <span className="text-[#0f9a4a]">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500">
                      {formData.pesan.length} / 500 karakter
                    </span>
                  </div>
                  <textarea
                    required
                    maxLength={500}
                    rows={4}
                    placeholder="Tuliskan pesan, saran, atau keperluan Anda untuk Pengurus PPI Kabupaten Soppeng..."
                    value={formData.pesan}
                    onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#0f9a4a] text-white placeholder-slate-500 focus:outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-[11px] text-slate-400">
                    * Data kontak resmi PPI Soppeng dapat dihubungi langsung di kolom kiri.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#0f9a4a] hover:bg-[#0c7c3b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0f9a4a]/30 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Catatan Integrasi */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>
                Narahubung aktif melayani konsultasi & koordinasi kepemudaan Kabupaten Soppeng.
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Modal Admin Kotak Masuk Pesan */}
      <AdminPesanModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </section>
  );
}
