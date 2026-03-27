// Importons le module clientService pour accéder aux méthodes métier

const clientService = require('../services/clientService');

const clientController = {
    getAll: async (req,res,next) => {
        try {
            const clients = await clientService.getAllClients();
            res.json(clients);
        } catch (error) {
            next(error);
        }
    },

    getOne:async (req,res,next) => {
        const id = parseInt(req.params.id);
        try {
            const client = await clientService.getClientById(id);
             res.json(client);       
        } catch (error) {
            next(error);
        }
    },
    
    create: async (req,res,next) => {
        const data =  req.body;
        try {
            const client = await clientService.createClient(data);
            res.status(201).json(client);
        } catch (error) {
            if(error.code === '23505') {
                return res.status(409).json({error: 'Email déjà utilisé'});
            }
            next(error);
        }
    },

    update: async (req,res,next) => {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            const client = await clientService.updateClient(id,data);
            res.json(client);
        }catch (error) {
            next(error);
        }
    },

    remove: async (req,res,next) => {
        const id = parseInt(req.params.id);
        try {
            const client = await clientService.deleteClient(id);
            res.json(client);
        }catch (error) {
            next(error);
    }
}
}

module.exports = clientController;