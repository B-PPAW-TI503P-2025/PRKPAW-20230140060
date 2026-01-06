const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken } = require('../middleware/permissionMiddleware');


router.use(authenticateToken);


router.post('/check-in', presensiController.upload.single('image'), presensiController.CheckIn);

// 3. Route Lainnya
router.post('/check-out', presensiController.CheckOut);
router.delete('/:id', presensiController.deletePresensi);
router.put('/:id', presensiController.updatePresensi);

module.exports = router;