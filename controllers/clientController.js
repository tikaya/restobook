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
},

    restore: async (req,res,next) => {
        
        // Récuperons id de la source params et convertissons en Number
        const id = parseInt(req.params.id);

        //Apellons le service pour récuperer l'objet clientRestore

    try {
        const client = await clientService.restoreClient(id)
        res.json(client)
    }
    // AU cas ou une erreur remonte du service 
    catch (error) {
        // On va passé au middleware de gestion d'erreur
        next(error)
    }

},

deleteForce: async (req,res, next) => {
    // Récuperons et convertissons id en Number
    const id = parseInt(req.params.id);

    // Si tous se passe bien on va rendre un json
    try {
        // Appelons le service
       const  clientdeleted = await clientService.deleteForceClient(id);
       res.json(clientdeleted)
    }catch(error) {
        next(error)
    }
}

}

module.exports = clientController;