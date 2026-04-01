// Importons le module platService pour accéder à la logique métier liée aux plats
const platService = require('../services/platService');


// Créons l'objet platController qui contiendra les méthodes pour gérer les requêtes HTTP liées aux plats
const platController = {
    // Récupérons tous les plats
    getAll: async (req,res , next) => {
        try {
            const plats = await platService.getAllPlats();
            res.json(plats);
        } catch (error) {
            next(error);
        }
    },

    // Récupérons un plat par son ID
    getById: async (req,res,next) => {
        const id = parseInt(req.params.id);
        try {
            const plat = await platService.getPlatById(id);
            res.json(plat);
        } catch (error) {
            next(error);
        }
    },
    // Créons un nouveau plat
    create: async (req,res, next) => {
        const data = req.body;
        try {
            const newPlat = await platService.createPlat(data);
            res.status(201).json(newPlat);
        }catch (error) {
            if(error.code==='23503') {
                return res.status(400).json({ error: "La catégorie spécifiée n'existe pas" });
            }
             next(error);
        }
    },
    // Mettons à jour un plat existant
    update: async (req,res,next) => {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            const updatedPlat = await platService.updatePlat(id,data);
            res.json(updatedPlat);
        }catch (error) {
            if(error.code==='23503') {
                return res.status(400).json({ error: "La catégorie spécifiée n'existe pas" });
            }
             next(error);
        }
},
    // Supprimons un plat
    delete: async (req,res,next) => {
        const id = parseInt(req.params.id);
        try {
            await platService.deletePlat(id);
            res.status(204).send();
        } catch (error) {
            next(error);

}
    }
}
module.exports = platController;