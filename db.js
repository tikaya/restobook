// Récuperons la classe Pool du module pg pour gérer les connexions multiple à la base de données PostgreSQL
const {Pool} = require('pg');

//Lisons et ajoutons les variables d'environnement à partir du fichier .env
require('dotenv').config();

//Créons une instance de Pool 
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

//Exportons l'instance de Pool pour pouvoir l'utiliser dans d'autres fichiers
module.exports = pool;

