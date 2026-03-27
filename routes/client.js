const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { validateClient, validateClientUpdate } = require('../middlewares/validate');

// Routes pour les clients
router.get('/', clientController.getAll);
router.get('/:id', clientController.getOne);
router.post('/', validateClient, clientController.create);
router.put('/:id', validateClientUpdate, clientController.update);
router.delete('/:id', clientController.remove);
module.exports = router