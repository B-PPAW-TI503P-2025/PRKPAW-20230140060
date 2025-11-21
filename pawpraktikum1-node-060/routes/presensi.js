const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController'); // Pastikan nama file controller sesuai
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware'); // Import middleware

// User biasa melakukan Check-in (Harus login / authenticateToken)
router.post('/checkin', authenticateToken, presensiController.checkIn);

// User biasa melakukan Check-out (Harus login)
router.post('/checkout', authenticateToken, presensiController.checkOut);

// Admin melihat laporan/history (Harus login DAN admin)
router.get('/history', authenticateToken, isAdmin, presensiController.getHistory);

module.exports = router;