const { Pool } = require('pg');

// Fermer toutes les connexions apres les tests
afterAll(async () => {
    const pool = require('../db');
    await pool.end();
});