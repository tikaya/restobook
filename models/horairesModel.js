//Importons le module de connexion à la base de donnée
const db = require('../db');

//Objet horairesModel avec des méthodes pour intéragir avec la table "horaires" 
const horairesModel = {
    //Récupérer tous les horaires
    findAll: async () => {
        const result = await db.query(
            `
            SELECT * FROM horaire
            `
        );
        return result.rows || [];
    },

    //Récupérer un horaire par son ID
    findById: async (id) => {
        const result = await db.query(
            `
            SELECT * FROM horaire
            WHERE id_horaire = $1
            `, [id]
        );
        return result.rows[0] || null;
    },

update: async (id, data) => {
    const result = await db.query(
        `UPDATE horaire
        SET heure_ouverture = $1, heure_fermeture = $2, est_ferme = $3
        WHERE id_horaire = $4
        RETURNING *`,
        [data.heure_ouverture, data.heure_fermeture, data.est_ferme, id]
    );
    return result.rows[0] || null;
}

}
module.exports = horairesModel;

