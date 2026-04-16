const { chromium } = require('playwright');

describe('E2E — Parcours reservation', () => {

    let browser;
    let page;

    // Avant tous les tests — ouvrir le navigateur
    beforeAll(async () => {
        browser = await chromium.launch({ headless: false }); // headless: false = on voit le navigateur
        page    = await browser.newPage();
    });

    // Apres tous les tests — fermer le navigateur
    afterAll(async () => {
        await browser.close();
    });

    test('doit afficher la page de reservation', async () => {
        await page.goto('http://localhost:3000/reservation');

        const titre = await page.textContent('h1');
        expect(titre).toContain('table');
    }, 15000); // 15 secondes max

    test('doit bloquer le lundi dans le formulaire', async () => {
        await page.goto('http://localhost:3000/reservation');

        // Remplir la date avec un lundi
        await page.fill('#input-date', '2026-04-13');
        await page.dispatchEvent('#input-date', 'change');

        // Verifier le message d'erreur
        const hint = await page.textContent('#hint-date');
        expect(hint).toContain('lundi');
    }, 15000);

});