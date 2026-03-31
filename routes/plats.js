// Importons le controller platController pour gérer les requêtes liées aux plats
const platController = require('../controllers/platController');

// Importons le middleware de validation pour valider les données des requêtes
const { validatePlat, validatePlatUpdate } = require('../middlewares/validate');

// Ajoutons les middlewares authentification et controle d'accès
const { verifyToken, requireRole} = require('../middlewares/auth')

// Créons un routeur Express pour définir les routes liées aux plats
const express = require('express');
const router = express.Router();

// Définissons les routes pour les opérations CRUD sur les plats
router.get('/', platController.getAll); // Récupérer tous les plats
router.get('/:id', platController.getById); // Récupérer un plat par son ID
router.post('/',verifyToken, requireRole("gerant"), validatePlat, platController.create); // Créer un nouveau plat avec validation
router.put('/:id',verifyToken, requireRole("gerant"), validatePlatUpdate, platController.update); // Mettre à jour un plat existant avec validation
router.delete('/:id', verifyToken, requireRole("gerant"),platController.delete); // Supprimer un plat

// Exportons le routeur pour l'utiliser dans l'application principale
module.exports = router;