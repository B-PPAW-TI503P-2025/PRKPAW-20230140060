import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        // TODO: Sambungkan ke API Backend di sini
        console.log("Data Register:", formData);
        
        alert("Registrasi Berhasil! Silakan Login.");
        navigate('/login');
    };

    // Style sederhana (Inline CSS)
    const styles = {
        container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f4' },
        card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
        inputGroup: { marginBottom: '1rem' },
        label: { display: 'block', marginBottom: '0.5rem' },
        input: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }, // box-sizing penting agar padding tidak merusak lebar
        button: { width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{textAlign: 'center'}}>Daftar Akun</h2>
                <form onSubmit={handleRegister}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nama Lengkap</label>
                        <input type="text" name="name" style={styles.input} onChange={handleChange} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input type="email" name="email" style={styles.input} onChange={handleChange} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input type="password" name="password" style={styles.input} onChange={handleChange} required />
                    </div>
                    <button type="submit" style={styles.button}>Register</button>
                </form>
                <p style={{textAlign: 'center', marginTop: '1rem'}}>
                    Sudah punya akun? <Link to="/login">Login di sini</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;