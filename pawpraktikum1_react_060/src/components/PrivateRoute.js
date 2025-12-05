import React from 'react';
import { Navigate } from 'react-router-dom';

// Menerima props 'children' (komponen di dalamnya) dan 'adminOnly'
const PrivateRoute = ({ children, adminOnly }) => {
    const token = localStorage.getItem('token'); // Atau cara cek login kamu
    // const isAdmin = localStorage.getItem('role') === 'admin'; // Contoh cek admin

    // 1. Jika tidak ada token, lempar ke login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // 2. (Opsional) Jika halaman khusus admin tapi user bukan admin
    // if (adminOnly && !isAdmin) {
    //    return <Navigate to="/dashboard" />; // Atau halaman 'Unauthorized'
    // }

    // 3. Jika aman, render komponen anaknya (DashboardPage, dll)
    return children;
};

export default PrivateRoute;