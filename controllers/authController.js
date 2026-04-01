// Importons le module authService pour accéder à la logique métier de l'authentification
const authService = require('../services/authService');

const authController =  {
    loginClient: async (req,res , next ) => {
        const { email_client, mdp_client } = req.body;
        try {
            const result = await authService.loginClient(email_client, mdp_client);
            res.json(result);
        }catch (error) {
            next(error);
        }

    },

    loginEmploye: async (req,res,next) => {
        const { email_employe, mdp_employe } = req.body;
        try {
            const result = await authService.loginEmploye(email_employe, mdp_employe);
            res.json(result);
        } catch (error) {
            next(error);
    }   

    },

forgotPassword: async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        res.json(result);
    } catch (error) {
        next(error);
    }
},
    changePassword: async (req, res, next) => {
    try {
        const { new_password } = req.body;
        const result = await authService.changePassword(req.user.id, new_password);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

}

module.exports = authController;