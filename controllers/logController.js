const Log = require('../models/logModel');
const logService = require('../services/logService');

const logController = {

    getAll: async (req, res, next) => {
        try {
            const logs  = await logService.getAllLogs(200);
            const stats = await logService.getStats();
            res.json({ logs, stats });
        } catch(err) {
            next(err);
        }
    }

};

module.exports = logController;