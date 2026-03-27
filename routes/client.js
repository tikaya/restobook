const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Route pour récupérer tous les clients
router.get('/',  clientController.getAll)

// Route pour récupérer un client par son ID
router.get('/:id',  clientController.getOne)

// Route pour créer un nouveau client
router.post('/',    clientController.create)

// Route pour mettre à jour un client existant
router.put('/:id',  clientController.update)

// Route pour supprimer un client (soft delete)
router.delete('/:id', clientController.remove)

module.exports = router