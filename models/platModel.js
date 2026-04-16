// Importons le module de gestion de la base de données
const db = require('../db');

//Créeons un objet platModel contenant les méthodes pour interagir avec la table "plats"
const platModel = {
    //Récupérons tous les plats
  findAll: async () => {
    const result = await db.query(`
        SELECT p.*, c.nom_categorie
        FROM item_menu p
        LEFT JOIN categorie c ON p.id_categorie = c.id_categorie
        ORDER BY c.ordre_affichage_categorie, p.nom_item_menu
    `);
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
   update: async (id, data) => {
    const result = await db.query(
        `UPDATE item_menu
         SET nom_item_menu       = $1,
             description_item_menu = $2,
             prix_item_menu      = $3,
             image_item_menu     = COALESCE($4, image_item_menu), -- ← garde l'ancienne si null
             allergenes_item_menu = $5,
             disponible_item_menu = $6,
             id_categorie        = $7
         WHERE id_item_menu = $8
         RETURNING *`,
        [
            data.nom_item_menu,
            data.description_item_menu,
            data.prix_item_menu,
            data.image_item_menu || null,  // ← null si pas de nouvelle image
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
    },
    // Dans platModel.js — ajouter cette méthode
updateImage: async (id, imagePath) => {
    const result = await db.query(
        `UPDATE item_menu
         SET image_item_menu = $1
         WHERE id_item_menu = $2
         RETURNING *`,
        [imagePath, id]
    );
    return result.rows[0] || null;
}
}

module.exports =  platModel;
        
        
   

