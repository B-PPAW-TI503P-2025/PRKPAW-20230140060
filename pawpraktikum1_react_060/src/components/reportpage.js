import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Search, Calendar, XCircle, RefreshCw } from 'lucide-react';

const ReportPage = () => {
  const [reports, setReports] = useState([]); // Menampung semua data dari API
  const [filteredReports, setFilteredReports] = useState([]); // Menampung data yang ditampilkan (hasil filter)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State untuk Input Pencarian
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  // Fungsi untuk memanggil API
  // Kita menerima parameter 'query' opsional sesuai permintaan, 
  // tapi saat ini kita filter di client-side agar pasti jalan.
  const fetchReports = async (queryName = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      setError(null);
      
   
      const url = `http://localhost:3001/api/presensi/history?nama=${queryName}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data.data;
      setReports(data);
      
      
      applyFilters(data, queryName, startDate, endDate);

    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchReports();
  }, [navigate]);

  
  const applyFilters = (data, nama, start, end) => {
    let result = data;

    
    if (nama) {
      result = result.filter(item => 
        item.user && item.user.nama.toLowerCase().includes(nama.toLowerCase())
      );
    }

   
    if (start) {
      result = result.filter(item => new Date(item.checkIn) >= new Date(start));
    }

   
    if (end) {
      const endDateObj = new Date(end);
      endDateObj.setHours(23, 59, 59); 
      result = result.filter(item => new Date(item.checkIn) <= endDateObj);
    }

    setFilteredReports(result);
  };

 
  const handleSearchSubmit = (e) => {
    e.preventDefault();
   
    fetchReports(searchTerm);
  };


  const handleReset = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    fetchReports(""); 
  };


  useEffect(() => {
    applyFilters(reports, searchTerm, startDate, endDate);
  }, [startDate, endDate]); 

  return (
    <div className="max-w-6xl mx-auto p-8 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList className="text-blue-600" />
          Laporan Presensi Harian
        </h1>
      </div>

      {/* --- Form Pencarian & Filter --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-100">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          {/* Input Nama */}
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari Nama</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Masukkan nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Input Tanggal Mulai */}
          <div className="md:col-span-3">
             <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
             </div>
          </div>

          {/* Input Tanggal Selesai */}
          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1">Sampai</label>
             <div className="relative">
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
             </div>
          </div>
          
          {/* Tombol Cari & Reset */}
          <div className="md:col-span-2 flex gap-2">
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 shadow-sm transition flex justify-center items-center"
            >
              {loading ? <RefreshCw className="animate-spin" size={18}/> : "Cari"}
            </button>
            <button 
              type="button"
              onClick={handleReset}
              className="px-3 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* --- Pesan Error --- */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* --- Tabel Data --- */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Check-In</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Check-Out</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.length > 0 ? (
                filteredReports.map((presensi) => {
                  const checkInDate = new Date(presensi.checkIn);
                  return (
                    <tr key={presensi.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{presensi.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {presensi.user ? presensi.user.nama : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {checkInDate.toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {checkInDate.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {presensi.checkOut
                          ? new Date(presensi.checkOut).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) + " WIB"
                          : <span className="text-gray-400 italic">-- : --</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                         {presensi.checkOut 
                            ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Selesai</span>
                            : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Aktif</span>
                         }
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 flex flex-col items-center justify-center">
                    <ClipboardList size={48} className="text-gray-300 mb-2"/>
                    <p className="mt-2">Tidak ada data yang ditemukan.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
           Menampilkan {filteredReports.length} data presensi.
        </div>
      </div>
    </div>
  );
};

export default ReportPage;