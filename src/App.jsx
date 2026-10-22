import React, { useState, useEffect, Component } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Tentang from './components/Tentang';
import Kegiatan from './components/Kegiatan';
import Pengurus from './components/Pengurus';
import Faq from './components/Faq';
import Kontak from './components/Kontak';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Error Boundary agar jika ada komponen yang error, tidak tampil layar putih kosong (blank screen)
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0C0E12] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-500 mb-4 shadow-xl">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Terjadi Kendala Memuat Halaman</h2>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed font-mono">
            {this.state.error?.message || 'Error tidak terduga'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Muat Ulang Halaman</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function checkIsAdmin() {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' ||
    path === '/admin/' ||
    path.startsWith('/admin') ||
    hash === '#admin' ||
    hash === '#/admin'
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(checkIsAdmin());

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdmin(checkIsAdmin());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setIsAdmin(checkIsAdmin());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jika URL adalah http://localhost:5173/admin atau http://localhost:5173/#admin
  if (isAdmin) {
    return (
      <ErrorBoundary>
        <AdminDashboard onNavigateToHome={() => navigateTo('/')} />
      </ErrorBoundary>
    );
  }

  // Tampilan Utama Website Publik
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0F1115] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
        {/* Navigasi Utama */}
        <Navbar />

        {/* Konten Halaman Landing Page */}
        <main className="flex-grow">
          {/* Bagian Beranda */}
          <Hero />

          {/* Bagian Tentang */}
          <Tentang />

          {/* Bagian Kegiatan */}
          <Kegiatan />

          {/* Bagian Pengurus */}
          <Pengurus />

          {/* Bagian Tanya Jawab (FAQ) */}
          <Faq />

          {/* Bagian Kontak */}
          <Kontak />
        </main>

        {/* Bagian Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
