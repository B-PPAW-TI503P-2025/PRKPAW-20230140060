import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle, LogOut, AlertCircle } from 'lucide-react'; 

function PresensiPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const getToken = () => localStorage.getItem("token");

  const handleCheckIn = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

    
      const response = await axios.post(
        "http://localhost:3001/api/presensi/checkin", 
        {}, 
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-in gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const response = await axios.post(
        "http://localhost:3001/api/presensi/checkout",
        {}, 
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-out gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          Lakukan Presensi
        </h2>
        <p className="text-gray-500 mb-6">Silakan catat kehadiran Anda hari ini</p>

        {/* Tampilkan Pesan Sukses */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center justify-center gap-2">
            <CheckCircle size={20}/> 
            <span>{message}</span>
          </div>
        )}

        {/* Tampilkan Pesan Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center justify-center gap-2">
            <AlertCircle size={20}/>
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 mt-4">
          <button
            onClick={handleCheckIn}
            disabled={loading}
            className={`w-full py-3 px-4 text-white font-semibold rounded-md shadow-sm transition duration-200 flex justify-center items-center gap-2
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            <CheckCircle size={18} />
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            disabled={loading}
            className={`w-full py-3 px-4 text-white font-semibold rounded-md shadow-sm transition duration-200 flex justify-center items-center gap-2
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
          >
            <LogOut size={18} />
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;