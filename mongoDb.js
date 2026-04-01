// Importons le module mongoose
const mongoose = require('mongoose');

// Utilisons la methode connect de moongoose pour obtenir une nouvelle connection
mongoose.connect(process.env.MONGO_URL)
    .then(()=> console.log("MongoDB est connecté"))
    .catch(err => console.error("Erreur mongoBD:",err.message));

module.exports = mongoose
