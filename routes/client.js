const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { validateClient, validateClientUpdate } = require('../middlewares/validate');
const { verifyToken, requireRole} = require('../middlewares/auth')


router.get('/', verifyToken, requireRole("gerant","serveur"), clientController.getAll);
router.get('/:id', verifyToken, clientController.getOne);
router.post('/', validateClient, clientController.create);
router.put('/:id/restore', verifyToken, requireRole('gerant'), clientController.restore); // ← avant /:id
router.delete('/:id/force',verifyToken,requireRole('gerant'),clientController.deleteForce)
router.put('/:id', verifyToken, validateClientUpdate, clientController.update);
router.delete('/:id', verifyToken, clientController.remove);
module.exports = router