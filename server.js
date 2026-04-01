const express = require('express')

require('dotenv').config()
require('./mongoDb');

const app = express()
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

// Configuration EJS
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))

// 1. Maillons communs
app.use(express.json())

// 2. Page d'accueil

app.get('/', (req, res) => {
    res.render('index')
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

// 4. Gardien (toujours à la fin)
app.use((err, req, res, next) => {
    console.error('Erreur :', err.message)
    const status = err.status || 500
    res.status(status).json({ error: err.message })
})

// 5. Démarrer
app.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`)
})