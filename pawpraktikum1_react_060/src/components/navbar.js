import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Pastikan sudah npm install jwt-decode
import { LogOut, User, ClipboardList, CheckCircle } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token invalid", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-lg mb-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 font-bold text-xl">
            <CheckCircle size={24} />
            <Link to="/presensi">Sistem Presensi</Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-blue-700 px-3 py-1 rounded-full">
              <User size={16} />
              <span className="text-sm font-medium">
                Hai, {user.nama || "User"}
              </span>
            </div>

            {user.role === 'admin' && (
              <Link 
                to="/reports" 
                className="flex items-center space-x-1 hover:text-blue-200 transition"
              >
                <ClipboardList size={18} />
                <span>Laporan Admin</span>
              </Link>
            )}

            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm transition shadow"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;