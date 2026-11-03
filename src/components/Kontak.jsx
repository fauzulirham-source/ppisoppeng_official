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
  User,
  Tag,
  Navigation,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { getSocialIcon } from './SocialIcons';

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
    )}%0AEmail: ${encodeURIComponent(formData.email || '-')}%0ANo HP: ${encodeURIComponent(
      formData.whatsapp || '-'
    )}%0APerihal: ${encodeURIComponent(formData.subjek)}%0APesan: ${encodeURIComponent(
      formData.pesan || '-'
    )}`;
    window.open(`https://wa.me/${k.telepon.rawNumber}?text=${text}`, '_blank');
  };

  return (
    <section id="kontak" className="py-20 md:py-28 bg-[#0F1115] text-white relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#0f9a4a]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <MessageSquare className="w-4 h-4 text-[#0f9a4a]" />
            <span>{k.tagline}</span>
            <span className="w-1 h-1 rounded-full bg-amber-400"></span>
            <span className="text-amber-300 font-mono text-[11px] normal-case">Layanan Komunikasi Resmi</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Sekretariat &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Kanal Komunikasi Resmi
            </span>
          </h2>

          <div className="w-20 h-1 bg-gradient-to-r from-[#0f9a4a] via-emerald-400 to-amber-400 mx-auto rounded-full" />

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            {k.deskripsi}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          
          {/* Kolom Kiri: Kartu Informasi Kontak Resmi (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Alamat Sekretariat Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181D26] via-[#141822] to-[#0E1117] border border-white/10 hover:border-emerald-500/40 shadow-xl shadow-slate-950/30 transition-all duration-300 space-y-4 group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {k.alamat.label}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">Bumi Latemmamala, Kab. Soppeng</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(k.alamat.teks, 'alamat')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Salin Alamat"
                >
                  {copiedField === 'alamat' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#0A0D12] p-4 rounded-2xl border border-white/5 space-y-1">
                <p className="font-medium text-slate-200">{k.alamat.teks}</p>
                <p className="text-[11px] text-slate-400 italic pt-1 border-t border-white/5">
                  Patokan: {k.alamat.catatanLokasi}
                </p>
              </div>

              {/* Peta Digital Interaktif dengan Koordinat Presisi */}
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/10 shadow-inner group/map">
                <iframe
                  title="Peta Lokasi Sekretariat PPI Kabupaten Soppeng"
                  src={`https://maps.google.com/maps?q=-4.351396852156139,119.88233899384068&z=17&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={`https://www.google.com/maps?q=-4.351396852156139,119.88233899384068`}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-[#0F1115]/85 hover:bg-[#0F1115] text-white text-[11px] font-bold backdrop-blur-md border border-emerald-500/30 flex items-center gap-1.5 transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                  <span>Buka Google Maps</span>
                </a>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 text-[11px] flex items-center gap-1.5 font-mono">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>-4.351397, 119.882339</span>
                </span>
                <a
                  href="https://www.google.com/maps?q=-4.351396852156139,119.88233899384068"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  <span>Peta Digital</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Telepon & WhatsApp Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181D26] via-[#141822] to-[#0E1117] border border-white/10 hover:border-emerald-500/40 shadow-xl shadow-slate-950/30 transition-all duration-300 space-y-4 group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#0f9a4a]/20 border border-[#0f9a4a]/40 flex items-center justify-center text-emerald-400 shadow-sm group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {k.telepon.label}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <p className="text-[11px] text-emerald-400 font-medium">{k.telepon.jamLayanan}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(k.telepon.teks, 'telepon')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Salin Kontak"
                >
                  {copiedField === 'telepon' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A0D12] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <a
                  href={`https://wa.me/${k.telepon.rawNumber}?text=Halo%20Pengurus%20PPI%20Kabupaten%20Soppeng`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm sm:text-base font-black text-white hover:text-emerald-400 transition-colors tracking-wide"
                >
                  {k.telepon.teks}
                </a>
                <a
                  href={`https://wa.me/${k.telepon.rawNumber}?text=Halo%20Pengurus%20PPI%20Kabupaten%20Soppeng`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0f9a4a] to-emerald-600 hover:from-[#13b558] hover:to-[#0f9a4a] text-white text-xs font-bold shadow-md shadow-[#0f9a4a]/30 transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Email Resmi Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181D26] via-[#141822] to-[#0E1117] border border-white/10 hover:border-amber-500/40 shadow-xl shadow-slate-950/30 transition-all duration-300 space-y-4 group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {k.email.label}
                    </h3>
                    <p className="text-[11px] text-slate-400">Surat &amp; Administrasi Resmi Organisasi</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(k.email.teks, 'email')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Salin Email"
                >
                  {copiedField === 'email' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A0D12] border border-white/5 flex items-center justify-between gap-3">
                <a
                  href={k.email.mailTo}
                  className="font-mono text-xs sm:text-sm text-slate-200 hover:text-amber-300 transition-colors truncate font-semibold"
                >
                  {k.email.teks}
                </a>
                <a
                  href={k.email.mailTo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold transition-all flex-shrink-0 hover:scale-105 active:scale-95"
                >
                  <span>Kirim Email</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Media Sosial Resmi Tiles */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181D26] via-[#141822] to-[#0E1117] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>Saluran Media Sosial Resmi</span>
                </div>
                <span className="text-[11px] text-amber-300 font-semibold normal-case">
                  Kunjungi Kanal &rarr;
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {k.sosialMedia.map((sosmed, idx) => {
                  const platformStyles = {
                    Instagram: {
                      gradient: 'from-pink-500/15 via-rose-500/10 to-purple-500/15 border-pink-500/30 text-pink-400 hover:border-pink-500/60 shadow-pink-500/5',
                      iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white',
                    },
                    Facebook: {
                      gradient: 'from-blue-600/15 to-blue-800/15 border-blue-500/30 text-blue-400 hover:border-blue-500/60 shadow-blue-500/5',
                      iconBg: 'bg-blue-600 text-white',
                    },
                    YouTube: {
                      gradient: 'from-red-600/15 to-red-800/15 border-red-500/30 text-red-400 hover:border-red-500/60 shadow-red-500/5',
                      iconBg: 'bg-red-600 text-white',
                    },
                    TikTok: {
                      gradient: 'from-cyan-500/15 to-rose-500/15 border-cyan-500/30 text-cyan-300 hover:border-cyan-500/60 shadow-cyan-500/5',
                      iconBg: 'bg-black text-white border border-white/20',
                    },
                  };
                  const config = platformStyles[sosmed.platform] || {
                    gradient: 'from-emerald-500/15 to-teal-500/15 border-emerald-500/30 text-emerald-400',
                    iconBg: 'bg-emerald-600 text-white',
                  };

                  return (
                    <a
                      key={idx}
                      href={sosmed.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-3.5 rounded-2xl bg-gradient-to-br ${config.gradient} bg-[#0A0D14] hover:bg-[#121622] border flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-md hover:shadow-xl`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                            {getSocialIcon(sosmed.platform, 'w-4 h-4')}
                          </div>
                          <div>
                            <span className="text-xs font-black uppercase tracking-wider block">
                              {sosmed.platform}
                            </span>
                            <span className="text-[10px] text-slate-400 block -mt-0.5 font-normal">Kanal Resmi</span>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-xs text-slate-200 group-hover:text-white font-mono truncate font-semibold pl-1">
                        {sosmed.handle}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Kolom Kanan: Formulir Pesan & Aspirasi (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-b from-[#181D26] via-[#141822] to-[#0E1117] p-6 sm:p-9 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Ambient Lighting in Corner */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="mb-7 space-y-1.5 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Send className="w-3.5 h-3.5" />
                <span>Kotak Layanan &amp; Koordinasi</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Kirim Pesan &amp; Koordinasi
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Sampaikan aspirasi, konfirmasi keanggotaan purna, atau penawaran kerja sama kegiatan kepemudaan secara terstruktur.
              </p>
            </div>

            {isSubmitted ? (
              /* State Sukses Pengiriman */
              <div className="py-12 px-6 text-center space-y-5 animate-fade-in bg-[#0C0F15] rounded-3xl border border-emerald-500/30 shadow-xl relative z-10">
                <div className="w-18 h-18 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white">
                    Pesan Berhasil Tersimpan di Database!
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed pt-1">
                    Terima kasih, <strong>{formData.nama || 'Rekan'}</strong>. Pesan Anda telah tersimpan resmi di sistem pangkalan data sekretariat PPI Kabupaten Soppeng. Anda juga dapat meneruskan salinannya langsung ke WhatsApp narahubung.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                  <button
                    onClick={handleSendToWhatsApp}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#0f9a4a] to-emerald-600 hover:from-[#13b558] hover:to-[#0f9a4a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#0f9a4a]/40 cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Lanjutkan via WhatsApp Langsung</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ nama: '', email: '', whatsapp: '', subjek: 'Informasi Umum', pesan: '' });
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-semibold cursor-pointer transition-all"
                  >
                    Kirim Pesan Baru
                  </button>
                </div>
              </div>
            ) : (
              /* Form Input */
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Nama Lengkap</span>
                      <span className="text-[#0f9a4a]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama Anda"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#0A0D12] border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 focus:outline-none transition-all text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Alamat Email</span>
                      <span className="text-[#0f9a4a]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@anda.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#0A0D12] border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 focus:outline-none transition-all text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>No. WhatsApp / HP</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#0A0D12] border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 focus:outline-none transition-all text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Kategori / Subjek</span>
                    </label>
                    <select
                      value={formData.subjek}
                      onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#0A0D12] border border-white/10 focus:border-emerald-500 text-white focus:outline-none transition-all text-xs sm:text-sm cursor-pointer"
                    >
                      <option value="Informasi Umum" className="bg-[#12151B]">Informasi Umum Organisasi</option>
                      <option value="Kemitraan Kegiatan" className="bg-[#12151B]">Kerja Sama &amp; Kemitraan</option>
                      <option value="Pendataan Alumni Purna" className="bg-[#12151B]">Pendataan Alumni Paskibraka</option>
                      <option value="Seleksi Paskibraka" className="bg-[#12151B]">Pertanyaan Seleksi Paskibraka</option>
                      <option value="Lainnya" className="bg-[#12151B]">Lain-lain</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Isi Pesan / Aspirasi</span>
                      <span className="text-[#0f9a4a]">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formData.pesan.length} / 500 karakter
                    </span>
                  </div>
                  <textarea
                    required
                    maxLength={500}
                    rows={4}
                    placeholder="Tuliskan pesan, aspirasi, atau keperluan koordinasi Anda untuk Pengurus PPI Kabupaten Soppeng..."
                    value={formData.pesan}
                    onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0A0D12] border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 focus:outline-none transition-all resize-none text-xs sm:text-sm leading-relaxed"
                  ></textarea>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold">*</span>
                    <span>Data kontak resmi PPI Soppeng dapat dihubungi langsung di kolom kiri.</span>
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0f9a4a] via-emerald-500 to-[#0c7d3c] hover:from-[#13b558] hover:to-[#0f9a4a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#0f9a4a]/40 hover:shadow-emerald-500/50 transition-all duration-300 disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Catatan Integrasi */}
            <div className="mt-7 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400 relative z-10">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                Narahubung aktif melayani konsultasi &amp; koordinasi kepemudaan Kabupaten Soppeng.
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
