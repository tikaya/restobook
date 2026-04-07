const reservationController = require('../controllers/reservationController');
const { validateReservation, validateReservationUpdate } = require('../middlewares/validate');
const express = require('express');
const { verifyToken, requireRole } = require('../middlewares/auth');

const router = express.Router();

// ✅ /mes-reservations AVANT /:id — sinon Express croit que c'est un ID
router.get('/mes-reservations', verifyToken, requireRole('client'), reservationController.getMesReservations);

router.get('/',     verifyToken, requireRole('gerant', 'serveur'), reservationController.getAll);
router.get('/:id',  verifyToken, reservationController.getById);
router.post('/',    verifyToken, validateReservation, reservationController.create);
router.put('/:id',  verifyToken, validateReservationUpdate, reservationController.update);
router.delete('/:id', verifyToken, requireRole('gerant'), reservationController.delete);

module.exports = router;