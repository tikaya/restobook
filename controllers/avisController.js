// Impotons le module avisService pour utiliser la logique métier des avis
const avisService = require('../services/avisService')

// Créons un objet avisController qui contiendra les fonctions de contrôle pour les avis
const avisController = {
    // voir tous les avis approuvés (public)
    getAvisPublic: async (req,res ,next) => {
        try {
            const avis = await avisService.getAvisApproves()
            res.json(avis)

        }catch (error) {
            next(error)
        }
},
    // voir tous les avis (admin/serveur)
    getAvisAll: async (req,res ,next) => {
       try {
         const avis = await avisService.getAllAvis()
        res.json(avis)
       } catch (error) {
        next(error)
       }
    },

    // voir un avis par id
    getAvisById: async(req,res ,next) => {
        const id = parseInt(req.params.id)
        try {
            const avis = await avisService.getAvisById(id)
            res.json(avis)
        } catch(error) {
            next(error)
        }
    },

    // créer un avis
    createAvis: async (req,res,next) => {
        const data = req.body
        try {
            const newAvis = await avisService.createAvis(data)
            res.status(201).json(newAvis)

        }catch (error) {
            if(error.code === '23503') { 
                return res.status(400).json({ error: 'Client non trouvé' })
            }
            next(error)
        }
    },

    // modérer un avis
    moderateAvis: async (req,res,next) => {
    const id = parseInt(req.params.id)
    const  status = req.body.statut_avis
    try {
        const updatedAvis = await avisService.moderateAvis(id, status)
        res.json(updatedAvis)

    } catch (error) {
        next(error)
    }

},

// supprimer un avis
deleteAvis: async (req,res,next) => {
    const id = parseInt(req.params.id)
    try {
        const deletedAvis = await avisService.deleteAvis(id)
        res.json(deletedAvis)

    } catch (error) {
        next(error)
    }
}
}

module.exports = avisController