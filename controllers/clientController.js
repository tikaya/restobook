// Importons le module clientService pour accéder aux méthodes métier
const clientService = require('../services/clientService');

// ✅ Importons authService pour la connexion automatique après inscription
const authService = require('../services/authService');

const clientController = {
    getAll: async (req, res, next) => {
        try {
            const clients = await clientService.getAllClients();
            res.json(clients);
        } catch (error) {
            next(error);
        }
    },

    getOne: async (req, res, next) => {
        const id = parseInt(req.params.id);
        try {
            const client = await clientService.getClientById(id);
            res.json(client);
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        const data = req.body;
        try {
            // 1. Création du client (renvoie aussi _plainPassword en interne)
            const client = await clientService.createClient(data);

            // ═══════════════════════════════════════════════════════
            // 2. CONNEXION AUTOMATIQUE après inscription
            // On réutilise authService.loginClient pour cohérence totale
            // (mêmes logs, même JWT, même payload qu'au login normal)
            // ═══════════════════════════════════════════════════════
            try {
                const authResult = await authService.loginClient(
                    client.email_client,
                    client._plainPassword
                );

                // On retire _plainPassword avant de renvoyer au frontend
                delete client._plainPassword;

                // Réponse enrichie : token + user (comme le login)
                return res.status(201).json({
                    client,
                    token: authResult.token,
                    user:  authResult.user
                });
            } catch (authError) {
                // Si la connexion auto échoue (très rare), on renvoie quand même
                // le client créé sans token — l'utilisateur devra se connecter manuellement
                console.error('Connexion auto après inscription échouée:', authError.message);
                delete client._plainPassword;
                return res.status(201).json({ client });
            }

        } catch (error) {
            if (error.code === '23505') {
                return res.status(409).json({ error: 'Email déjà utilisé' });
            }
            next(error);
        }
    },

    update: async (req, res, next) => {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            const client = await clientService.updateClient(id, data);
            res.json(client);
        } catch (error) {
            next(error);
        }
    },

    remove: async (req, res, next) => {
        const id = parseInt(req.params.id);
        try {
            const client = await clientService.deleteClient(id);
            res.json(client);
        } catch (error) {
            next(error);
        }
    },

    restore: async (req, res, next) => {
        const id = parseInt(req.params.id);
        try {
            const client = await clientService.restoreClient(id)
            res.json(client)
        } catch (error) {
            next(error)
        }
    },

    deleteForce: async (req, res, next) => {
        const id = parseInt(req.params.id);
        try {
            const clientdeleted = await clientService.deleteForceClient(id);
            res.json(clientdeleted)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = clientController;