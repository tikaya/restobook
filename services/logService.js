const Log = require('../models/logModel');

const logService = {

    log: async (type_action, id_utilisateur, details, ip, extras = {}) => {
        try {
            await Log.create({
                type_action,
                id_utilisateur,
                details,
                ip,
                role_utilisateur:  extras.role        || null,
                user_agent:        extras.user_agent   || null,
                methode_http:      extras.methode      || null,
                url:               extras.url          || null,
                statut:            extras.statut       || 'succes',
                duree_ms:          extras.duree_ms     || null
            });
        } catch (err) {
            console.error('Erreur log MongoDB:', err.message);
        }
    },

    // Extraire les infos utiles depuis req
    fromReq: (req) => ({
        ip:         req.ip || req.headers['x-forwarded-for'] || null,
        user_agent: req.headers['user-agent'] || null,
        methode:    req.method || null,
        url:        req.originalUrl || null,
        role:       req.user?.role || null
    }),

    getAllLogs: async (limit = 200) => {
        return await Log.find().sort({ horodatage: -1 }).limit(limit);
    },

    // Filtrer par type
    getLogsByType: async (type_action) => {
        return await Log.find({ type_action }).sort({ horodatage: -1 }).limit(100);
    },

    // Filtrer par utilisateur
    getLogsByUser: async (id_utilisateur) => {
        return await Log.find({ id_utilisateur }).sort({ horodatage: -1 }).limit(100);
    },

    // Stats pour le dashboard admin
    getStats: async () => {
        const total     = await Log.countDocuments();
        const echecs    = await Log.countDocuments({ statut: 'echec' });
        const warnings  = await Log.countDocuments({ statut: 'warning' });
        const aujourdhui = await Log.countDocuments({
            horodatage: { $gte: new Date(new Date().setHours(0,0,0,0)) }
        });
        return { total, echecs, warnings, aujourdhui };
    }
};

module.exports = logService;