// Importons objet Log
const Log = require("../models/logModel");

// Création objet logController
const logController =  {
    getAll: async(req,res , next) => {
        try {
            const logs = await Log.find().sort({ horodatage: -1 }).limit(100)
            res.json(logs)
        }catch(err){
            next(err);
        }
    }
}

module.exports = logController;