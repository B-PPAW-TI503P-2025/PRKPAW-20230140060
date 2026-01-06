const express = require('express');
const router = express.Router();
const iotController = require('../controllers/IotController');

router.post('/ping', iotController.testConnection);
module.exports = router;
