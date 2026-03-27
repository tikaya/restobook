//Importons le module clientModel pour accéder aux méthodes de la base de données
const clientModel = require('../models/clientModel');

const clientservice = {

    getAllClients: async()=> {
        return await clientModel.findAll();
    },

    getClientById: async (id) => {
       const client = await clientModel.findById(id);
         if(!client) {
            const error = new Error('Client non trouvé');
            error.status = 404;
            throw error;
         }
            return client;
    },

    createClient: async (data) => {
        if(!data.email_client || !data.mdp_client || !data.nom_client || !data.prenom_client || !data.telephone_client) {
        const error = new Error("email, mot de passe, nom et prenom sont requis");
        error.status = 400;
        throw error;
        }
         // On ajoutera bcrypt ici plus tard
        return await clientModel.create(data);
    },

    updateClient: async (id,data) => {
        const client = await clientModel.update(id,data);

         if(!client) {
            const error = new Error('Client non trouvé');
            error.status = 404;
            throw error;
         }
         return client;

    },

    deleteClient: async (id) => {
        const client = await clientModel.softDelete(id);

        if(!client) {
            const error = new Error('Client non trouvé');
            error.status = 404;
            throw error;
        }
        return {message: 'Client supprimé avec succès (RGPD)'};
    }
}

module.exports = clientservice;