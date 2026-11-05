// Service Komunikasi API & Database PPI Soppeng
// Dilengkapi auto-fallback ke LocalStorage jika server backend sedang offline
import { siteData } from '../data/siteData';

const API_BASE = '/api';

// BroadcastChannel untuk sinkronisasi real-time multi-tab & multi-jendela
let syncChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncChannel = new BroadcastChannel('ppi_realtime_kegiatan_channel');
  } catch (e) {
    syncChannel = null;
  }
}

// Fallback LocalStorage Helpers
const STORAGE_KEYS = {
  KONTAK: 'ppi_kontak_messages',
  KEGIATAN: 'ppi_kegiatan_list_v2',
  KEGIATAN_DELETED: 'ppi_kegiatan_deleted_ids',
  ANGGOTA: 'ppi_custom_anggota',
};

function getLocalData(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocalData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage error:', e);
  }
}

// -------------------------------------------------------------
// KONTAK API
// -------------------------------------------------------------

export async function fetchPesanKontak() {
  try {
    const res = await fetch(`${API_BASE}/kontak`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data || [], isOffline: false };
  } catch (err) {
    console.warn('Backend server offline, membaca pesan dari LocalStorage');
    const local = getLocalData(STORAGE_KEYS.KONTAK, []);
    return { data: local, isOffline: true };
  }
}

export async function submitPesanKontak(data) {
  try {
    const res = await fetch(`${API_BASE}/kontak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { success: true, id: json.id, isOffline: false };
  } catch (err) {
    console.warn('Backend server offline, menyimpan pesan ke LocalStorage');
    const local = getLocalData(STORAGE_KEYS.KONTAK, []);
    const newItem = {
      id: Date.now(),
      ...data,
      status: 'Belum Dibaca',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setLocalData(STORAGE_KEYS.KONTAK, [newItem, ...local]);
    return { success: true, id: newItem.id, isOffline: true };
  }
}

export async function updateStatusPesan(id, status) {
  try {
    const res = await fetch(`${API_BASE}/kontak/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return { success: true };
  } catch (err) {
    const local = getLocalData(STORAGE_KEYS.KONTAK, []);
    const updated = local.map(item => (item.id === id ? { ...item, status } : item));
    setLocalData(STORAGE_KEYS.KONTAK, updated);
    return { success: true, isOffline: true };
  }
}

export async function deletePesanKontak(id) {
  try {
    const res = await fetch(`${API_BASE}/kontak/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return { success: true };
  } catch (err) {
    const local = getLocalData(STORAGE_KEYS.KONTAK, []);
    const filtered = local.filter(item => item.id !== id);
    setLocalData(STORAGE_KEYS.KONTAK, filtered);
    return { success: true, isOffline: true };
  }
}

// -------------------------------------------------------------
// KEGIATAN API
// -------------------------------------------------------------

function getStoredKegiatan(defaultItems = siteData?.kegiatan?.daftar || []) {
  const fallbackList = defaultItems.length > 0 ? defaultItems : (siteData?.kegiatan?.daftar || []);
  const deletedIds = new Set(getLocalData(STORAGE_KEYS.KEGIATAN_DELETED, []).map(String));
  let stored = getLocalData(STORAGE_KEYS.KEGIATAN, null);

  // Jika belum ada di list v2, ambil fallbackList dan legacy custom
  if (!stored) {
    const legacyCustom = getLocalData('ppi_kegiatan_custom', []);
    stored = [...legacyCustom, ...fallbackList];
    setLocalData(STORAGE_KEYS.KEGIATAN, stored);
  } else if (Array.isArray(stored)) {
    // Jika data lama masih mengandung placeholder kurung siku [...], perbarui ke data resmi
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

  // Selalu filter agar kegiatan yang sudah dihapus tidak pernah muncul kembali
  return stored.filter(item => !deletedIds.has(String(item.id)));
}

/**
 * Berlangganan event real-time sinkronisasi kegiatan PPI.
 * Menghubungkan CustomEvent, BroadcastChannel, Storage Event, Focus, Visibility, dan Interval.
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

  // Interval sinkronisasi background berkala setiap 3.5 detik tanpa reload
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
    clearInterval(timer);
  };
}

export function notifyKegiatanUpdated(detail) {
  if (typeof window !== 'undefined') {
    // 1. Dispatch custom event instan di jendela/tab saat ini
    window.dispatchEvent(new CustomEvent('kegiatan-updated', { detail }));

    // 2. Broadcast ke semua tab & jendela lain melalui BroadcastChannel
    if (syncChannel) {
      try {
        syncChannel.postMessage({ type: 'kegiatan-updated', detail });
      } catch (e) {}
    }

    // 3. Update localStorage timestamp untuk memicu 'storage' event
    try {
      localStorage.setItem('ppi_kegiatan_sync_timestamp', String(Date.now()));
    } catch (e) {}
  }
}

export async function fetchKegiatanList(defaultItems = []) {
  const deletedIds = new Set(getLocalData(STORAGE_KEYS.KEGIATAN_DELETED, []).map(String));

  try {
    const res = await fetch(`${API_BASE}/kegiatan`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    const serverItems = (json.data || []).filter(item => !deletedIds.has(String(item.id)));

    // Sinkronkan ke localStorage
    setLocalData(STORAGE_KEYS.KEGIATAN, serverItems);
    return { data: serverItems, isOffline: false };
  } catch (err) {
    const activeItems = getStoredKegiatan(defaultItems);
    return { data: activeItems, isOffline: true };
  }
}

export async function submitKegiatanBaru(data) {
  const newId = 'keg-' + Date.now();
  const newItem = {
    id: newId,
    ...data,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  // Pastikan ID ini tidak ada di daftar terhapus
  const deleted = getLocalData(STORAGE_KEYS.KEGIATAN_DELETED, []).filter(id => String(id) !== String(newId));
  setLocalData(STORAGE_KEYS.KEGIATAN_DELETED, deleted);

  // Simpan ke localStorage terlebih dahulu agar instan (real-time)
  const currentList = getStoredKegiatan();
  const updatedList = [newItem, ...currentList.filter(item => String(item.id) !== String(newId))];
  setLocalData(STORAGE_KEYS.KEGIATAN, updatedList);

  let isOffline = true;
  let finalId = newId;

  // Coba kirim ke backend server jika aktif
  try {
    const res = await fetch(`${API_BASE}/kegiatan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      isOffline = false;
      if (json.id) {
        finalId = json.id;
        newItem.id = finalId;
        const syncedList = [newItem, ...currentList.filter(item => String(item.id) !== String(newId) && String(item.id) !== String(finalId))];
        setLocalData(STORAGE_KEYS.KEGIATAN, syncedList);
      }
    }
  } catch (err) {
    console.warn('Backend server offline, kegiatan disimpan ke penyimpanan lokal');
  }

  notifyKegiatanUpdated({ action: 'create', ...newItem });
  return { success: true, id: finalId, data: newItem, isOffline };
}

export async function deleteKegiatanItem(id) {
  const strId = String(id);
  const numericId = strId.replace(/\D/g, '');

  // 1. Simpan ke daftar ID terhapus (permanen di client)
  const deleted = getLocalData(STORAGE_KEYS.KEGIATAN_DELETED, []).map(String);
  if (!deleted.includes(strId)) deleted.push(strId);
  if (numericId && !deleted.includes(numericId)) deleted.push(numericId);
  setLocalData(STORAGE_KEYS.KEGIATAN_DELETED, deleted);

  // 2. Hapus dari localStorage
  const current = getLocalData(STORAGE_KEYS.KEGIATAN, []);
  const filtered = current.filter(item => String(item.id) !== strId && String(item.id) !== numericId);
  setLocalData(STORAGE_KEYS.KEGIATAN, filtered);

  // Bersihkan juga dari legacy list jika ada
  const legacy = getLocalData('ppi_kegiatan_custom', []);
  setLocalData('ppi_kegiatan_custom', legacy.filter(item => String(item.id) !== strId));

  // 3. Coba kirim DELETE ke server jika aktif
  try {
    await fetch(`${API_BASE}/kegiatan/${id}`, { method: 'DELETE' });
  } catch (err) {
    // Mode offline, sudah terhapus di localStorage
  }

  // 4. Siarkan event agar seluruh komponen web memperbarui tampilan secara real-time
  notifyKegiatanUpdated({ action: 'delete', id });
  return { success: true };
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
  try {
    const res = await fetch(`${API_BASE}/anggota`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    const rows = (json.data || []).map((item, idx) => formatAnggotaItem(item, idx));
    return { data: rows, isOffline: false };
  } catch (err) {
    const local = getLocalData(STORAGE_KEYS.ANGGOTA, []);
    const rows = local.map((item, idx) => formatAnggotaItem(item, idx));
    return { data: rows, isOffline: true };
  }
}

export async function submitAnggotaBaru(data) {
  const angkatanStr = String(data.angkatan || '2024');
  const payload = {
    ...data,
    angkatan: angkatanStr,
    tingkat: data.tingkat || 'Kabupaten',
  };

  try {
    const res = await fetch(`${API_BASE}/anggota`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    const formatted = formatAnggotaItem({ id: json.id, ...payload });

    // Sinkronkan juga ke LocalStorage untuk fallback
    const local = getLocalData(STORAGE_KEYS.ANGGOTA, []);
    setLocalData(STORAGE_KEYS.ANGGOTA, [formatted, ...local.filter(x => x.rawId !== json.id)]);

    notifyAnggotaUpdated({ action: 'create', ...formatted });
    return { success: true, id: json.id, data: formatted, isOffline: false };
  } catch (err) {
    console.warn('Backend server offline, menyimpan anggota ke LocalStorage');
    const local = getLocalData(STORAGE_KEYS.ANGGOTA, []);
    const newId = Date.now();
    const formatted = formatAnggotaItem({ id: newId, ...payload });

    setLocalData(STORAGE_KEYS.ANGGOTA, [formatted, ...local]);
    notifyAnggotaUpdated({ action: 'create', ...formatted });
    return { success: true, id: newId, data: formatted, isOffline: true };
  }
}

export async function deleteAnggotaItem(id) {
  try {
    const res = await fetch(`${API_BASE}/anggota/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    
    const local = getLocalData(STORAGE_KEYS.ANGGOTA, []);
    const filtered = local.filter(item => item.id !== id && item.rawId !== id);
    setLocalData(STORAGE_KEYS.ANGGOTA, filtered);

    notifyAnggotaUpdated({ action: 'delete', id });
    return { success: true };
  } catch (err) {
    const local = getLocalData(STORAGE_KEYS.ANGGOTA, []);
    const filtered = local.filter(item => item.id !== id && item.rawId !== id);
    setLocalData(STORAGE_KEYS.ANGGOTA, filtered);

    notifyAnggotaUpdated({ action: 'delete', id });
    return { success: true, isOffline: true };
  }
}

