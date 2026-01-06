const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware');

console.log("=== DEBUG MIDDLEWARE ===");
console.log("1. Token:", authenticateToken);
console.log("2. Admin:", isAdmin);
console.log("========================");
console.log("=== DEBUG REPORT CONTROLLER ===");
console.log(reportController);
router.get('/daily', authenticateToken, isAdmin, reportController.getDailyReport);

module.exports = router;