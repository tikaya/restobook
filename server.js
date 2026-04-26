const express = require('express')

require('dotenv').config()
require('./mongoDb');

const app = express()
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 3000

const clientRoutes = require('./routes/client')
const employeRoutes = require('./routes/employe')
const tableRoutes = require('./routes/table')
const categorieRoutes = require('./routes/categories')
const horaireRoutes = require('./routes/horaire')
const platRoutes = require('./routes/plats')
const reservationRoutes = require('./routes/reservations')
const avisRoutes = require('./routes/avis')
const contactRoutes = require('./routes/contact')
const authRoutes = require('./routes/auth')
const logRoutes = require('./routes/log')
const pageController = require('./controllers/pageController');
const  {verifyPageToken,requirePageRole} = require('./middlewares/authPage');
const { verifyToken, requireRole } = require('./middlewares/auth');

// Configuration EJS
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))

// 1. Maillons communs
app.use(express.json())
app.use(cookieParser())

// 2. Page d'accueil 
app.get('/', pageController.accueil)
app.get('/carte', pageController.carte)
app.get('/reservation', pageController.reservation)
app.get('/avis', pageController.avis)
app.get('/contact', pageController.contact)
app.get('/mentions-legales', pageController.mentionslegales)

// 2.1 Page de connection 
app.get('/login',pageController.connection)

// 2.2 Page d'inscription 
app.get('/inscription',pageController.inscription)

// Formulaire de changement de mot de passe oublié
app.get('/forgot-password',pageController.forgotPassword)

// Formulaire de changement de mot de passe après première connexion
app.get('/change-password',pageController.changePassword)

// Espaces protégés
app.get('/espace-client', verifyPageToken, requirePageRole('client'), pageController.espaceClient)
app.get('/espace-serveur', verifyPageToken, requirePageRole('serveur', 'gerant'), pageController.espaceServeur)
app.get('/espace-admin', verifyPageToken, requirePageRole('gerant'), pageController.espaceAdmin)


// Page admin CRUD
app.get('/espace-admin/reservations', verifyPageToken, requirePageRole('gerant'), pageController.adminReservations)
app.get('/espace-admin/tables',verifyPageToken,requirePageRole('gerant'),pageController.adminTables)
app.get('/espace-admin/menu',verifyPageToken,requirePageRole('gerant'),pageController.adminMenu)
app.get('/espace-admin/avis',verifyPageToken,requirePageRole('gerant'),pageController.adminAvis)
app.get('/espace-admin/comptes',verifyPageToken,requirePageRole('gerant'),pageController.adminComptes)
app.get('/espace-admin/logs',verifyPageToken,requirePageRole('gerant'),pageController.adminLogs)


// Page serveur CRUD
app.get('/espace-serveur/reservations',verifyPageToken,requirePageRole('serveur'),pageController.serveurReservations);
app.get('/espace-serveur/avis',verifyPageToken,requirePageRole('serveur'),pageController.serveurAvis);
app.get('/espace-serveur/menu',verifyPageToken,requirePageRole('serveur'),pageController.serveurMenu)


app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('user');
    res.redirect('/');
})

// 3. Sous-pipelines
app.use('/auth', authRoutes)
app.use('/clients', clientRoutes)
app.use('/employes',employeRoutes)
app.use('/tables', tableRoutes)
app.use('/categories', categorieRoutes)
app.use('/horaires', horaireRoutes)
app.use('/plats', platRoutes)
app.use('/reservations', reservationRoutes)
app.use('/avis', avisRoutes)
app.use('/contact', contactRoutes)
app.use('/logs',logRoutes)

// Politique de confidentialité
app.get('/politique-confidentialite', (req, res) => {
    res.render('politique-confidentialite');
});
// 4. Gardien (toujours à la fin)
app.use((err, req, res, next) => {
    console.error('Erreur complète :', err.message, err.stack, err)
    const status = err.status || 500
    res.status(status).json({ error: err.message })
})

// 5. Démarrer
if (require.main === module) {
    app.listen(PORT, () => {
        console.log('\n');
        console.log('  ╔════════════════════════════════════════════╗');
        console.log('  ║        🍽️  RestoBook Manager               ║');
        console.log('  ╠════════════════════════════════════════════╣');
        console.log(`  ║  🚀 Serveur    → http://localhost:${PORT}      ║`);
        console.log(`  ║  🗄️  Base       → PostgreSQL                ║`);
        console.log(`  ║  📦 MongoDB    → Logs actifs                ║`);
        console.log(`  ║  🌍 Env        → ${process.env.NODE_ENV || 'development'}                 ║`);
        console.log('  ╠════════════════════════════════════════════╣');
        console.log('  ║  📌 Espaces disponibles :                   ║');
        console.log(`  ║     /espace-client   → Client               ║`);
        console.log(`  ║     /espace-serveur  → Serveur              ║`);
        console.log(`  ║     /espace-admin    → Gerant               ║`);
        console.log('  ╚════════════════════════════════════════════╝');
        console.log('\n');
    });
}

module.exports = app