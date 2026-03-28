//Importons le module Table controller pour gérer les requetes HTTP liées aux tables
const tableController = require('../controllers/tableController');

//Importons le module de validation des données pour les tables
const { validateTable, validateTableUpdate } = require('../middlewares/validate');

//Importons objet function Express pour créer un routeur
const express = require('express');

//Créons un router qui fait office à la fois de sous pipeline et de middleware au pipeline principal de l'application
const router = express.Router();

//Ajoutons les maillons de la chaîne de traitement des requetes HTTP liées aux tables
router.get('/', tableController.getAllTables);
router.get('/:id', tableController.getTableById);
router.post('/', validateTable, tableController.createTable);
router.put('/:id', validateTableUpdate, tableController.updateTable);
router.delete('/:id', tableController.deleteTable);

//Exportons le routeur pour l'utiliser dans le pipeline principal de l'application
module.exports = router;