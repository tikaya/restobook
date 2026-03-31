// Importons le module avisController pour utiliser les fonctions de contrôle des avis
const avisController = require('../controllers/avisController')

// Importons le module validate pour utiliser les fonctions de validation des données
const { validateAvis, validateAvisModeration } = require('../middlewares/validate')

// AJoutons midlleware pour proteger routes employés
const { verifyToken, requireRole } = require('../middlewares/auth');


// Créons un routeur Express pour les avis
const express = require('express')
const router = express.Router()

// Routes pour les avis
router.get('/', avisController.getAvisPublic) // voir tous les avis approuvés (public)
router.get('/all',verifyToken, requireRole('gerant','serveur'), avisController.getAvisAll) // voir tous les avis (admin/serveur)
router.get('/:id', avisController.getAvisById) // voir un avis par id
router.post('/',verifyToken, validateAvis, avisController.createAvis) // créer un avis
router.put('/:id/moderate',verifyToken, requireRole('gerant','serveur'), validateAvisModeration, avisController.moderateAvis) // modérer un avis
router.delete('/:id',verifyToken, requireRole('gerant'), avisController.deleteAvis) // supprimer un avis

// Exportons le routeur pour l'utiliser dans server.js
module.exports = router