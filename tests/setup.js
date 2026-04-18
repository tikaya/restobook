// Chargé APRÈS que Jest soit initialisé
jest.setTimeout(15000);

// Fermer les connexions PostgreSQL après chaque suite
afterAll(async () => {
    try {
        const pool = require('../db');
        if (pool && pool.end) await pool.end();
    } catch (err) {
        // pool pas encore créé ou déjà fermé
    }
});