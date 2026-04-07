const db = require('../db');

const avisModel = {
    // Avis approuvés uniquement (public)
    findAllApproved: async () => {
    const result = await db.query(`
        SELECT a.*, c.nom_client, c.prenom_client
        FROM avis a
        LEFT JOIN client c ON a.id_client = c.id_client
        WHERE a.statut_avis = 'approuve'
        ORDER BY a.date_avis DESC
    `);
    return result.rows || [];
},

    // Tous les avis (admin/serveur)
// avisModel.js — findAll()
findAll: async () => {
    const result = await db.query(`
        SELECT a.*, c.nom_client, c.prenom_client
        FROM avis a
        LEFT JOIN client c ON a.id_client = c.id_client
        ORDER BY a.date_avis DESC
    `);
    return result.rows || [];
},

    findById: async (id) => {
        const result = await db.query(
            `SELECT * FROM avis WHERE id_avis = $1`, [id]
        );
        return result.rows[0] || null;
    },

    create: async (data) => {
        const result = await db.query(
            `INSERT INTO avis 
            (note_avis, commentaire_avis, id_client, id_reservation)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [data.note_avis, data.commentaire_avis, data.id_client, data.id_reservation]
        );
        return result.rows[0] || null;
    },

    moderate: async (id, statut) => {
        const result = await db.query(
            `UPDATE avis 
            SET statut_avis = $1
            WHERE id_avis = $2
            RETURNING *`, [statut, id]
        );
        return result.rows[0] || null;
    },

    delete: async (id) => {
        const result = await db.query(
            `DELETE FROM avis WHERE id_avis = $1 RETURNING *`, [id]
        );
        return result.rows[0] || null;
    }
}

module.exports = avisModel;