const Log = require('../models/logModel');

const logService = {
    log: async (type_action, id_utilisateur, details, ip) => {
        try {
            await Log.create({
                type_action,
                id_utilisateur,
                details,
                ip
            });
        } catch (err) {
            console.error('Erreur log MongoDB:', err.message);
        }
    }
};

module.exports = logService;