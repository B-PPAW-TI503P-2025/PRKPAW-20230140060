import React, { useState, useEffect } from 'react';

const PresensiPage = () => {
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const [hasCheckIn, setHasCheckIn] = useState(false);

    // Cek apakah hari ini sudah check-in (agar tombol disable)
    useEffect(() => {
        const status = localStorage.getItem('today_status');
        // Reset status jika tanggal berubah (logika sederhana)
        const lastDate = localStorage.getItem('last_date');
        const todayDate = new Date().toLocaleDateString();

        if (lastDate !== todayDate) {
            localStorage.removeItem('today_status');
            setHasCheckIn(false);
        } else if (status === 'checked_in') {
            setHasCheckIn(true);
        }
    }, []);

    const handleCheckIn = () => {
        const now = new Date();
        const dateStr = now.toLocaleDateString(); // Tgl hari ini
        const timeStr = now.toLocaleTimeString(); // Jam saat ini

        // 1. Simpan Status Harian (agar tombol jadi abu-abu)
        localStorage.setItem('today_status', 'checked_in');
        localStorage.setItem('last_date', dateStr);
        setHasCheckIn(true);

        // 2. SIMPAN RIWAYAT KE "DATABASE" LOCAL STORAGE
        // Ambil riwayat lama
        const oldHistory = JSON.parse(localStorage.getItem('riwayat_presensi') || '[]');
        
        // Buat data baru
        const newLog = {
            id: Date.now(), // ID unik berdasarkan waktu
            name: "User Anda", // Ganti dengan nama user login jika ada
            date: dateStr,
            checkIn: timeStr,
            checkOut: '-',
            status: 'Hadir' // Default hadir
        };

        // Gabungkan dan simpan ulang
        const updatedHistory = [newLog, ...oldHistory];
        localStorage.setItem('riwayat_presensi', JSON.stringify(updatedHistory));

        setMessage(`Berhasil Check-in pada jam ${timeStr}!`);
        setMessageType('success');
    };

    const handleCheckOut = () => {
        if (!hasCheckIn) {
            setMessage("Anda belum melakukan Check-in hari ini!");
            setMessageType('error');
            return;
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString();

        // UPDATE RIWAYAT TERAKHIR DENGAN JAM CHECK-OUT
        const oldHistory = JSON.parse(localStorage.getItem('riwayat_presensi') || '[]');
        
        if (oldHistory.length > 0) {
            // Kita anggap data paling atas (index 0) adalah data hari ini
            oldHistory[0].checkOut = timeStr;
            localStorage.setItem('riwayat_presensi', JSON.stringify(oldHistory));
        }

        // Hapus status harian agar besok bisa checkin lagi (simulasi checkout selesai)
        // localStorage.removeItem('today_status'); 
        // setHasCheckIn(false); // Opsional: mau langsung reset tombol atau tidak

        setMessage(`Berhasil Check-out pada jam ${timeStr}!`);
        setMessageType('success');
    };

    // --- STYLING SAMA SEPERTI SEBELUMNYA ---
    const styles = {
        container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f8' },
        card: { background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px', textAlign: 'center' },
        title: { marginBottom: '10px', color: '#333' },
        subtitle: { color: '#666', marginBottom: '30px', fontSize: '14px' },
        alertBox: { padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '14px', backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da', color: messageType === 'success' ? '#155724' : '#721c24', border: messageType === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb' },
        buttonGroup: { display: 'flex', gap: '10px', justifyContent: 'center' },
        btnIn: { flex: 1, padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', opacity: hasCheckIn ? 0.6 : 1 },
        btnOut: { flex: 1, padding: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Presensi Harian</h2>
                <p style={styles.subtitle}>Klik tombol di bawah untuk mencatat kehadiran.</p>
                {message && <div style={styles.alertBox}>{message}</div>}
                <div style={styles.buttonGroup}>
                    <button style={styles.btnIn} onClick={handleCheckIn} disabled={hasCheckIn}>
                        {hasCheckIn ? 'Sudah Masuk' : 'Check-In'}
                    </button>
                    <button style={styles.btnOut} onClick={handleCheckOut}>
                        Check-Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PresensiPage;