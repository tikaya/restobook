// Importons le module de gestion de la base de données
const db = require('../db');

//Créeons un objet platModel contenant les méthodes pour interagir avec la table "plats"
const platModel = {
    //Récupérons tous les plats
    findAll: async () => {
        const result = await db.query(
            `SELECT 
            id_item_menu,
            nom_item_menu,
            description_item_menu,
            prix_item_menu,
            image_item_menu,
            allergenes_item_menu,
            disponible_item_menu,
            id_categorie
            FROM item_menu`
        );
        return result.rows || [];
    },

    //Récupérons un plat par son ID
    findById: async (id) =>{
        const result = await db.query(
            `SELECT * 
            FROM item_menu
            WHERE id_item_menu = $1`, [id]
        );
        return result.rows[0] || null;
    },

    // Créons un nouveau plat
    create: async (data) => {
        const result = await db.query(
            `
            INSERT INTO item_menu 
            (nom_item_menu, description_item_menu, prix_item_menu, image_item_menu, allergenes_item_menu, disponible_item_menu, id_categorie)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                data.nom_item_menu,
                data.description_item_menu,
                data.prix_item_menu,
                data.image_item_menu,
                data.allergenes_item_menu,
                data.disponible_item_menu,
                data.id_categorie
            ]
        );
        return result.rows[0] || null;
    },

    // Mettons à jour un plat existant
    update: async (id,data) => {
        const result = await db.query(
            `
            UPDATE item_menu
            SET nom_item_menu = $1,
                description_item_menu = $2,
                prix_item_menu = $3,
                image_item_menu = $4,
                allergenes_item_menu = $5,
                disponible_item_menu = $6,
                id_categorie = $7
            WHERE id_item_menu = $8
            RETURNING *`,
            [
                data.nom_item_menu,
                data.description_item_menu,
                data.prix_item_menu,
                data.image_item_menu,
                data.allergenes_item_menu,
                data.disponible_item_menu,
                data.id_categorie,
                id
            ]
        );
        return result.rows[0] || null;
    },

    // Supprimons un plat
    delete: async (id) => {
        const result = await db.query(
            `DELETE FROM item_menu
            WHERE id_item_menu = $1
            RETURNING *`, [id]
        );
        return result.rows[0] || null;
    }
}

module.exports =  platModel;
        
        
   

