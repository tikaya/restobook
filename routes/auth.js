// Importons le module controller pour accéder à la logique métier de l'authentification
const authController = require('../controllers/authController');

// Importons le module express pour créer un routeur
const express = require('express');
// créons un routeur express
const router = express.Router();

// route pour le login des clients
router.post('/login/client', authController.loginClient);

// route pour le login des employés
router.post('/login/employe', authController.loginEmploye);

// exportons le routeur pour l'utiliser dans app.js
module.exports = router;