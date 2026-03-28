//Importons le module service tableService pour utiliser la logique métier liée aux tables 
const tableService = require('../services/tableService');

//Créer un objet tableController pour gérer les requetes HTTP liées aux tables 
const tableController = {

    getAllTables: async (req,res ,next) => {
        try {
            const tables = await tableService.getAllTables();
            res.json(tables);
        }catch(error){
            next(error);
        }
    },

    getTableById: async (req,res,next) => {
        const id = parseInt(req.params.id);
        try {
            const table = await tableService.getTableById(id);
            res.json(table);
        }catch(error){
            next(error);
        }
    },

    createTable: async (req,res,next) =>{
        const data = req.body;
        try {
            const newTable = await tableService.createTable(data);
            res.status(201).json(newTable);
        }catch(error) {
            next(error);
        }
    },

    updateTable: async (req,res,next) => {
        const id = parseInt(req.params.id);
        const data =req.body;
        try {
            const updatedTable = await tableService.updateTable(id,data);
            res.json(updatedTable);

        }catch(error) {
            next(error);

        }
    },

    deleteTable: async(req,res,next) => {
        const id = parseInt(req.params.id);
        try {
            const deletedTable = await tableService.deleteTable(id);
            res.json(deletedTable);
        } catch (error) {
            next(error);
        }
    }


}

module.exports = tableController;