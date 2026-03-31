// Importons le module reservationController pour gérer les routes de réservation
const reservationController = require('../controllers/reservationController');

// Importons les middlewares de validation pour les réservations
const { validateReservation, validateReservationUpdate } = require('../middlewares/validate');
// Importons Objet function express pour creer un router
const express = require('express');

// Ajoutons les middlewares authentification et controle d'accès
const { verifyToken, requireRole} = require('../middlewares/auth')

//Créons l'objet sous pipeline pour les routes de réservation
const router = express.Router();

// Définissons les routes pour les réservations
router.get('/',verifyToken,requireRole('gerant','serveur') , reservationController.getAll);
router.get('/:id',verifyToken, reservationController.getById);
router.post('/',verifyToken, validateReservation, reservationController.create);
router.put('/:id',verifyToken, validateReservationUpdate, reservationController.update);
router.delete('/:id',verifyToken,requireRole('gerant'), reservationController.delete);

module.exports = router;