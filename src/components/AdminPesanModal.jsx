import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Phone,
  Calendar,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  RefreshCw,
  MessageSquare,
  ExternalLink,
  Database,
  Filter,
} from 'lucide-react';
import { fetchPesanKontak, updateStatusPesan, deletePesanKontak } from '../services/api';

export default function AdminPesanModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await fetchPesanKontak();
      setMessages(res.data || []);
      setIsOffline(res.isOffline);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateStatus = async (id, newStatus) => {
    await updateStatusPesan(id, newStatus);
    setMessages(prev =>
      prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus pesan ini dari database?')) {
      await deletePesanKontak(id);
      setMessages(prev => prev.filter(item => item.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const filteredMessages = messages.filter(item => {
    const matchesFilter =
      filterStatus === 'Semua' ||
      (filterStatus === 'Belum Dibaca' && (!item.status || item.status === 'Belum Dibaca')) ||
      item.status === filterStatus;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (item.nama && item.nama.toLowerCase().includes(query)) ||
      (item.subjek && item.subjek.toLowerCase().includes(query)) ||
      (item.pesan && item.pesan.toLowerCase().includes(query)) ||
      (item.whatsapp && item.whatsapp.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter(
    m => !m.status || m.status === 'Belum Dibaca'
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#14171F] border border-white/10 w-full max-w-5xl h-[88vh] max-h-[850px] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#191D26]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Panel Kotak Masuk (Database Kontak)
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  {isOffline ? 'Tersambung ke Browser Storage' : 'Tersambung ke SQLite Backend (localhost:5000)'}
                </span>
                <span>•</span>
                <span>Total: {messages.length} Pesan</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadMessages}
              disabled={loading}
              title="Refresh Data"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-300 border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search & Filter */}
        <div className="px-6 py-3 border-b border-white/10 bg-[#12141A] flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pengirim, subjek, pesan, atau WhatsApp..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1E27] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">Filter Status:</span>
            {['Semua', 'Belum Dibaca', 'Sudah Dibaca', 'Dibalas'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Master-Detail Split View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          
          {/* Daftar Pesan (List) */}
          <div className="md:col-span-5 border-r border-white/10 overflow-y-auto divide-y divide-white/5 bg-[#101217]">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
                Memuat data pesan...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Belum ada pesan yang sesuai.
              </div>
            ) : (
              filteredMessages.map(item => {
                const isSelected = selectedMessage?.id === item.id;
                const isUnread = !item.status || item.status === 'Belum Dibaca';

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedMessage(item);
                      if (isUnread) {
                        handleUpdateStatus(item.id, 'Sudah Dibaca');
                      }
                    }}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-l-4 border-emerald-500'
                        : isUnread
                        ? 'bg-white/[0.03] hover:bg-white/[0.06]'
                        : 'opacity-70 hover:opacity-100 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white truncate max-w-[180px]">
                        {item.nama}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {item.created_at ? item.created_at.split(' ')[0] : '-'}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-emerald-300 truncate mb-1">
                      {item.subjek}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.pesan}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Dibalas'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : item.status === 'Sudah Dibaca'
                            ? 'bg-slate-700/50 text-slate-300 border border-slate-600/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {item.status || 'Belum Dibaca'}
                      </span>

                      {item.whatsapp && item.whatsapp !== '-' && (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {item.whatsapp}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detail Pesan View */}
          <div className="md:col-span-7 bg-[#14171F] p-6 overflow-y-auto flex flex-col justify-between">
            {selectedMessage ? (
              <div className="space-y-6">
                
                {/* Header Detail */}
                <div className="pb-4 border-b border-white/10 flex items-start justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">
                      {selectedMessage.subjek}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Diterima: {selectedMessage.created_at || 'Baru Saja'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>

                {/* Sender Info Card */}
                <div className="bg-[#1B1F2A] p-4 rounded-2xl border border-white/5 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Nama Pengirim:</span>
                    <span className="font-bold text-white">{selectedMessage.nama}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-mono text-emerald-300">{selectedMessage.email || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Nomor WhatsApp:</span>
                    <span className="font-mono text-white">{selectedMessage.whatsapp || '-'}</span>
                  </div>
                </div>

                {/* Pesan Isi */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Isi Pesan:
                  </label>
                  <div className="bg-[#0E1015] p-5 rounded-2xl border border-white/5 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.pesan}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                  {selectedMessage.whatsapp && selectedMessage.whatsapp !== '-' && (
                    <a
                      href={`https://wa.me/${selectedMessage.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Halo ${selectedMessage.nama}, terima kasih telah menghubungi Pengurus PPI Kabupaten Soppeng perihal: ${selectedMessage.subjek}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'Dibalas')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Balas via WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  )}

                  {selectedMessage.status !== 'Dibalas' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'Dibalas')}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-medium text-xs sm:text-sm flex items-center gap-2 transition-all"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Tandai Sudah Dibalas</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <MessageSquare className="w-12 h-12 mb-3 stroke-[1.5] text-slate-600" />
                <p className="text-sm">Pilih salah satu pesan di sebelah kiri untuk melihat rincian.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
