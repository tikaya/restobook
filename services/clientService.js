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
         // Hash du mot de passe avant de le stocker
         const salt = await bcrypt.genSalt(10);

         // Hashons le mdp_client concretement
           data.mdp_client = await bcrypt.hash(data.mdp_client,salt );

        const newClient = await clientModel.create(data);

        // Envoyons un message de confirmation d'inscription au client 
         emailService.sendSignupEmail(data.email_client,data.prenom_client).catch(
            err =>console.error("Erreur lors de l'envoi de email:",err.message )
         )

        return newClient;
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
        // Appelons la methode restore du model
        const clientRestore = await clientModel.restore(id)

        //Si rien n'est stocké dans la variable

        if(!clientRestore) {
            // Creer un objet error
            const error = new Error('Client non trouvé')
            //AJoutons cette methode status a l'objet error
            error.status = 404;
            //Balancons l'erreur au prochain catch
            
            throw error
        }
        //Si tous c'est bien passé
        return clientRestore

    },
    
    deleteForceClient: async(id) => {
        // Appelons la methode deleteForceClient du model
        const clientDeleted = await clientModel.deleteForce(id)

        // Soit la suppression à echouée
        if(!clientDeleted) {
            // On crèe l'objet erreur 
            const error = new Error('Client introuvable !')
            // Ajoutons la propriété status à la valeur 404
            error.status = 404
            // Balacons l'erreur  au middleware de gestion d'erreur
            throw error
        }

        // Si tous se passe bien on retourne clientDeleted
        return clientDeleted
    
    }
}

module.exports = clientservice;