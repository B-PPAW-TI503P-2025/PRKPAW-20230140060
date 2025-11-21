const { Presensi, User } = require("../models"); // Import User juga untuk relasi nanti
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

exports.CheckIn = async (req, res) => {
  try {
    // Ambil ID dan Nama dari Token (Middleware)
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Cek apakah ada check-in yang belum check-out hari ini
    // (Opsional: bisa diperketat dengan cek tanggal hari ini juga)
    const existingRecord = await Presensi.findOne({
      where: { 
        userId: userId, 
        checkOut: null 
      },
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah melakukan check-in dan belum check-out." });
    }

    // PERBAIKAN UTAMA: Hapus properti 'nama' saat create
    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: waktuSekarang,
      // checkOut otomatis null
    });

    // Format Data untuk Response
    // Kita ambil 'nama' dari variabel userName (token), bukan dari database Presensi
    const formattedData = {
      id: newRecord.id,
      userId: newRecord.userId,
      nama: userName, // Diambil dari token
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Cari data user ini yang checkOut-nya masih null
    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in aktif. Silakan check-in dulu.",
      });
    }

    // Update waktu checkout
    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const formattedData = {
      id: recordToUpdate.id,
      userId: recordToUpdate.userId,
      nama: userName, // Diambil dari token
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId, role } = req.user; // Ambil role juga untuk validasi
    const presensiId = req.params.id;
    
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    // Validasi: Hanya pemilik data ATAU Admin yang boleh menghapus
    if (recordToDelete.userId !== userId && role !== 'admin') {
      return res.status(403).json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }

    await recordToDelete.destroy();

    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.updatePresensi = async (req, res) => {
  try {
    // PERBAIKAN: Hapus 'nama' dari request body karena tidak ada kolom nama di tabel Presensi
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body;

    if (checkIn === undefined && checkOut === undefined) {
      return res.status(400).json({
        message: "Request body harus berisi data checkIn atau checkOut untuk diupdate."
      });
    }

    const recordToUpdate = await Presensi.findByPk(presensiId);

    if (!recordToUpdate) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    // Update jika ada datanya
    if (checkIn) recordToUpdate.checkIn = checkIn;
    if (checkOut) recordToUpdate.checkOut = checkOut;
    
    // PERBAIKAN: Hapus baris update nama
    // recordToUpdate.nama = nama ... (HAPUS INI)

    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// === TAMBAHAN: Get History ===
// Fungsi ini penting untuk melihat data presensi BESERTA nama user (menggunakan relasi)
exports.getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let whereClause = {};
        
        // Jika mahasiswa, hanya lihat data sendiri. Jika admin, lihat semua.
        if (userRole !== 'admin') {
            whereClause = { userId: userId };
        }

        const history = await Presensi.findAll({
            where: whereClause,
            order: [['checkIn', 'DESC']],
            include: [
                {
                    model: User, // Mengambil data dari tabel User
                    as: 'user',  // Sesuai alias di model Presensi
                    attributes: ['nama', 'email'] // Hanya ambil kolom nama dan email
                }
            ]
        });

        res.json({
            message: "History presensi berhasil diambil",
            data: history
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil history", error: error.message });
    }
};