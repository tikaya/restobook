const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/', verifyToken, requireRole('gerant'), logController.getAll);

module.exports = router;