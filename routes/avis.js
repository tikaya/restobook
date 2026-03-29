// Importons le module avisController pour utiliser les fonctions de contrôle des avis
const avisController = require('../controllers/avisController')

// Importons le module validate pour utiliser les fonctions de validation des données
const { validateAvis, validateAvisModeration } = require('../middlewares/validate')

// Créons un routeur Express pour les avis
const express = require('express')
const router = express.Router()

// Routes pour les avis
router.get('/', avisController.getAvisPublic) // voir tous les avis approuvés (public)
router.get('/all', avisController.getAvisAll) // voir tous les avis (admin/serveur)
router.get('/:id', avisController.getAvisById) // voir un avis par id
router.post('/', validateAvis, avisController.createAvis) // créer un avis
router.put('/:id/moderate', validateAvisModeration, avisController.moderateAvis) // modérer un avis
router.delete('/:id', avisController.deleteAvis) // supprimer un avis

// Exportons le routeur pour l'utiliser dans server.js
module.exports = router