// Importons le module controller pour les employés
const employeController = require('../controllers/employeController');

// Importons le module de validation des données
const { validateEmploye, validateEmployeUpdate } = require('../middlewares/validate');

// AJoutons midlleware pour proteger routes employés
const { verifyToken, requireRole } = require('../middlewares/auth');

// Importons express
const express = require('express');

// Obtenons le routeur express qui fait office à la fois de sous-pipeline et de middleware de pipeline principale
const router = express.Router();

//Ajoutons des middlwares à notre sous-pipeline (seule de gérant a le droit ici)
router.get('/', verifyToken, requireRole('gerant'),employeController.getAll);
router.get('/:id',verifyToken, requireRole('gerant'), employeController.getOne);
router.post('/',verifyToken, requireRole('gerant'), validateEmploye, employeController.create);
router.put('/:id', verifyToken, requireRole('gerant'), validateEmployeUpdate, employeController.update);
router.delete('/:id',verifyToken, requireRole('gerant'), employeController.delete);

//Exportons le routeur pour qu'il puisse être utilisé dans app.js
module.exports = router;
