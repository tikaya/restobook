// Importons le module du modèle employe
const employeModel = require('../models/employeModel');

// Importons via via la fonction require le l'ojet bcrypt pour le hash des mots de passe
const bcrypt = require('bcrypt');

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
        // Génerons le salt pour le hash du mot de passe
        const salt  = await bcrypt.genSalt(10);

        // Hashons le mot de passe de l'employé
        data.mdp_employe = await bcrypt.hash(data.mdp_employe, salt);
        
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