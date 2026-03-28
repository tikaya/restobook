//Importons le module horairesController pour gérer les requetes HTTP liées aux horaires
const horairesController = require('../controllers/horairesController');

//Importons les fonctions de validation des données pour les horaires
const {  validateHoraireUpdate } = require('../middlewares/validate');

// Importons objet function Express pour créer un routeur
const express =  require('express');

//Créons un router qui fait office à la fois de sous pipeline et de middleware au pipeline principal de l'application
const router = express.Router();

//Ajoutons les maillons de la chaîne de traitement des requetes HTTP liées aux horaires
router.get('/', horairesController.getHoraires);
router.get('/:id', horairesController.getHorairesById);
router.put('/:id', validateHoraireUpdate, horairesController.updateHoraires);

module.exports = router;