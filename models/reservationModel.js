// Importons le module de conexion à la base de données
const db = require('../db');

// Créons un Objet ReservationModel pour gérer les réservations
const ReservationModel = {
    // Voir toutes les réservations 
    findAll: async () => {
        const result = await db.query (
            ` SELECT * FROM reservation ORDER by date_reservation ASC, heure_reservation ASC `
        )
        return result.rows || [];
    },

    // Voir une réservation par son ID
    findById: async (id) => {
        const result = await db.query (
            ` SELECT * FROM reservation WHERE id_reservation = $1 `,
            [id]
        )
        return result.rows[0] || null;
    },

    // Créer une nouvelle réservation
    create: async (data) => {
        const result = await db.query(
            ` INSERT INTO reservation 
            (date_reservation, heure_reservation , nb_personnes , demandes_speciales , id_client, id_table)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING * `,[
                data.date_reservation,
                data.heure_reservation,
                data.nb_personnes,
                data.demandes_speciales,
                data.id_client,
                data.id_table
            ]
        )
        return result.rows[0] || null;
    },

    update: async (id, data) => {
        const result = await db.query(
            ` UPDATE reservation
            SET date_reservation = $1,
                heure_reservation = $2,
                nb_personnes = $3,
                demandes_speciales = $4,
                statut_reservation  = $5
                WHERE id_reservation = $6
                RETURNING *`,[
                    data.date_reservation,
                    data.heure_reservation,
                    data.nb_personnes,
                    data.demandes_speciales,
                    data.statut_reservation,
                    id
                ]
        )
        return result.rows[0] || null;
    },

    delete: async (id) => {
        const result = await db.query(
            ` DELETE FROM reservation 
            WHERE id_reservation = $1 RETURNING *`, [id]
        );
        return result.rows[0] || null;
    }
        
    }

    module.exports = ReservationModel;

