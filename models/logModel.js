const mongoose = require('../mongoDb');

const logSchema = mongoose.Schema({
    horodatage:      { type: Date,   default: Date.now },
    type_action:     { type: String, required: true },
    id_utilisateur:  { type: Number, default: null },
    role_utilisateur:{ type: String, default: null },    // ← gerant/serveur/client
    details:         { type: Object, default: {} },
    ip:              { type: String, default: null },
    user_agent:      { type: String, default: null },    // ← navigateur utilisé
    methode_http:    { type: String, default: null },    // ← GET POST PUT DELETE
    url:             { type: String, default: null },    // ← route appelée
    statut:          { type: String, default: 'succes',  // ← succes/echec
                       enum: ['succes','echec','warning'] },
    duree_ms:        { type: Number, default: null }     // ← temps d'execution
});

module.exports = mongoose.model('log', logSchema);