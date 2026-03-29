const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validateContact } = require('../middlewares/validate');

router.get('/', contactController.getAll);
router.get('/:id', contactController.getById);
router.post('/', validateContact, contactController.create);
router.delete('/:id', contactController.delete);

module.exports = router;