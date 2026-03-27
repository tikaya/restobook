//Importons le module de connexion à la base de donnée
const db = require('../db');

// Objet employeModel avec des méthodes pour interagir avec la table "employe"
const employeModel =  {

    //Récupérer tous les employés actifs
    findAll: async () => {
        const result = await db.query(
            `SELECT id_employe,
                    email_employe,
                    nom_employe,
                    prenom_employe,
                    role_employe
              FROM employe`
        )
        return result.rows;
    },

    //Récupérer un employé par son ID
    findById: async (id) => {
        const result = await db.query(
            `SELECT id_employe,
                    email_employe,
                    nom_employe,
                    prenom_employe,
                    role_employe
                FROM employe
                WHERE id_employe = $1`, [id]
        );
        return result.rows[0] || null;

    },

    findByEmail: async (email) => {
        const result = await db.query(
            `SELECT 
                    id_employe,
                    email_employe,
                    mdp_employe,
                    nom_employe,
                    prenom_employe,
                    role_employe
                FROM employe
                WHERE email_employe = $1`, [email]
        );
        return result.rows[0] || null;
    },

    create: async (data) => {
        const result = await db.query(
            `INSERT INTO employe
                (email_employe, nom_employe, prenom_employe, role_employe,mdp_employe)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_employe, email_employe, nom_employe, prenom_employe, role_employe`, 
                [data.email_employe, data.nom_employe, data.prenom_employe, data.role_employe, data.mdp_employe]
        );
        return result.rows[0] || null;
     },

     
  update: async (id, data) => {
    const result =  await db.query(
        `UPDATE employe
        SET 
            nom_employe = $1,
            prenom_employe = $2,
            role_employe = $3
        WHERE id_employe = $4
        RETURNING id_employe, email_employe, nom_employe, prenom_employe, role_employe`,
        [ data.nom_employe, data.prenom_employe, data.role_employe, id]
    );
    return result.rows[0] || null;
  },

  remove: async (id) => {
    const result = await db.query(
        `DELETE FROM employe
        WHERE id_employe = $1
        RETURNING id_employe`, [id]
    );
    return result.rows[0] || null;      
    
  }
    
  }  

module.exports = employeModel;