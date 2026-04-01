// Importons le module controller pour accéder à la logique métier de l'authentification
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth')
// Importons le module express pour créer un routeur
const express = require('express');
// créons un routeur express
const router = express.Router();

// route pour le login des clients
router.post('/login/client', authController.loginClient);

// route pour le login des employés
router.post('/login/employe', authController.loginEmploye);

// route pour mot de passe oublié
router.post('/forgot-password', authController.forgotPassword)




router.post('/change-password', verifyToken, authController.changePassword); 

// exportons le routeur pour l'utiliser dans app.js

module.exports = router;