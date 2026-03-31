// importons le model employe
const employeService = require('../services/employeService');

// Objet employeController avec des méthodes pour gérer les requêtes HTTP liées aux employés
const employeController = {
    getAll: async (req, res, next) => {
    try {
        const employes = await employeService.getAllEmployes();
        res.json(employes);
    } catch(error) {
        next(error);
    }
},
    getOne: async (req,res,next) => {
        const id = parseInt(req.params.id);
        try {
            const employe = await employeService.getEmployeById(id);
            res.json(employe);
        }catch(error) {
            next(error);
        }
    },

create: async (req, res, next) => {
    try {
        const newEmploye = await employeService.createEmploye(req.body);
        res.status(201).json(newEmploye);
    } catch(error) {
        if(error.code === '23505') {
            return res.status(409).json({ error: 'Email déjà utilisé' });
        }
        next(error);
    }
},
    update: async (req,res,next) => {
        const id = parseInt(req.params.id);
        try {
            const updatedEmploye = await employeService.updateEmploye(id, req.body);
            res.json(updatedEmploye);
        }catch(error) {
            next(error);
        }
    },

    delete: async (req,res,next) => {
        const id = parseInt(req.params.id);
        try {
            const result = await employeService.deleteEmploye(id);
            res.json(result);
        }catch(error) {
            next(error);
        }
    }
}

module.exports = employeController;