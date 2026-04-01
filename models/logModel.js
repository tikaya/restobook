// Importons la classe mongoose
const mongoose = require('../mongoDb');

// Créons le schema (onjet décrivant la structure d'un document)
const logSchema = mongoose.Schema({
    horodatage:{type:Date, default:Date.now},
    type_action: {type:String, required:true},
    id_utilisateur:{type:Number,default:null},
    details: { type: Object, default: {} },
    ip:{type:String,default:null}
});

module.exports = mongoose.model("log",logSchema);