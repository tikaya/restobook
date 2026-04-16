const request = require('supertest');
const app     = require('../../server');

describe('POST /reservations', () => {

    // ── Sans token ────────────────────────────────────────
    test('doit retourner 401 sans token', async () => {
        const response = await request(app)
            .post('/reservations')
            .send({
                date_reservation:  '2026-04-14',
                heure_reservation: '12:30',
                nb_personnes:      2
            });

        expect(response.status).toBe(401);
    });

    // Sans token → 401 — c'est le bon comportement !
test('doit retourner 401 sans token', async () => {
    const response = await request(app)
        .post('/reservations')
        .send({ date_reservation: '2026-04-13' });

    expect(response.status).toBe(401); // ✅ correct
});

});