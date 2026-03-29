// Importons le module avisModel pour interagir avec la base de données
const avisModel = require('../models/avisModel')

// Créons un objet avisService qui contiendra les fonctions de logique métier pour les avis
const avisService = {
    // voir tous les avis
    getAvisApproves: async() => {
        const avis = await avisModel.findAllApproved()
        return avis
    },

    // voir tous les avis (admin/serveur)
    getAllAvis: async () => {
        const avis = await avisModel.findAll()
        return avis
    },

    // voir un avis par id
    getAvisById : async (id) => {
        const avis = await avisModel.findById(id)
        if(!avis) {
            const error = new Error('Avis non trouvé')
            error.status = 404
            throw error
        }
        return avis
    },

    // créer un avis
    createAvis : async (data) => {
        const newAvis = await avisModel.create(data)
        if(!newAvis) {
            const error = new Error('Erreur lors de la création de l\'avis')
            error.status = 500
            throw error
        }
        return newAvis
    },

    // modérer un avis
    moderateAvis : async (id, statut) => {
        const updatedAvis = await avisModel.moderate(id, statut)
        if(!updatedAvis) {
            const error = new Error('Avis non trouvé ou erreur lors de la modération')
            error.status = 404
            throw error
        }
        return updatedAvis
    },

    // supprimer un avis
    deleteAvis : async (id) => {
        const deletedAvis = await avisModel.delete(id)
        if(!deletedAvis) {
            const error = new Error('Avis non trouvé ou erreur lors de la suppression')
            error.status = 404
            throw error
        }
        return deletedAvis
    }
}

module.exports = avisService