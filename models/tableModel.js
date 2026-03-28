//Importons le module de connexion à la base de données
const db = require('../db');

//Créer un objet tableModel avec des méthodes pour interagir avec la table "table"
const tableModel = {
    findAll:async () => {
        const result = await db.query(
            `SELECT id_table,
                    numero_table,
                    capacite_table,
                    emplacement_table 
             FROM table_resto`
        );
        return result.rows;
    },

    findById: async (id) => {
        const result = await db.query(
            `SELECT id_table,
                    numero_table,
                    capacite_table,
                    emplacement_table 
             FROM table_resto
             WHERE id_table = $1`, [id]
        );
        return result.rows[0] || null;
    },

    create: async (data) => {
        const result = await db.query(
            `INSERT INTO table_resto
                (numero_table,capacite_table, emplacement_table)
                VALUES ($1, $2, $3)
                RETURNING id_table, numero_table, capacite_table, emplacement_table`,
                [data.numero_table, data.capacite_table, data.emplacement_table]
        );
        return result.rows[0] || null;
    },

    update: async (id,data) => {
        const result = await db.query(
            `UPDATE table_resto
                SET numero_table = $1,
                    capacite_table = $2,
                    emplacement_table = $3
                WHERE id_table = $4
                RETURNING id_table, numero_table, capacite_table, emplacement_table`,
                [data.numero_table, data.capacite_table, data.emplacement_table, id]
        );
        return result.rows[0] || null;
    },

    remove: async (id) => {
        const result = await db.query(
            `DELETE FROM table_resto
             WHERE id_table = $1
             RETURNING id_table`, [id]
        );
        return result.rows[0] || null;
    }
}

module.exports = tableModel;