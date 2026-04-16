const { validateHoraire } = require('../../services/reservationService');

describe('validateHoraire', () => {

    // ── Lundi fermé ──────────────────────────────────────
    test('doit rejeter le lundi', () => {
        expect(() => validateHoraire('2026-04-13', '12:00'))
            .toThrow('Le restaurant est ferme le lundi.');
    });

    // ── Heures hors service ───────────────────────────────
    test('doit rejeter une heure hors service un mardi', () => {
        expect(() => validateHoraire('2026-04-14', '16:00'))
            .toThrow('Heure hors service.');
    });

    test('doit rejeter une heure trop tardive un mardi soir', () => {
        expect(() => validateHoraire('2026-04-14', '22:00'))
            .toThrow('Heure hors service.');
    });

    // ── Créneaux valides ──────────────────────────────────
    test('doit accepter mardi midi', () => {
        expect(() => validateHoraire('2026-04-14', '12:30'))
            .not.toThrow();
    });

    test('doit accepter mardi soir', () => {
        expect(() => validateHoraire('2026-04-14', '19:30'))
            .not.toThrow();
    });

    test('doit accepter samedi midi', () => {
        expect(() => validateHoraire('2026-04-18', '13:00'))
            .not.toThrow();
    });

    test('doit accepter dimanche midi', () => {
        expect(() => validateHoraire('2026-04-19', '12:30'))
            .not.toThrow();
    });

    // ── Valeurs manquantes ────────────────────────────────
    test('doit ignorer si date manquante', () => {
        expect(() => validateHoraire(null, '12:00'))
            .not.toThrow();
    });

    test('doit ignorer si heure manquante', () => {
        expect(() => validateHoraire('2026-04-14', null))
            .not.toThrow();
    });

});