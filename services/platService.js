// Importons  le modèle platModel pour interagir avec la base de données
const platModel = require('../models/platModel');

// Créons l'objet platService qui contiendra les méthodes pour la logique métier liée aux plats 
const platService = {
    // Récupérons tous les plats
    getAllPlats: async () => {
        return await platModel.findAll();
    },

    // Récupérons un plat par son ID
    getPlatById: async (id) => {
        const plat = await platModel.findById(id);
        if(!plat) {
            const error = new Error('Plat non trouvé');
            error.status = 404;
            throw error;
        }        
        return plat;
    },

    // Créons un nouveau plat
    createPlat: async (data) => {
        const newPlat = await platModel.create(data);
        if(!newPlat) {
            const error = new Error('Erreur lors de la création du plat');
            error.status = 500;
            throw error;
        }
        return newPlat;
    },

    // Mettons à jour un plat existant
    updatePlat: async (id,data) => {
         const updatedPlat = await platModel.update(id,data);
        if(!updatedPlat) {
            const error = new Error ('Plat non trouvé');
            error.status = 404;
            throw error;
        }
        return updatedPlat;
    },

    // Supprimons un plat
    deletePlat: async (id) => {
        const deleted = await platModel.delete(id);
        if(!deleted) {
            const error = new Error('Plat non trouvé');
            error.status = 404;
            throw error;
        }
        return deleted;
    },
    updatePlatImage: async (id, imagePath) => {
    const plat = await platModel.updateImage(id, imagePath);
    if (!plat) throw new Error('Plat introuvable.');
    return plat;
}
}

module.exports = platService;

