// Importons le module reservationController pour gérer les routes de réservation
const reservationController = require('../controllers/reservationController');

// Importons les middlewares de validation pour les réservations
const { validateReservation, validateReservationUpdate } = require('../middlewares/validate');
// Importons Objet function express pour creer un router
const express = require('express');

//Créons l'objet sous pipeline pour les routes de réservation
const router = express.Router();

// Définissons les routes pour les réservations
router.get('/', reservationController.getAll);
router.get('/:id', reservationController.getById);
router.post('/', validateReservation, reservationController.create);
router.put('/:id', validateReservationUpdate, reservationController.update);
router.delete('/:id', reservationController.delete);

module.exports = router;