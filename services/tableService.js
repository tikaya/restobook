//Importons le module tableModel pour interagir avec la table "table_resto"
const tableModel = require('../models/tableModel');

//Créer un objet tableService avec des méthodes pour la logique métier liée aux tables

const tableService = {
    getAllTables: async () => {
        return await tableModel.findAll();
    },

    getTableById: async (id) => {
        const table = await tableModel.findById(id);
        if(!table){
            const error = new Error('Table non trouvée');
            error.status = 404;
            throw error;
        }
        return table;
    },

    createTable: async (data) => {
        const newTable = await tableModel.create(data);
        if(!newTable){
            const error = new Error('Erreur lors de la création de la table');
            error.status = 500;
            throw error;
        }
        return newTable;
    },

    updateTable: async (id,data) => {
        const updatedTable = await tableModel.update(id,data);
        if(!updatedTable){
            const error = new Error ('Table non trouvée ou erreur lors de la mise à jour');
            error.status = 404;
            throw error;
        }
        return updatedTable;
    },

    deleteTable: async (id) => {
        const deletedTable =await tableModel.remove(id);
        if(!deletedTable){
            const error = new Error ('table non trouvée ou erreur lors de la suppression');
            error.status = 404;
            throw error;
        };
        return deletedTable;
    }
}

module.exports = tableService;      
