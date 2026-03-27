// Importons le module controller pour les employés
const employeController = require('../controllers/employeContoller');

// Importons le module de validation des données
const { validateEmploye, validateEmployeUpdate } = require('../middlewares/validate');

// Importons express
const express = require('express');

// Obtenons le routeur express qui fait office à la fois de sous-pipeline et de middleware de pipeline principale
const router = express.Router();

//Ajoutons des middlwares à notre sous-pipeline
router.get('/', employeController.getAll);
router.get('/:id', employeController.getOne);
router.post('/', validateEmploye, employeController.create);
router.put('/:id', validateEmployeUpdate, employeController.update);
router.delete('/:id', employeController.delete);

//Exportons le routeur pour qu'il puisse être utilisé dans app.js
module.exports = router;
