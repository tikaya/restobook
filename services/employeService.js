// Importons le module du modèle employe
const employeModel = require('../models/employeModel');

// Objet employeService avec des méthodes pour la logique métier liée aux employés
const employeService = {
    getAllEmployes: async () => {
        return await employeModel.findAll();
    },

    getEmployeById: async (id) => {
        const employe = await employeModel.findById(id);
         if(!employe) {
            const error = new Error('Employé non trouvé');
            error.status = 404;
            throw error;
         }
         return employe;
    },

    createEmploye: async (data) => {
        if(!data.email_employe || !data.mdp_employe || !data.nom_employe || !data.prenom_employe || !data.role_employe) {
            const error = new Error("email, mot de passe, nom, prenom et role sont requis");
            error.status = 400;
            throw error;
        }
        // On ajoutera bcrypt ici plus tard
        return await employeModel.create(data);
    },

    updateEmploye : async (id,data) => {
        const employe = await employeModel.update(id,data);

         if(!employe) {
            const error = new Error('Employé non trouvé');
            error.status = 404;
            throw error;
         }
         return employe;
    },

    deleteEmploye: async (id) => {
        const employe = await employeModel.remove(id);

        if(!employe) {
            const error = new Error('Employé non trouvé');
            error.status = 404;
            throw error;
        }
        return {message: 'Employé supprimé avec succès'};
    }


}

module.exports = employeService;