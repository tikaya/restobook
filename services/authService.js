const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const clientModel = require('../models/clientModel');
const employeModel = require('../models/employeModel');

const authService = {
    loginClient: async (email, mdp) => {
        const client = await clientModel.findByEmail(email);
        if (!client) {
            const error = new Error('Email ou mot de passe incorrect');
            error.status = 401;
            throw error;
        }

        const match = await bcrypt.compare(mdp, client.mdp_client);
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
    }
};

module.exports = authService;