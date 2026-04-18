const request = require('supertest');
const app     = require('../../server');
const pool    = require('../../db');

describe('🎯 TEST CRITIQUE — Parcours client complet', () => {

    // Email unique pour chaque run (timestamp)
    const timestamp  = Date.now();
    const testEmail  = `test_${timestamp}@restobook.test`;
    const testMdp    = 'Test123!';

    let token       = null;  // JWT obtenu après login
    let clientId    = null;  // ID du client créé
    let resaId      = null;  // ID de la réservation créée

    // ─────────────────────────────────────────────
    // Nettoyage — supprimer les données de test
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
        // Mardi à 13h — créneau valide selon validateHoraire
        const response = await request(app)
            .post('/reservations')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id_client:         clientId,
                date_reservation:  '2026-05-12',  // un mardi
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
    // TEST 5 — Sécurité : sans token, accès refusé
    // ─────────────────────────────────────────────
    test('5️⃣  doit refuser l\'accès à mes-reservations sans token', async () => {
        const response = await request(app)
            .get('/reservations/mes-reservations');

        expect(response.status).toBe(401);
    });

    // ─────────────────────────────────────────────
    // TEST 6 — Sécurité : mauvais mot de passe
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