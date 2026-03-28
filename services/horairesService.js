// Importons le module horairesModel 
const horairesModel = require('../models/horairesModel');

// Objet horairesService avec des méthodes pour la logique métier liée aux horaires
const horairesService = {
    // Récuperer les horaires 
    getHoraires : async () => {
        return await horairesModel.findAll();
    },

    // Récuperer un horaire par son ID 
    getHorairesById: async (id) => {
        const horaire = await horairesModel.findById(id);
        if(!horaire) {
            const error = new Error('Horaire non trouvé');
            error.status = 404;
            throw error;
        }
        return horaire;
    },

    // Mettre à jour les horaires
    updateHoraires: async (id ,data) => {
        const existingHoraire = await horairesModel.update(id, data);
        if(!existingHoraire) {
            const error = new Error('Horaire non trouvé pour la mise à jour');
            error.status = 404;
            throw error;
        }
        return existingHoraire;
    }
    
}

module.exports = horairesService;
