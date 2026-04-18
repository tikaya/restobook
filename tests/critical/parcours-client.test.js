const request = require('supertest');
const app     = require('../../server');
const pool    = require('../../db');

describe('🎯 TEST CRITIQUE — Parcours client complet', () => {

    // Email unique pour chaque run (timestamp)
    const timestamp  = Date.now();
    const testEmail  = `test_${timestamp}@restobook.test`;
    const testMdp    = 'Test123!';

    let token       = null;
    let clientId    = null;
    let resaId      = null;

    // ─────────────────────────────────────────────
    // Seed — créer les données nécessaires AVANT tout
    // ─────────────────────────────────────────────
    beforeAll(async () => {
        // Catégorie (requise pour items_menu si jamais)
        await pool.query(`
            INSERT INTO categorie (nom_categorie, ordre_affichage_categorie)
            VALUES ('TestCat', 1)
            ON CONFLICT (nom_categorie) DO NOTHING
        `);

        // Tables (nécessaires pour findAvailableTable)
        await pool.query(`
            INSERT INTO table_resto (numero_table, capacite_table, emplacement_table, disponible_table)
            VALUES
                (101, 2, 'interieur', TRUE),
                (102, 4, 'interieur', TRUE),
                (103, 2, 'terrasse',  TRUE),
                (104, 6, 'salon_prive', TRUE)
            ON CONFLICT (numero_table) DO NOTHING
        `);
    });

    // ─────────────────────────────────────────────
    // Nettoyage après les tests
    // ─────────────────────────────────────────────
    afterAll(async () => {
        try {
            if (resaId)   await pool.query('DELETE FROM reservation WHERE id_reservation = $1', [resaId]);
            if (clientId) await pool.query('DELETE FROM client WHERE id_client = $1', [clientId]);
        } catch (err) {
            console.error('Erreur cleanup:', err.message);
        }
        await pool.end();
    });

    // ─────────────────────────────────────────────
    // TEST 1 — Inscription
    // ─────────────────────────────────────────────
    test('1️⃣  doit permettre l\'inscription d\'un nouveau client', async () => {
        const response = await request(app)
            .post('/clients')
            .send({
                email_client:     testEmail,
                mdp_client:       testMdp,
                nom_client:       'TestNom',
                prenom_client:    'TestPrenom',
                telephone_client: '0612345678'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id_client');
        expect(response.body.email_client).toBe(testEmail);

        clientId = response.body.id_client;
    });

    // ─────────────────────────────────────────────
    // TEST 2 — Login
    // ─────────────────────────────────────────────
    test('2️⃣  doit permettre la connexion et retourner un JWT', async () => {
        const response = await request(app)
            .post('/auth/login/client')
            .send({
                email_client: testEmail,
                mdp_client:   testMdp
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user.email).toBe(testEmail);
        expect(response.body.user.role).toBe('client');

        token = response.body.token;
    });

    // ─────────────────────────────────────────────
    // TEST 3 — Création réservation
    // ─────────────────────────────────────────────
    test('3️⃣  doit permettre la création d\'une réservation avec JWT', async () => {
        const response = await request(app)
            .post('/reservations')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id_client:         clientId,
                date_reservation:  '2026-05-12',  // mardi
                heure_reservation: '13:00',
                nb_personnes:      2,
                emplacement_table: 'interieur'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id_reservation');
        expect(response.body.id_client).toBe(clientId);

        resaId = response.body.id_reservation;
    });

    // ─────────────────────────────────────────────
    // TEST 4 — Récupération des réservations
    // ─────────────────────────────────────────────
    test('4️⃣  doit retourner la réservation dans mes-reservations', async () => {
        const response = await request(app)
            .get('/reservations/mes-reservations')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);

        const maResa = response.body.find(r => r.id_reservation === resaId);
        expect(maResa).toBeDefined();
    });

    // ─────────────────────────────────────────────
    // TEST 5 — Sécurité sans token
    // ─────────────────────────────────────────────
    test('5️⃣  doit refuser l\'accès à mes-reservations sans token', async () => {
        const response = await request(app)
            .get('/reservations/mes-reservations');

        expect(response.status).toBe(401);
    });

    // ─────────────────────────────────────────────
    // TEST 6 — Sécurité mauvais mdp
    // ─────────────────────────────────────────────
    test('6️⃣  doit refuser la connexion avec un mauvais mot de passe', async () => {
        const response = await request(app)
            .post('/auth/login/client')
            .send({
                email_client: testEmail,
                mdp_client:   'MAUVAIS_MDP'
            });

        expect(response.status).toBe(401);
    });

});