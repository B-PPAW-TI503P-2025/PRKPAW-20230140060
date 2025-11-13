const {Presensi } = require("../models");
const{ Op } = require("sequelize");

exports.getMyReport = async (req, res) => {
  try {
    res.status(200).json({ message: 'Ini adalah laporan Anda' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getDailyReport = async (req, res) => {
  try {
        const { nama, startDate, endDate } = req.query; // Ambil semua parameter
        let options = { where: {} };

        // 1. Logika Filter Rentang Tanggal
        if (startDate && endDate) {
            // Validasi sederhana sudah dilakukan dengan pengecekan keberadaan
            options.where.checkIn = {
                // Filter berdasarkan kolom 'checkIn' (asumsi kolom ini menyimpan waktu presensi)
                [Op.gte]: new Date(startDate), // Mulai dari awal startDate
                [Op.lte]: new Date(`${endDate} 23:59:59`) // Sampai akhir endDate
            };
            
            // Jika ada rentang tanggal, kita akan menyesuaikan pesan respons
            // dan tidak menggunakan toLocaleDateString()
            
        }

        // 2. Logika Filter Nama (bekerja bersama filter tanggal jika ada)
        if (nama) {
            options.where.nama = {
                [Op.like]: `%${nama}%`,
            };
        }

        const records = await Presensi.findAll(options);
        
        // 3. Penyesuaian Respon berdasarkan query yang digunakan
        let reportDateMessage;
        if (startDate && endDate) {
            reportDateMessage = `Laporan Presensi dari ${startDate} hingga ${endDate}`;
        } else {
            reportDateMessage = new Date().toLocaleDateString();
        }

        res.json({
            reportDate: reportDateMessage,
            data: records,
            count: records.length // Menambahkan jumlah data
        });
        
    } catch (error) {
        console.error("Error in getDailyReport:", error); 
        res
            .status(500)
            .json({ message: "Gagal mengambil laporan", error: error.message });
    }
  };