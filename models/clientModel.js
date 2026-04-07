/**
 * Client Model — Couche d'accès aux données (SQL)
 * 
 * Ce module est un OBJET (collection nommée) dont chaque clé
 * est une MÉTHODE asynchrone qui exécute une requête SQL.
 * 
 * Responsabilité unique : parler à PostgreSQL.
 * Ce module ne connaît PAS req, res, ni aucune logique métier.
 * 
 * Pattern : chaque méthode suit le schéma
 *   Entrée  → paramètres JavaScript (id, email, data)
 *   Effet   → pool.query() envoie la requête SQL à PostgreSQL
 *   Sortie  → les lignes retournées (rows) ou null
 * 
 * Sécurité :
 *   - Les SELECT n'exposent JAMAIS mdp_client (le hash du mot de passe)
 *   - Seul findByEmail retourne tout (*) car le service auth en aura besoin
 *     pour comparer le mot de passe avec bcrypt
 *   - Les requêtes utilisent des paramètres $1, $2... (requêtes paramétrées)
 *     pour empêcher les injections SQL
 *   - Toutes les requêtes filtrent avec compte_supprime = FALSE
 *     pour respecter le soft delete (RGPD)
 */

//Importons le module de connexion à la base de données
const pool = require('../db');

const clientModel = {
    /**
     * Récupérer tous les clients actifs
     * 
     * Entrée  : rien (∅)
     * SQL     : SELECT ... FROM client WHERE compte_supprime = FALSE
     * Sortie  : tableau d'objets [{ id_client, email_client, ... }, ...]
     *           ou tableau vide [] si aucun client
     */

    findAll: async () => {
        const result = await pool.query(
            'SELECT id_client, email_client, nom_client, prenom_client, telephone_client, date_inscription_client FROM client WHERE compte_supprime = FALSE'
        )
        return result.rows;

    },
    

    /**
     * Récupérer un client par son ID
     * 
     * Entrée  : id (Number) — l'identifiant du client
     * SQL     : SELECT ... WHERE id_client = $1 AND compte_supprime = FALSE
     * Sortie  : un objet { id_client, email_client, ... } ou null si non trouvé
     * 
     * Note : $1 est remplacé par la valeur de [id]
     *        C'est une requête PARAMÉTRÉE — protection contre l'injection SQL
     */


    findById:async (id) => {
        const result = await pool.query(
            'SELECT id_client, email_client, nom_client, prenom_client, telephone_client, date_inscription_client FROM client WHERE id_client = $1 AND compte_supprime = FALSE',
            [id]
        );
        return result.rows[0] || null;        
    },
    
    /**
     * Récupérer un client par son email
     * 
     * Entrée  : email (String) — l'adresse email
     * SQL     : SELECT * FROM client WHERE email_client = $1
     * Sortie  : un objet avec TOUTES les colonnes (y compris mdp_client) ou null
     * 
     * ⚠️ Cette méthode retourne SELECT * (incluant le mot de passe)
     *    car elle sera utilisée par le service d'authentification
     *    pour comparer le mot de passe saisi avec le hash en BDD (bcrypt.compare)
     *    Le mot de passe ne sera JAMAIS renvoyé au client HTTP
     */

    findByEmail:async (email) => {
        const result = await pool.query(
            'SELECT * FROM client WHERE email_client = $1 AND compte_supprime = FALSE',
            [email]
        );
        return result.rows[0] || null;
    },

     /**
     * Créer un nouveau client
     * 
     * Entrée  : data (Object) — { email_client, mdp_client, nom_client,
     *                              prenom_client, telephone_client }
     * SQL     : INSERT INTO client (...) VALUES ($1,...$5) RETURNING ...
     * Sortie  : l'objet client créé (SANS le mot de passe)
     * 
     * Note : RETURNING * fait que PostgreSQL retourne la ligne insérée
     *        directement — pas besoin d'un second SELECT
     * 
     * Erreur possible : si email_client existe déjà → PostgreSQL lance
     *        l'erreur 23505 (violation contrainte UNIQUE)
     *        Le controller l'attrapera et renverra 409 Conflict
     */

     create: async (data) => {
        const result = await pool.query(
           `INSERT INTO client (email_client, mdp_client, nom_client, prenom_client, telephone_client)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_client, email_client, nom_client, prenom_client, telephone_client, date_inscription_client`,
            [data.email_client, data.mdp_client, data.nom_client, data.prenom_client, data.telephone_client]
        );
        return result.rows[0] || null;
     },

    /**
     * Modifier un client existant
     * 
     * Entrée  : id (Number) — l'identifiant du client
     *           data (Object) — { nom_client, prenom_client, telephone_client }
     * SQL     : UPDATE client SET ... WHERE id_client = $4 RETURNING ...
     * Sortie  : l'objet client modifié ou null si non trouvé
     * 
     * Note : on ne permet PAS de modifier l'email ni le mot de passe ici
     *        Le changement de mot de passe sera une route séparée
     *        Le changement d'email aussi (besoin de re-vérification)
     */

    update: async (id,data) => {
        const result = await pool.query(
            `UPDATE client
            SET nom_client = $1, prenom_client = $2, telephone_client = $3
            WHERE id_client = $4 AND compte_supprime = FALSE
            RETURNING id_client, email_client, nom_client, prenom_client, telephone_client, date_inscription_client`,
            [data.nom_client, data.prenom_client, data.telephone_client, id]
        )
        return result.rows[0] || null;
    },

    /** 
     * Mettre à jour le mot de passe oublié par le client
     * Entrée : Produit cartésien id (Number) -l'identifiant du client
     * SQL    : UPDATE client SET mdp_client = newPassword , changer_mdp_client = TRUE
     * Sortie : l'objet {id_client} ou null sinon trouvé
     
     */
    updatePassword : async (id,hashedPassword) => {
        const result = await pool.query(
            `UPDATE client
             SET mdp_client = $1,
             doit_changer_mdp_client = TRUE
             WHERE id_client = $2 AND compte_supprime = FALSE
             RETURNING id_client
              `,
              [hashedPassword,id]
        )
        return result.rows[0] || null
    },
    

     /**
     * Supprimer un client (soft delete — RGPD)
     * 
     * Entrée  : id (Number) — l'identifiant du client
     * SQL     : UPDATE client SET compte_supprime = TRUE WHERE id_client = $1
     * Sortie  : l'objet { id_client } ou null si non trouvé
     * 
     * ⚠️ Ce n'est PAS un vrai DELETE SQL
     *    On met compte_supprime = TRUE (soft delete)
     *    Les données restent en BDD mais le client est considéré supprimé
     *    Toutes les autres requêtes filtrent avec compte_supprime = FALSE
     *    donc ce client devient INVISIBLE
     * 
     *    Pourquoi : le RGPD exige de pouvoir supprimer les données
     *    d'un utilisateur. Le soft delete permet de garder une trace
     *    (pour les réservations passées, la comptabilité, etc.)
     *    tout en rendant le compte inaccessible
     */
softDelete: async (id) => {
    const result = await pool.query(
        `UPDATE client
         SET compte_supprime = TRUE,
             email_client = 'supprime_' || id_client || '@deleted.local',
             nom_client = 'Compte',
             prenom_client = 'Supprimé',
             telephone_client = NULL
         WHERE id_client = $1 AND compte_supprime = FALSE
         RETURNING id_client`,
        [id]
    );
    return result.rows[0] || null;
},

     resetMustChangePassword: async (id) => {
    const result = await pool.query(
        `UPDATE client 
        SET doit_changer_mdp_client = FALSE
        WHERE id_client = $1
        RETURNING id_client`,
        [id]
    );
    return result.rows[0] || null;
},
  
}
module.exports = clientModel;