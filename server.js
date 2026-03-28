const express = require('express')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

const clientRoutes = require('./routes/client')
const employeRoutes = require('./routes/employe')
const tableRoutes = require('./routes/table')
const categorieRoutes = require('./routes/categories')
const horaireRoutes = require('./routes/horaire')
const platRoutes = require('./routes/plats')

// 1. Maillons communs
app.use(express.json())

// 2. Page d'accueil
app.get('/', (req, res) => {
    res.json({ message: "Bienvenue sur RestoBook!" })
})

// 3. Sous-pipelines
app.use('/clients', clientRoutes)
app.use('/employes',employeRoutes)
app.use('/tables', tableRoutes)
app.use('/categories', categorieRoutes)
app.use('/horaires', horaireRoutes)
app.use('/plats', platRoutes)


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