//Importons le  module categorieController pour gérer les routes liées aux catégories
const categorieController = require('../controllers/categorieController');

//Importons les midlleware de validation pour les catégories
const { validateCategorie, validateCategorieUpdate } = require('../middlewares/validate');
//Importons la fonction objet express 
const express = require('express');

//Créons l'objet sous pipeline , midlleware router
const router = express.Router();

//AJoutons les maillons au sous pipeline , les routes pour les catégories
router.get('/', categorieController.getAllCategories);
router.get('/:id', categorieController.getCategorieById);
router.post('/', validateCategorie, categorieController.createCategorie);
router.put('/:id', validateCategorieUpdate, categorieController.updateCategorie);
router.delete('/:id', categorieController.deleteCategorie);

//Exportons le module router pour l'utiliser dans app.js
module.exports = router;