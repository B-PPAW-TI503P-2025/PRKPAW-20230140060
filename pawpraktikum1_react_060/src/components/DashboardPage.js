import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode'; // Dihapus sementara agar tidak error di preview
import { LogOut, User, Calendar, Clock, CheckCircle, ArrowRight, LayoutDashboard } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ nama: 'User', role: '' });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Helper manual untuk decode JWT (pengganti library jwt-decode agar tidak error)
  const jwtDecode = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Gagal decode token:", error);
      return null;
    }
  };

  // 1. Efek untuk membaca Token & Update Jam
  useEffect(() => {
    // Ambil data user dari token
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded) {
        setUser(decoded);
      } else {
        // Jika token rusak/expired (opsional: bisa logout otomatis)
        console.log("Token tidak valid");
      }
    }

    // Timer untuk jam digital
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Implementasi Fungsi Logout
  const handleLogout = () => {
    // a. Hapus token dari localStorage
    localStorage.removeItem('token');
    
    // b. Arahkan pengguna kembali ke halaman login
    navigate('/login');
    
    // (Opsional) Refresh halaman agar state bersih
    window.location.reload();
  };

  // Format Tanggal & Jam
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const timeString = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const dateString = currentTime.toLocaleDateString('id-ID', dateOptions);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header Bagian Atas dengan Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pb-24 pt-12 px-4 shadow-lg rounded-b-[3rem]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-blue-100 text-lg mb-1 flex items-center gap-2">
              <LayoutDashboard size={20} /> Dashboard Utama
            </p>
            <h1 className="text-4xl font-bold">Halo, {user.nama}! 👋</h1>
            <p className="mt-2 opacity-90">Selamat datang kembali di sistem presensi.</p>
          </div>
          
          {/* Avatar / Icon User Besar */}
          <div className="hidden md:flex bg-white/10 p-4 rounded-full backdrop-blur-sm border border-white/20">
            <User size={48} className="text-white" />
          </div>
        </div>
      </div>

      {/* Kontainer Utama (Floating Cards) */}
      <div className="max-w-4xl mx-auto px-4 -mt-16">
        
        {/* Baris 1: Info Waktu & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Kartu Jam Digital */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between transform hover:scale-105 transition duration-300">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1 flex items-center gap-1">
                <Clock size={16} /> Waktu Sekarang
              </p>
              <h2 className="text-4xl font-bold text-gray-800">{timeString} <span className="text-lg font-normal text-gray-500">WIB</span></h2>
            </div>
            <div className="h-12 w-1 bg-blue-500 rounded-full"></div>
            <div className="text-right">
              <p className="text-gray-500 text-sm font-medium mb-1 flex items-center justify-end gap-1">
                <Calendar size={16} /> Tanggal
              </p>
              <p className="text-gray-800 font-semibold">{dateString}</p>
            </div>
          </div>

          {/* Kartu Status User */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-center transform hover:scale-105 transition duration-300">
             <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                    <User size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Role Akun</p>
                    <p className="font-bold text-gray-800 capitalize">{user.role || 'Mahasiswa'}</p>
                </div>
             </div>
             <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                <div className="bg-green-500 h-2 rounded-full w-full animate-pulse"></div>
             </div>
             <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <CheckCircle size={12}/> Akun Aktif & Terverifikasi
             </p>
          </div>
        </div>

        {/* Baris 2: Menu Navigasi Cepat */}
        <h3 className="text-gray-700 font-bold text-xl mb-4 ml-1">Menu Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* Tombol Ke Presensi */}
          <button 
            onClick={() => navigate('/presensi')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl border border-transparent hover:border-blue-500 transition-all group text-left"
          >
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
              <CheckCircle size={24} />
            </div>
            <h4 className="font-bold text-gray-800 text-lg">Isi Presensi</h4>
            <p className="text-gray-500 text-sm mt-1">Check-in atau Check-out harian.</p>
            <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-2 transition">
              Buka Halaman <ArrowRight size={16} className="ml-1" />
            </div>
          </button>

           {/* Tombol Ke Laporan (Hanya jika Admin, atau Mahasiswa ingin lihat history) */}
           <button 
            onClick={() => navigate('/reports')} // Asumsi mahasiswa juga bisa lihat laporan sendiri
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl border border-transparent hover:border-purple-500 transition-all group text-left"
          >
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
              <Calendar size={24} />
            </div>
            <h4 className="font-bold text-gray-800 text-lg">Riwayat</h4>
            <p className="text-gray-500 text-sm mt-1">Lihat histori kehadiran Anda.</p>
            <div className="mt-4 flex items-center text-purple-600 text-sm font-medium group-hover:translate-x-2 transition">
              Lihat Data <ArrowRight size={16} className="ml-1" />
            </div>
          </button>

          {/* Tombol Logout Besar */}
          <button 
            onClick={handleLogout}
            className="bg-red-50 p-6 rounded-xl shadow-md hover:shadow-xl border border-transparent hover:border-red-500 transition-all group text-left"
          >
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-600 group-hover:text-white transition">
              <LogOut size={24} />
            </div>
            <h4 className="font-bold text-gray-800 text-lg">Logout</h4>
            <p className="text-gray-500 text-sm mt-1">Keluar dari sesi aplikasi.</p>
            <div className="mt-4 flex items-center text-red-600 text-sm font-medium group-hover:translate-x-2 transition">
              Keluar Sekarang <ArrowRight size={16} className="ml-1" />
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}

export default DashboardPage;