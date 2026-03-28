const horairesService = require('../services/horairesService');

const horairesController = {
    getHoraires: async (req, res, next) => {
        try {
            const horaires = await horairesService.getHoraires();
            res.json(horaires);
        } catch (error) {
            next(error);
        }
    },

    getHorairesById: async (req, res, next) => {
        const id = parseInt(req.params.id);
        try {
            const horaire = await horairesService.getHorairesById(id);
            res.json(horaire);
        } catch(error) {
            next(error);
        }
    },
    
    updateHoraires: async (req, res, next) => {
        const id = parseInt(req.params.id);
        try {
            const updatedHoraire = await horairesService.updateHoraires(id, req.body);
            res.json(updatedHoraire);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = horairesController;