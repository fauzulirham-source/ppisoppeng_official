import { createClient } from '@supabase/supabase-js';

// Ambil kredensial dari environment variable (Vite / Vercel)
// atau dari localStorage jika pengurus menyetelnya langsung melalui UI Admin Panel
export function getSupabaseCredentials() {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  let localUrl = '';
  let localKey = '';
  if (typeof window !== 'undefined') {
    localUrl = (localStorage.getItem('ppi_supabase_url') || '').trim();
    localKey = (localStorage.getItem('ppi_supabase_anon_key') || '').trim();
  }

  const url = envUrl || localUrl;
  const anonKey = envKey || localKey;

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith('http')),
    source: envUrl ? 'env' : (localUrl ? 'manual' : 'none'),
  };
}

let supabaseInstance = null;
let lastUsedUrl = '';
let lastUsedKey = '';

/**
 * Mendapatkan Supabase client singleton.
 * Mengembalikan null jika kredensial belum disetel.
 */
export function getSupabase() {
  const creds = getSupabaseCredentials();
  if (!creds.isConfigured) return null;

  if (supabaseInstance && lastUsedUrl === creds.url && lastUsedKey === creds.anonKey) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(creds.url, creds.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    lastUsedUrl = creds.url;
    lastUsedKey = creds.anonKey;
    return supabaseInstance;
  } catch (err) {
    console.error('Gagal menginisialisasi Supabase client:', err);
    return null;
  }
}

/**
 * Simpan kredensial Supabase secara manual melalui Admin UI
 */
export function saveSupabaseCredentials(url, anonKey) {
  if (typeof window !== 'undefined') {
    if (url && anonKey) {
      localStorage.setItem('ppi_supabase_url', url.trim());
      localStorage.setItem('ppi_supabase_anon_key', anonKey.trim());
    } else {
      localStorage.removeItem('ppi_supabase_url');
      localStorage.removeItem('ppi_supabase_anon_key');
    }
  }
  supabaseInstance = null;
  lastUsedUrl = '';
  lastUsedKey = '';
  return getSupabase();
}

/**
 * Uji koneksi ke Supabase dan cek apakah tabel kegiatan tersedia
 */
export async function testSupabaseConnection(customUrl = null, customKey = null) {
  try {
    let client = null;
    if (customUrl && customKey) {
      client = createClient(customUrl.trim(), customKey.trim());
    } else {
      client = getSupabase();
    }

    if (!client) {
      return { success: false, message: 'URL atau Anon Key Supabase belum diisi.' };
    }

    const { data, error } = await client.from('kegiatan').select('id').limit(1);
    if (error) {
      return {
        success: false,
        message: `Terhubung ke Supabase, namun ada kendala tabel: ${error.message}. Pastikan SQL Schema sudah dijalankan di Supabase SQL Editor.`,
      };
    }

    return {
      success: true,
      message: 'Koneksi ke database Supabase BERHASIL! Database online dan siap digunakan.',
      count: data ? data.length : 0,
    };
  } catch (err) {
    return {
      success: false,
      message: `Gagal menghubungi Supabase: ${err.message || 'Periksa koneksi internet dan kredensial Anda.'}`,
    };
  }
}
