// Service Komunikasi API & Database PPI Soppeng
// Dilengkapi integrasi Supabase Cloud Database + Realtime WebSocket
// dengan auto-fallback ke SQLite Server & LocalStorage jika offline
import { siteData } from '../data/siteData';
import { getSupabase, getSupabaseCredentials } from './supabaseClient';

const API_BASE = '/api';

// BroadcastChannel untuk sinkronisasi real-time multi-tab & multi-jendela lokal
let syncChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncChannel = new BroadcastChannel('ppi_realtime_kegiatan_channel');
  } catch (e) {
    syncChannel = null;
  }
}

// Fallback LocalStorage Helpers
export const STORAGE_KEYS = {
  KONTAK: 'ppi_kontak_messages',
  KEGIATAN: 'ppi_kegiatan_list_v2',
  KEGIATAN_DELETED: 'ppi_kegiatan_deleted_ids',
  ANGGOTA: 'ppi_custom_anggota',
};

export function getLocalData(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function setLocalData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage error:', e);
  }
}

/**
 * Status koneksi database saat ini
 */
export function getActiveDatabaseInfo() {
  const creds = getSupabaseCredentials();
  if (creds.isConfigured) {
    return {
      type: 'supabase',
      label: 'Supabase Cloud Database',
      isCloud: true,
      url: creds.url,
      source: creds.source,
    };
  }
  return {
    type: 'local',
    label: 'Penyimpanan Lokal Browser',
    isCloud: false,
    url: '',
    source: 'local',
  };
}

// -------------------------------------------------------------
// KONTAK API (Aspirasi & Pesan Pengunjung)
// -------------------------------------------------------------

export async function fetchPesanKontak() {
  // 1. Coba baca dari Supabase Cloud
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('pesan_kontak')
        .select('*')
        .order('id', { ascending: false });

      if (!error && Array.isArray(data)) {
        setLocalData(STORAGE_KEYS.KONTAK, data);
        return { data, isOffline: false, source: 'supabase' };
      }
    } catch (e) {
      console.warn('Gagal membaca pesan dari Supabase, beralih ke cache:', e);
    }
  }

  // 2. Coba baca dari SQLite server lokal jika aktif
  try {
    const res = await fetch(`${API_BASE}/kontak`);
    if (res.ok) {
      const json = await res.json();
      return { data: json.data || [], isOffline: false, source: 'sqlite' };
    }
  } catch (err) {
    // Offline / mode statis
  }

  // 3. Fallback LocalStorage
  const local = getLocalData(STORAGE_KEYS.KONTAK, []);
  return { data: local, isOffline: true, source: 'local' };
}

export async function submitPesanKontak(data) {
  const payload = {
    nama: data.nama,
    email: data.email || '',
    whatsapp: data.whatsapp || data.no_hp || '',
    subjek: data.subjek || 'Informasi Umum',
    pesan: data.pesan,
    status: 'Belum Dibaca',
  };

  // 1. Simpan ke Supabase jika aktif
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: inserted, error } = await supabase
        .from('pesan_kontak')
        .insert([payload])
        .select()
        .single();

      if (!error && inserted) {
        // Sinkronkan ke local cache
        const local = getLocalData(STORAGE_KEYS.KONTAK, []);
        setLocalData(STORAGE_KEYS.KONTAK, [inserted, ...local]);
        return { success: true, id: inserted.id, isOffline: false, source: 'supabase' };
      }
    } catch (e) {
      console.warn('Gagal menyimpan pesan ke Supabase:', e);
    }
  }

  // 2. Coba simpan ke server SQLite lokal
  try {
    const res = await fetch(`${API_BASE}/kontak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      return { success: true, id: json.id, isOffline: false, source: 'sqlite' };
    }
  } catch (err) {
    // Server offline
  }

  // 3. Simpan ke LocalStorage
  const local = getLocalData(STORAGE_KEYS.KONTAK, []);
  const newItem = {
    id: Date.now(),
    ...payload,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  setLocalData(STORAGE_KEYS.KONTAK, [newItem, ...local]);
  return { success: true, id: newItem.id, isOffline: true, source: 'local' };
}

export async function updateStatusPesan(id, status) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('pesan_kontak').update({ status }).eq('id', id);
    } catch (e) {}
  }

  try {
    await fetch(`${API_BASE}/kontak/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch (err) {}

  const local = getLocalData(STORAGE_KEYS.KONTAK, []);
  const updated = local.map(item => (String(item.id) === String(id) ? { ...item, status } : item));
  setLocalData(STORAGE_KEYS.KONTAK, updated);
  return { success: true };
}

export async function deletePesanKontak(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('pesan_kontak').delete().eq('id', id);
    } catch (e) {}
  }

  try {
    await fetch(`${API_BASE}/kontak/${id}`, { method: 'DELETE' });
  } catch (err) {}

  const local = getLocalData(STORAGE_KEYS.KONTAK, []);
  const filtered = local.filter(item => String(item.id) !== String(id));
  setLocalData(STORAGE_KEYS.KONTAK, filtered);
  return { success: true };
}

// -------------------------------------------------------------
// KEGIATAN API (Pengabdian, Kaderisasi, Upacara, Diklat, dll)
// -------------------------------------------------------------

export function getStoredKegiatan(defaultItems = siteData?.kegiatan?.daftar || []) {
  const fallbackList = defaultItems.length > 0 ? defaultItems : (siteData?.kegiatan?.daftar || []);
  const deletedIds = new Set(getLocalData(STORAGE_KEYS.KEGIATAN_DELETED, []).map(String));
  let stored = getLocalData(STORAGE_KEYS.KEGIATAN, null);

  if (!stored) {
    const legacyCustom = getLocalData('ppi_kegiatan_custom', []);
    stored = [...legacyCustom, ...fallbackList];
    setLocalData(STORAGE_KEYS.KEGIATAN, stored);
  } else if (Array.isArray(stored)) {
    let changed = false;
    stored = stored.map(item => {
      if (item.judul && item.judul.startsWith('[')) {
        const fresh = fallbackList.find(d => String(d.id) === String(item.id));
        changed = true;
        return fresh ? { ...item, ...fresh } : { ...item, judul: item.judul.replace(/[\[\]]/g, '') };
      }
      return item;
    });
    if (changed) {
      setLocalData(STORAGE_KEYS.KEGIATAN, stored);
    }
  }

  return stored.filter(item => !deletedIds.has(String(item.id)));
}

/**
 * Berlangganan event real-time sinkronisasi kegiatan PPI.
 * Menghubungkan Supabase Realtime WebSocket, CustomEvent, BroadcastChannel, Storage Event, Focus, dan Interval.
 */
export function subscribeToKegiatanSync(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleCustom = (e) => callback(e?.detail || { action: 'custom-event' });
  const handleStorage = (e) => {
    if (e.key === 'ppi_kegiatan_sync_timestamp' || e.key === 'ppi_kegiatan_list_v2') {
      callback({ action: 'storage-sync' });
    }
  };
  const handleFocus = () => callback({ action: 'focus-sync' });
  const handleVisibility = () => {
    if (!document.hidden) callback({ action: 'visibility-sync' });
  };

  window.addEventListener('kegiatan-updated', handleCustom);
  window.addEventListener('storage', handleStorage);
  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleVisibility);

  let channelListener = null;
  if (syncChannel) {
    channelListener = (event) => {
      if (event.data?.type === 'kegiatan-updated') {
        callback(event.data.detail || { action: 'channel-sync' });
      }
    };
    syncChannel.addEventListener('message', channelListener);
  }

  // 1. Supabase Realtime WebSocket Listener (Otomatis se-dunia tanpa reload)
  let supabaseChannel = null;
  const supabase = getSupabase();
  if (supabase) {
    try {
      supabaseChannel = supabase
        .channel('realtime_kegiatan_broadcast')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'kegiatan' },
          (payload) => {
            console.log('⚡ Supabase Realtime update diterima:', payload);
            callback({ action: 'supabase-realtime', payload });
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Gagal mengaktifkan Supabase realtime:', e);
    }
  }

  // 2. Interval background sync berkala (3.5 detik)
  const timer = setInterval(() => {
    callback({ action: 'interval-sync' });
  }, 3500);

  return () => {
    window.removeEventListener('kegiatan-updated', handleCustom);
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('focus', handleFocus);
    document.removeEventListener('visibilitychange', handleVisibility);
    if (syncChannel && channelListener) {
      syncChannel.removeEventListener('message', channelListener);
    }
    if (supabase && supabaseChannel) {
      try {
        supabase.removeChannel(supabaseChannel);
      } catch (e) {}
    }
    clearInterval(timer);
  };
}

export function notifyKegiatanUpdated(detail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('kegiatan-updated', { detail }));

    if (syncChannel) {
      try {
        syncChannel.postMessage({ type: 'kegiatan-updated', detail });
      } catch (e) {}
    }

    try {
      localStorage.setItem('ppi_kegiatan_sync_timestamp', String(Date.now()));
    } catch (e) {}
  }
}

export async function fetchKegiatanList(defaultItems = []) {
  const deletedIds = new Set(getLocalData(STORAGE_KEYS.KEGIATAN_DELETED, []).map(String));

  // 1. Coba ambil dari Supabase Cloud Database jika terhubung
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('kegiatan')
        .select('*')
        .order('id', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const cleanData = data.filter(item => !deletedIds.has(String(item.id)));
        setLocalData(STORAGE_KEYS.KEGIATAN, cleanData);
        return { data: cleanData, isOffline: false, source: 'supabase' };
      }
    } catch (e) {
      console.warn('Supabase fetch error, falling back to cache:', e);
    }
  }

  // 2. Coba ambil dari server SQLite backend jika aktif
  try {
    const res = await fetch(`${API_BASE}/kegiatan`);
    if (res.ok) {
      const json = await res.json();
      const serverItems = (json.data || []).filter(item => !deletedIds.has(String(item.id)));
      setLocalData(STORAGE_KEYS.KEGIATAN, serverItems);
      return { data: serverItems, isOffline: false, source: 'sqlite' };
    }
  } catch (err) {}

  // 3. Fallback ke LocalStorage / defaultItems
  const activeItems = getStoredKegiatan(defaultItems);
  return { data: activeItems, isOffline: true, source: 'local' };
}

export async function submitKegiatanBaru(data) {
  const newId = 'keg-' + Date.now();
  const newItem = {
    id: newId,
    ...data,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  // Pastikan ID tidak ada di blacklist terhapus
  const deleted = getLocalData(STORAGE_KEYS.KEGIATAN_DELETED, []).filter(id => String(id) !== String(newId));
  setLocalData(STORAGE_KEYS.KEGIATAN_DELETED, deleted);

  // Simpan ke local cache terlebih dahulu agar respon instan 0 milidetik
  const currentList = getStoredKegiatan();
  const updatedList = [newItem, ...currentList.filter(item => String(item.id) !== String(newId))];
  setLocalData(STORAGE_KEYS.KEGIATAN, updatedList);

  let finalId = newId;
  let source = 'local';

  // 1. Simpan ke Supabase Cloud jika terhubung
  const supabase = getSupabase();
  if (supabase) {
    try {
      const dbPayload = {
        kategori: data.kategori || 'Kaderisasi & Diklat',
        judul: data.judul,
        tanggal: data.tanggal,
        lokasi: data.lokasi,
        status: data.status || 'Terlaksana',
        ringkasan: data.ringkasan || data.judul,
        detail: data.detail || '',
        foto: data.foto || '',
        foto_placeholder: data.foto_placeholder || 'kegiatan-diklat-paskibra.jpg',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
      };

      const { data: inserted, error } = await supabase
        .from('kegiatan')
        .insert([dbPayload])
        .select()
        .single();

      if (!error && inserted) {
        finalId = inserted.id;
        newItem.id = finalId;
        source = 'supabase';
        const syncedList = [newItem, ...currentList.filter(item => String(item.id) !== String(newId) && String(item.id) !== String(finalId))];
        setLocalData(STORAGE_KEYS.KEGIATAN, syncedList);
      } else if (error) {
        console.warn('Supabase insert warning:', error.message);
      }
    } catch (e) {
      console.warn('Gagal simpan ke Supabase, tersimpan di lokal:', e);
    }
  }

  // 2. Coba simpan ke server SQLite jika lokal sedang aktif
  if (source === 'local') {
    try {
      const res = await fetch(`${API_BASE}/kegiatan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.id) {
          finalId = json.id;
          newItem.id = finalId;
          source = 'sqlite';
          const syncedList = [newItem, ...currentList.filter(item => String(item.id) !== String(newId) && String(item.id) !== String(finalId))];
          setLocalData(STORAGE_KEYS.KEGIATAN, syncedList);
        }
      }
    } catch (err) {}
  }

  notifyKegiatanUpdated({ action: 'create', ...newItem });
  return { success: true, id: finalId, data: newItem, isOffline: source === 'local', source };
}

export async function deleteKegiatanItem(id) {
  const strId = String(id);
  const numericId = strId.replace(/\D/g, '');

  // 1. Simpan ke blacklist ID terhapus
  const deleted = getLocalData(STORAGE_KEYS.KEGIATAN_DELETED, []).map(String);
  if (!deleted.includes(strId)) deleted.push(strId);
  if (numericId && !deleted.includes(numericId)) deleted.push(numericId);
  setLocalData(STORAGE_KEYS.KEGIATAN_DELETED, deleted);

  // 2. Hapus dari cache localStorage
  const current = getLocalData(STORAGE_KEYS.KEGIATAN, []);
  const filtered = current.filter(item => String(item.id) !== strId && String(item.id) !== numericId);
  setLocalData(STORAGE_KEYS.KEGIATAN, filtered);

  const legacy = getLocalData('ppi_kegiatan_custom', []);
  setLocalData('ppi_kegiatan_custom', legacy.filter(item => String(item.id) !== strId));

  // 3. Hapus dari Supabase jika terhubung
  const supabase = getSupabase();
  if (supabase) {
    try {
      // Hapus berdasarkan ID numeric atau string
      if (numericId) {
        await supabase.from('kegiatan').delete().eq('id', Number(numericId));
      } else {
        await supabase.from('kegiatan').delete().eq('id', id);
      }
    } catch (e) {
      console.warn('Gagal menghapus dari Supabase:', e);
    }
  }

  // 4. Hapus dari SQLite jika server aktif
  try {
    await fetch(`${API_BASE}/kegiatan/${id}`, { method: 'DELETE' });
  } catch (err) {}

  notifyKegiatanUpdated({ action: 'delete', id });
  return { success: true };
}

/**
 * Migrasikan seluruh data kegiatan yang ada di browser saat ini langsung ke tabel Supabase
 */
export async function migrateLocalKegiatanToSupabase() {
  const supabase = getSupabase();
  if (!supabase) {
    return { success: false, message: 'Supabase belum terkonfigurasi. Masukkan URL dan Anon Key terlebih dahulu.' };
  }

  const items = getStoredKegiatan();
  if (!items || items.length === 0) {
    return { success: false, message: 'Tidak ada data kegiatan di penyimpanan lokal untuk dimigrasi.' };
  }

  try {
    const formatted = items.map(item => ({
      kategori: item.kategori || 'Kaderisasi & Diklat',
      judul: item.judul || 'Kegiatan PPI Soppeng',
      tanggal: item.tanggal || 'Sesuai Jadwal',
      lokasi: item.lokasi || 'Kabupaten Soppeng',
      status: item.status || 'Terlaksana',
      ringkasan: item.ringkasan || item.judul || '',
      detail: item.detail || '',
      foto: item.foto || '',
      foto_placeholder: item.foto_placeholder || item.fotoPlaceholderName || 'kegiatan-diklat-paskibra.jpg',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
    }));

    const { data, error } = await supabase.from('kegiatan').insert(formatted).select();
    if (error) {
      return { success: false, message: `Gagal migrasi ke Supabase: ${error.message}` };
    }

    notifyKegiatanUpdated({ action: 'migrate-supabase', count: data.length });
    return { success: true, count: data.length, message: `Berhasil mengekspor ${data.length} kegiatan ke Supabase Cloud!` };
  } catch (err) {
    return { success: false, message: `Terjadi kendala: ${err.message}` };
  }
}

/**
 * Ekspor data kegiatan ke format JSON string
 */
export function exportKegiatanJson() {
  const data = getStoredKegiatan();
  return JSON.stringify(data, null, 2);
}

/**
 * Impor data kegiatan dari JSON string
 */
export function importKegiatanJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed) && parsed.length > 0) {
      setLocalData(STORAGE_KEYS.KEGIATAN, parsed);
      const newIds = new Set(parsed.map(x => String(x.id)));
      const existingDeleted = getLocalData(STORAGE_KEYS.KEGIATAN_DELETED, []).filter(id => !newIds.has(String(id)));
      setLocalData(STORAGE_KEYS.KEGIATAN_DELETED, existingDeleted);
      notifyKegiatanUpdated({ action: 'import', data: parsed });
      return { success: true, count: parsed.length };
    }
    return { success: false, message: 'Format data tidak berupa array kegiatan valid.' };
  } catch (e) {
    return { success: false, message: 'Format JSON tidak valid: ' + e.message };
  }
}

// -------------------------------------------------------------
// DATABASE ANGGOTA API (Kustom Added by Admin)
// -------------------------------------------------------------

export function formatAnggotaItem(a, index = 0) {
  const angkatanStr = String(a.angkatan || '2024');
  const hasNra = Boolean(a.nra && String(a.nra).trim() !== '' && String(a.nra).trim() !== '0');
  const nraClean = hasNra ? String(a.nra).trim() : '';

  return {
    id: a.id ? (String(a.id).startsWith('kpa-') ? String(a.id) : `kpa-${a.id}`) : `kpa-custom-${Date.now()}-${index}`,
    rawId: a.id || a.rawId,
    no: a.no || (index + 1),
    nama: a.nama || 'Anggota Paskibraka',
    nomorKpa: hasNra ? nraClean : '-',
    nra: nraClean,
    hasNra: hasNra,
    angkatan: angkatanStr,
    status: hasNra ? "NRA Terdaftar" : "Belum Ada NRA",
    asalSekolah: a.asalSekolah || a.sekolah || '',
    tempatTanggalLahir: a.tempatTanggalLahir || a.tempat_lahir || '',
    alamat: a.alamat || '',
    tingkat: a.tingkat || 'Kabupaten',
    noHp: a.noHp || a.no_hp || '',
    tugas: a.tingkat ? `Tingkat ${a.tingkat}` : `Purna Paskibraka Angkatan ${angkatanStr}`,
    isCustom: true,
  };
}

function notifyAnggotaUpdated(detail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('anggota-updated', { detail }));
  }
}

export async function fetchCustomAnggotaList() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('anggota')
        .select('*')
        .order('id', { ascending: false });

      if (!error && Array.isArray(data)) {
        const rows = data.map((item, idx) => formatAnggotaItem(item, idx));
        setLocalData(STORAGE_KEYS.ANGGOTA, rows);
        return { data: rows, isOffline: false, source: 'supabase' };
      }
    } catch (e) {}
  }

  try {
    const res = await fetch(`${API_BASE}/anggota`);
    if (res.ok) {
      const json = await res.json();
      const rows = (json.data || []).map((item, idx) => formatAnggotaItem(item, idx));
      return { data: rows, isOffline: false, source: 'sqlite' };
    }
  } catch (err) {}

  const local = getLocalData(STORAGE_KEYS.ANGGOTA, []);
  const rows = local.map((item, idx) => formatAnggotaItem(item, idx));
  return { data: rows, isOffline: true, source: 'local' };
}

export async function submitAnggotaBaru(data) {
  const angkatanStr = String(data.angkatan || '2024');
  const payload = {
    nama: data.nama,
    angkatan: angkatanStr,
    nra: data.nra || '',
    tempat_lahir: data.tempatTanggalLahir || data.tempat_lahir || '',
    sekolah: data.asalSekolah || data.sekolah || '',
    alamat: data.alamat || '',
    tingkat: data.tingkat || 'Kabupaten',
    no_hp: data.noHp || data.no_hp || '',
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: inserted, error } = await supabase
        .from('anggota')
        .insert([payload])
        .select()
        .single();

      if (!error && inserted) {
        const formatted = formatAnggotaItem(inserted);
        const local = getLocalData(STORAGE_KEYS.ANGGOTA, []);
        setLocalData(STORAGE_KEYS.ANGGOTA, [formatted, ...local]);
        notifyAnggotaUpdated({ action: 'create', ...formatted });
        return { success: true, id: inserted.id, data: formatted, isOffline: false, source: 'supabase' };
      }
    } catch (e) {}
  }

  try {
    const res = await fetch(`${API_BASE}/anggota`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      const formatted = formatAnggotaItem({ id: json.id, ...payload });
      const local = getLocalData(STORAGE_KEYS.ANGGOTA, []);
      setLocalData(STORAGE_KEYS.ANGGOTA, [formatted, ...local.filter(x => x.rawId !== json.id)]);
      notifyAnggotaUpdated({ action: 'create', ...formatted });
      return { success: true, id: json.id, data: formatted, isOffline: false, source: 'sqlite' };
    }
  } catch (err) {}

  const local = getLocalData(STORAGE_KEYS.ANGGOTA, []);
  const newId = Date.now();
  const formatted = formatAnggotaItem({ id: newId, ...payload });
  setLocalData(STORAGE_KEYS.ANGGOTA, [formatted, ...local]);
  notifyAnggotaUpdated({ action: 'create', ...formatted });
  return { success: true, id: newId, data: formatted, isOffline: true, source: 'local' };
}

export async function deleteAnggotaItem(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const numId = String(id).replace(/\D/g, '');
      if (numId) {
        await supabase.from('anggota').delete().eq('id', Number(numId));
      } else {
        await supabase.from('anggota').delete().eq('id', id);
      }
    } catch (e) {}
  }

  try {
    await fetch(`${API_BASE}/anggota/${id}`, { method: 'DELETE' });
  } catch (err) {}

  const local = getLocalData(STORAGE_KEYS.ANGGOTA, []);
  const filtered = local.filter(item => item.id !== id && item.rawId !== id);
  setLocalData(STORAGE_KEYS.ANGGOTA, filtered);

  notifyAnggotaUpdated({ action: 'delete', id });
  return { success: true };
}
