// Importons le module de connexion à la base de données
const db = require('../db');

// Créons un Objet ReservationModel pour gérer les réservations
const ReservationModel = {

    // Voir toutes les réservations
    findAll: async () => {
        const result = await db.query(`
            SELECT 
                r.*,
                c.nom_client,
                c.prenom_client,
                t.numero_table
            FROM reservation r
            LEFT JOIN client c ON r.id_client = c.id_client
            LEFT JOIN table_resto t ON r.id_table = t.id_table
            ORDER BY r.date_reservation ASC, r.heure_reservation ASC
        `);
        return result.rows || [];
    },

    // Voir une réservation par son ID
    findById: async (id) => {
        const result = await db.query(
            `SELECT * FROM reservation WHERE id_reservation = $1`,
            [id]
        );
        return result.rows[0] || null;
    },

    // Créer une nouvelle réservation
    create: async (data) => {
        const result = await db.query(
            `INSERT INTO reservation 
            (date_reservation, heure_reservation, nb_personnes, demandes_speciales, id_client, id_table)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                data.date_reservation,
                data.heure_reservation,
                data.nb_personnes,
                data.demandes_speciales,
                data.id_client,
                data.id_table
            ]
        );
        return result.rows[0] || null;
    },

    // Mettre à jour une réservation
    update: async (id, data) => {
        // 1. Récupérer la réservation existante
        const existing = await db.query(
            `SELECT * FROM reservation WHERE id_reservation = $1`, [id]
        );
        if (!existing.rows[0]) return null;
        const current = existing.rows[0];

        // 2. Fusionner : si le champ est fourni on le prend, sinon on garde l'ancien
        const date_reservation   = data.date_reservation   ?? current.date_reservation;
        const heure_reservation  = data.heure_reservation  ?? current.heure_reservation;
        const nb_personnes       = data.nb_personnes       ?? current.nb_personnes;
        const demandes_speciales = data.demandes_speciales ?? current.demandes_speciales;
        const statut_reservation = data.statut_reservation ?? current.statut_reservation;

        // 3. Mettre à jour avec les valeurs fusionnées
        const result = await db.query(
            `UPDATE reservation
             SET date_reservation   = $1,
                 heure_reservation  = $2,
                 nb_personnes       = $3,
                 demandes_speciales = $4,
                 statut_reservation = $5
             WHERE id_reservation   = $6
             RETURNING *`,
            [date_reservation, heure_reservation, nb_personnes, demandes_speciales, statut_reservation, id]
        );
        return result.rows[0] || null;
    },

    // Supprimer une réservation
    delete: async (id) => {
        const result = await db.query(
            `DELETE FROM reservation WHERE id_reservation = $1 RETURNING *`,
            [id]
        );
        return result.rows[0] || null;
    },

    // Voir les réservations d'un client
    findByClient: async (id_client) => {
        const result = await db.query(
            `SELECT r.*, c.nom_client, c.prenom_client, t.numero_table
             FROM reservation r
             LEFT JOIN client c ON r.id_client = c.id_client
             LEFT JOIN table_resto t ON r.id_table = t.id_table
             WHERE r.id_client = $1
             ORDER BY r.date_reservation DESC`,
            [id_client]
        );
        return result.rows || [];
    },

    // Trouver une table disponible pour un créneau donné
    findAvailableTable: async (date, heure, nb_personnes, emplacement = null) => {
        const params = [date, heure, nb_personnes];
        let emplacementClause = '';

        if (emplacement) {
            params.push(emplacement);
            emplacementClause = `AND t.emplacement_table = $${params.length}`;
        }

        const result = await db.query(  // ✅ db pas pool
            `SELECT t.id_table, t.numero_table, t.emplacement_table, t.capacite_table
             FROM table_resto t
             WHERE t.capacite_table >= $3
             AND t.disponible_table = TRUE
             ${emplacementClause}
             AND t.id_table NOT IN (
                 SELECT r.id_table FROM reservation r
                 WHERE r.date_reservation::date = $1::date
                 AND r.heure_reservation = $2
                 AND r.statut_reservation NOT IN ('annulee', 'no_show')
             )
             ORDER BY t.capacite_table ASC
             LIMIT 1`,
            params
        );

        return result.rows[0] || null;
    }

}; // ✅ accolade et point-virgule — fin de l'objet ReservationModel

module.exports = ReservationModel; // ✅ en dehors de l'objet