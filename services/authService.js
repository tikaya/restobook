const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const clientModel = require('../models/clientModel');
const employeModel = require('../models/employeModel');
const emailService = require('../services/emailService');

const crypto = require('crypto');

const authService = {
    loginClient: async (email, mdp) => {
        const client = await clientModel.findByEmail(email);
        if (!client) {
            const error = new Error('Email ou mot de passe incorrect');
            error.status = 401;
            throw error;
        }

        const match = await bcrypt.compare(mdp, client.mdp_client);

        if (client.doit_changer_mdp_client) {
        return {
        mustChangePassword: true,
        tempToken: jwt.sign(
            { id: client.id_client, email: client.email_client, role: 'client', mustChange: true },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }  // Token court — juste pour changer le mdp
        )
    };
}
        if (!match) {
            const error = new Error('Email ou mot de passe incorrect');
            error.status = 401;
            throw error;
        }

        const token = jwt.sign(
            { id: client.id_client, email: client.email_client, role: 'client' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return {
            token,
            user: {
                id: client.id_client,
                email: client.email_client,
                nom: client.nom_client,
                prenom: client.prenom_client,
                role: 'client'
            }
        };
    },

    loginEmploye: async (email, mdp) => {
        const employe = await employeModel.findByEmail(email);
        if (!employe) {
            const error = new Error('Email ou mot de passe incorrect');
            error.status = 401;
            throw error;
        }

        const match = await bcrypt.compare(mdp, employe.mdp_employe);
        if (!match) {
            const error = new Error('Email ou mot de passe incorrect');
            error.status = 401;
            throw error;
        }

        const token = jwt.sign(
            { id: employe.id_employe, email: employe.email_employe, role: employe.role_employe },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return {
            token,
            user: {
                id: employe.id_employe,
                email: employe.email_employe,
                nom: employe.nom_employe,
                prenom: employe.prenom_employe,
                role: employe.role_employe
            }
        };
    },
    forgotPassword: async (email)=> {
        // Verifions que le client existe en BDD
        const client = await clientModel.findByEmail(email);
        if(!client) {
            // On va creer un nouvel objet erreur
            const error = new Error('Client introuvable !');
            error.status = 404;
            throw error
        }
        // On va génerer un nouveau mot de passe temporaire en claire 
        const tempPassword =  crypto.randomBytes(6).toString("hex") + 'A1!';

        // Hashons le nopuveau mot de passe temporaire généré
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(tempPassword,salt);

        // Ajoutons le mdp hashé dans la base de données 
        await clientModel.updatePassword(client.id_client,hashedpassword);

        // Envoyons le mouveaud e passe temporaire au client
        await emailService.sendNewPassword(email,tempPassword)

        return  { message: 'Un nouveau mot de passe a été envoyé par email' };
    },

    changePassword: async (id, newPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await clientModel.updatePassword(id, hashedPassword);
    await clientModel.resetMustChangePassword(id);

    return { message: 'Mot de passe changé avec succès' };
}
};



module.exports = authService;