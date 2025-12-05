import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Pastikan Link diimport

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        // --- LOGIKA LOGIN SEMENTARA (AGAR BISA MASUK) ---
        
        // 1. Kita anggap email & password apa saja BENAR.
        if(email && password) {
            console.log("Login Berhasil dengan:", email);
            
            // 2. Simpan 'token' palsu di browser agar PrivateRoute mengijinkan lewat
            localStorage.setItem('token', 'token-rahasia-sementara');
            
            // 3. Pindah ke Dashboard
            navigate('/dashboard');
        } else {
            alert("Mohon isi email dan password!");
        }
    };

    // Style Sederhana (Agar rapi)
    const styles = {
        container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
        card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '350px', textAlign: 'center' },
        input: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' },
        button: { width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' },
        linkText: { marginTop: '15px', fontSize: '14px' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div style={{textAlign: 'left'}}>
                        <label>Email:</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="user@example.com"
                        />
                    </div>
                    <div style={{textAlign: 'left'}}>
                        <label>Password:</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="********"
                        />
                    </div>
                    
                    <button type="submit" style={styles.button}>
                        Login (Masuk)
                    </button>
                </form>

                {/* --- INI LINK KE REGISTER YANG SEBELUMNYA HILANG --- */}
                <p style={styles.linkText}>
                    Belum punya akun? <br/>
                    <Link to="/register" style={{color: '#007bff', fontWeight: 'bold'}}>
                        Daftar disini
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;