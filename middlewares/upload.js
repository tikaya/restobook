const multer = require('multer')

const path = require('path')

// La methode diskStorage à la reception d'un objetConfig ----> un StorageEngine c.a.d objet interne à multer 
// Implémentant deux methodes obligation de gestion reception et suppression

const storage = multer.diskStorage({
    // La methode destination qui renvoi un void a un effet de bord majeur
    // spécifier à multer l'endroit précis ou seront stockés les fichiers uploader
    // cela est possiblre via cb
    destination: (req, file, cb) => cb(null, 'public/uploads/plats/'),
    // Interceptons le file à uploader, extrayons sont extention,créons un nom mécanique et unique
    // et imposons ce dans sur le disque 
    filename: (req,file,cb) => {
        // Extrayons l'extention du fichier original pour le sécuriser
        const ext = path.extname(file.originalname);

        // Créons un nom de fichier mécanique et unique 
        const name = "plat-" + Date.now() + ext;

        // Transmettons ce nom mécanisé à multer dans le disque 
        cb(null,name);

    }
})

const upload = multer ({
    // Ou et comment stocker les données uploader
    storage,
    // taille limit acceptable 
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg','image/png','image/webp'];
        allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Format non supporte'));
    }

})

// Rendons le middleware disponible dans tous les modules
module.exports = upload