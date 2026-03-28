//Importons le module de connexion à la base de donnée pour exécuter toutees les requetes SQL liées aux catégories
const db = require('../db');

//Créons un objet categorieModel pour gérer les requetes SQL liées aux catégories
const categorieModel = {
   getAllCategories: async () => {
    const result = await db.query(
        `SELECT * FROM categorie ORDER BY ordre_affichage_categorie ASC`
    );
    return result.rows;
    },
    getCategorieById: async (id) => {
        const result = await db.query(
            `SELECT * FROM categorie
                WHERE id_categorie = $1`, [id]
        );
        return result.rows[0] || null;
    },

    createCategorie: async (data) => {
        const result = await db.query(
            `INSERT INTO categorie (nom_categorie, ordre_affichage_categorie)
            VALUES ($1, $2)
            RETURNING *`, [data.nom_categorie, data.ordre_affichage_categorie]
        );
        return result.rows[0] || null;

    },
    updateCategorie: async (id,data) => {
        const result = await db.query(
            `UPDATE categorie
             SET nom_categorie = $1, ordre_affichage_categorie = $2
             WHERE id_categorie = $3
             RETURNING *`, [data.nom_categorie, data.ordre_affichage_categorie, id]
        );
        return result.rows[0] || null;
    },

    deleteCategorie: async (id) => {
        const result = await db.query(
            `DELETE FROM categorie
             WHERE id_categorie = $1
             RETURNING *`, [id]
        );
        return result.rows[0] || null;  
        
    }
}
module.exports = categorieModel;