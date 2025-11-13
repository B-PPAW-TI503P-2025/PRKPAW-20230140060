const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // <-- Import JWT
const { User } = require('./models');
const app = express();

// Middleware Wajib: Untuk membaca JSON dari body request
app.use(express.json());

// KUNCI RAHASIA ANDA: Ganti ini dengan string acak yang kuat
// Anda bisa simpan ini di file .env nanti
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_SAYA_YANG_SANGAT_KUAT_TOLONG_GANTI';

/**
 * ======================================================
 * RUTE REGISTRASI PENGGUNA BARU
 * ======================================================
 */
app.post('/api/auth/register', async (req, res) => {
    try {
        const { nama, email, password, role } = req.body;

        if (!nama || !email || !password || !role) {
            return res.status(400).json({ 
                message: 'Semua field (nama, email, password, role) harus diisi.' 
            });
        }

        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(409).json({ 
                message: 'Email sudah terdaftar.' 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            nama: nama,
            email: email,
            password: hashedPassword,
            role: role
        });

        const responseData = { ...newUser.toJSON() };
        delete responseData.password;

        return res.status(201).json({
            message: 'Registrasi berhasil!',
            user: responseData
        });

    } catch (error) {
        console.error('Error Registrasi:', error);
        return res.status(500).json({ 
            message: 'Terjadi kesalahan pada server.' 
        });
    }
});


/**
 * ======================================================
 * RUTE LOGIN PENGGUNA (UNTUK MENDAPATKAN TOKEN)
 * ======================================================
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        // 1. Ambil email dan password dari body
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password harus diisi.' });
        }

        // 2. Cari pengguna di database
        const user = await User.findOne({ 
            where: { email: email } 
        });

        if (!user) {
            // 404 Not Found (atau 401 Unauthorized agar lebih aman)
            return res.status(404).json({ message: 'Email tidak ditemukan.' });
        }

        // 3. Bandingkan password yang diinput dengan password di DB
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            // 401 Unauthorized
            return res.status(401).json({ message: 'Password salah.' });
        }

        // 4. Jika password cocok, BUAT TOKEN JWT
        // Data yang ingin Anda simpan di dalam token (payload)
        const tokenPayload = {
            id: user.id,
            email: user.email,
            nama: user.nama,
            role: user.role
        };

        // Buat token yang berlaku selama 1 jam
        const token = jwt.sign(
            tokenPayload, 
            JWT_SECRET, 
            { expiresIn: '1h' } // Token akan kedaluwarsa dalam 1 jam
        );

        // 5. Kirim token ke klien
        return res.status(200).json({
            message: 'Login berhasil!',
            token: token
        });

    } catch (error) {
        console.error('Error Login:', error);
        return res.status(500).json({ 
            message: 'Terjadi kesalahan pada server.' 
        });
    }
});


// (Tambahkan rute lain Anda di sini... cth: rute presensi, reports)
// ...
// const presensiRoutes = require('./routes/presensi');
// const reportRoutes = require('./routes/reports');
// app.use('/api/presensi', presensiRoutes);
// app.use('/api/reports', reportRoutes);
// ...


// Menjalankan server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});