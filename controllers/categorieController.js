// Importons le module service categorieService pour utiliser la logique métier liée aux catégories

const categorieService = require('../services/categorieService');

//Créer un objet categorieController pour gérer les requetes HTTP liées aux catégories 
const categorieController = { 
    getAllCategories : async (req,res,next) => {
        try {
            const categories = await categorieService.getAllCategories();
            res.json(categories);
        } catch(error) {
            next(error);
        }
    },
    getCategorieById: async (req,res,next) => {
        const id = parseInt(req.params.id);
        try {
            const categorie = await categorieService.getCategorieById(id);
            res.json(categorie);
        } catch(error) {
            next(error);
        }
    },
    createCategorie: async (req,res,next) => { 
        const data = req.body;
        try {
            const newCategorie = await categorieService.createCategorie(data);
            res.status(201).json(newCategorie);
        }catch(error) {
            if(error.code === '23505') {
                return res.status(409).json({ error: 'Le nom de catégorie existe déjà' });
            }
            next(error);
        }
    },
    updateCategorie: async (req,res,next) => {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            const updatedCategorie = await categorieService.updateCategorie(id,data);
            res.json(updatedCategorie);
        } catch(error) {
            if(error.code === '23505') {
                return res.status(409).json({ error: 'Le nom de catégorie existe déjà' });
            }
            next(error);    
        }
  },
    deleteCategorie: async (req,res,next) => {
        const id = parseInt(req.params.id);
        try {
            const deletedCategorie = await categorieService.deleteCategorie(id);
            res.json(deletedCategorie);
        } catch(error) {
            next(error);
        }
    }


}
module.exports = categorieController;