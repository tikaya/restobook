const express = require('express');
const app = express();
//Ajoutons le middleware pour parser le corps des requêtes en JSON
app.use(express.json());

//Définisons la terminaison pour la route GET et le chemin / et ajoutons le au pipeline
app.get('/',(req,res)=> {
    res.json({message: "Bienvenue sur RestoBook!"});
});

//Démarrons le serveur sur le port 3000
app.listen(3000,()=>{
    console.log('Le serveur est en cours d\'exécution sur le port 3000');
});



