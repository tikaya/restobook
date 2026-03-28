//Importons le module categorieModel pour exécuter les requetes SQL liées aux catégories
const categorieModel = require('../models/categorieModel');


//Créons un objet categorieService pour gérer la logique métier liée aux catégories
const categorieService = {
    getAllCategories: async () => {
        return await categorieModel.getAllCategories();
    },

    getCategorieById: async (id) => {
        const categorie = await categorieModel.getCategorieById(id);
        if(!categorie) {
            const error = new Error('Catégorie non trouvée');
            error.status = 404;
            throw error;
        }
        return categorie;

    },
    createCategorie: async (data) => {
        const newCategorie = await categorieModel.createCategorie(data);
        if(!newCategorie) {
            const error = new Error('Erreur lors de la création de la catégorie');
            error.status = 500;
            throw error;
        }
        return newCategorie;
    },

    updateCategorie: async (id,data) => {
        const updatedCategorie = await categorieModel.updateCategorie(id,data);
        if(!updatedCategorie) {
            const error = new Error('Catégorie non trouvée ou erreur lors de la mise à jour');
            error.status = 404;
            throw error;
        }
        return updatedCategorie;
    },
    deleteCategorie: async (id) => {
        const deletedCategorie = await categorieModel.deleteCategorie(id);
        if(!deletedCategorie) {
            const error = new Error('Catégorie non trouvée ou erreur lors de la suppression');
            error.status = 404;
            throw error;
        }
        return deletedCategorie;
    }

}

module.exports = categorieService;