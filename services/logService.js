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
    },

     // ✅ Nouvelle méthode — récupérer tous les logs
    getAllLogs: async () => {
        const logs = await Log.find().sort({ horodatage: -1 }).limit(100);
        return logs;
    }
};

module.exports = logService;