// Service Komunikasi API & Database PPI Soppeng
// Dilengkapi auto-fallback ke LocalStorage jika server backend sedang offline

const API_BASE = '/api';

// Fallback LocalStorage Helpers
const STORAGE_KEYS = {
  KONTAK: 'ppi_kontak_messages',
  KEGIATAN: 'ppi_kegiatan_custom',
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

export async function fetchKegiatanList(defaultItems = []) {
  try {
    const res = await fetch(`${API_BASE}/kegiatan`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { data: json.data || [], isOffline: false };
  } catch (err) {
    console.warn('Backend server offline, memuat kegiatan lokal');
    const localAdded = getLocalData(STORAGE_KEYS.KEGIATAN, []);
    return { data: [...localAdded, ...defaultItems], isOffline: true };
  }
}

function notifyKegiatanUpdated(detail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('kegiatan-updated', { detail }));
  }
}

export async function submitKegiatanBaru(data) {
  try {
    const res = await fetch(`${API_BASE}/kegiatan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    notifyKegiatanUpdated({ action: 'create', id: json.id, ...data });
    return { success: true, id: json.id, isOffline: false };
  } catch (err) {
    console.warn('Backend server offline, menyimpan kegiatan ke LocalStorage');
    const local = getLocalData(STORAGE_KEYS.KEGIATAN, []);
    const newItem = {
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setLocalData(STORAGE_KEYS.KEGIATAN, [newItem, ...local]);
    notifyKegiatanUpdated({ action: 'create', ...newItem });
    return { success: true, id: newItem.id, isOffline: true };
  }
}

export async function deleteKegiatanItem(id) {
  try {
    const res = await fetch(`${API_BASE}/kegiatan/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    notifyKegiatanUpdated({ action: 'delete', id });
    return { success: true };
  } catch (err) {
    const local = getLocalData(STORAGE_KEYS.KEGIATAN, []);
    const filtered = local.filter(item => item.id !== id);
    setLocalData(STORAGE_KEYS.KEGIATAN, filtered);
    notifyKegiatanUpdated({ action: 'delete', id });
    return { success: true, isOffline: true };
  }
}
