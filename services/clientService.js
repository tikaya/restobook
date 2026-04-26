//Importons le module clientModel pour accéder aux méthodes de la base de données
const clientModel = require('../models/clientModel');
const bcrypt = require('bcrypt');
const emailService = require('./emailService');

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

        // ⚠️ On garde le mdp en clair AVANT le hash
        // pour pouvoir éventuellement reconnecter l'utilisateur après création
        const plainPassword = data.mdp_client;

         // Hash du mot de passe avant de le stocker
         const salt = await bcrypt.genSalt(10);

         // Hashons le mdp_client concretement
           data.mdp_client = await bcrypt.hash(data.mdp_client, salt);

        const newClient = await clientModel.create(data);

        // Envoyons un message de confirmation d'inscription au client 
         emailService.sendSignupEmail(data.email_client, data.prenom_client).catch(
            err => console.error("Erreur lors de l'envoi de email:", err.message)
         )

        // ✅ On retourne aussi le mdp en clair pour que le controller puisse
        // appeler authService.loginClient juste après. Le controller NE renvoie
        // PAS ce champ au client final — il sert uniquement en interne.
        return { ...newClient, _plainPassword: plainPassword };
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
    },

    restoreClient: async (id) => {
        const clientRestore = await clientModel.restore(id)

        if(!clientRestore) {
            const error = new Error('Client non trouvé')
            error.status = 404;
            throw error
        }
        return clientRestore
    },
    
    deleteForceClient: async(id) => {
        const clientDeleted = await clientModel.deleteForce(id)

        if(!clientDeleted) {
            const error = new Error('Client introuvable !')
            error.status = 404
            throw error
        }

        return clientDeleted
    }
}

module.exports = clientservice;