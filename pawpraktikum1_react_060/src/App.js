
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar'; 
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PresensiPage from './components/presensipage';
import ReportPage from './components/reportpage';
import DashboardPage from './components/DashboardPage';

const App = () => {
 

  return (
    <Router>
      <div className="...">
        <Navbar /> {}
        
        <Routes>
          {/* Mendaftarkan halaman Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Mendaftarkan halaman Register */}
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Mendaftarkan halaman Dashboard (Privat) */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          
          {/* Mendaftarkan halaman Presensi (Privat) */}
          <Route 
            path="/presensi" 
            element={
              <PrivateRoute>
                <PresensiPage />
              </PrivateRoute>
            } 
          />

          {/* Mendaftarkan halaman Laporan (Privat & Admin Only) */}
          <Route 
            path="/reports" 
            element={
              <PrivateRoute adminOnly={true}>
                <ReportPage />
              </PrivateRoute>
            } 
          />

          {/* Redirect default */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;