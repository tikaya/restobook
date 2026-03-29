const db = require('../db');

const contactModel = {
    findAll: async () => {
        const result = await db.query(
            `SELECT * FROM message_contact ORDER BY date_heure_reception DESC`
        );
        return result.rows;
    },

    findById: async (id) => {
        const result = await db.query(
            `SELECT * FROM message_contact WHERE id_message = $1`, [id]
        );
        return result.rows[0] || null;
    },

    create: async (data) => {
        const result = await db.query(
            `INSERT INTO message_contact 
            (nom_expediteur, email_expediteur, sujet_message, contenu_message)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [data.nom_expediteur, data.email_expediteur, data.sujet_message, data.contenu_message]
        );
        return result.rows[0] || null;
    },

    delete: async (id) => {
        const result = await db.query(
            `DELETE FROM message_contact WHERE id_message = $1 RETURNING *`, [id]
        );
        return result.rows[0] || null;
    }
}

module.exports = contactModel;