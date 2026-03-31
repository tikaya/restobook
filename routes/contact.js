const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validateContact } = require('../middlewares/validate');

// AJoutons midlleware pour proteger routes employés
const { verifyToken, requireRole } = require('../middlewares/auth');


router.get('/',verifyToken,requireRole('gerant'), contactController.getAll);
router.get('/:id', verifyToken, requireRole('gerant'), contactController.getById);
router.post('/', validateContact, contactController.create);
router.delete('/:id',verifyToken,requireRole('gerant'), contactController.delete);

module.exports = router;