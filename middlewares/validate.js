/**
 * Middlewares de validation
 * 
 * Chaque fonction vérifie les données de req.body
 * AVANT qu'elles arrivent au controller.
 * 
 * Si invalide → court-circuit (res.status(400))
 * Si valide   → next() (la chaîne continue)
 */

// ============================================
// VALIDATION CLIENT
// ============================================

const validateClient = (req, res, next) => {
    const { email_client, mdp_client, nom_client, prenom_client } = req.body
    const errors = []

    if (!email_client || !email_client.trim()) {
        errors.push("L'email est requis")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_client)) {
        errors.push("L'email n'est pas valide")
    }

    if (!mdp_client) {
        errors.push("Le mot de passe est requis")
    } else {
        if (mdp_client.length < 8) errors.push("Le mot de passe doit faire au moins 8 caractères")
        if (!/[A-Z]/.test(mdp_client)) errors.push("Le mot de passe doit contenir une majuscule")
        if (!/[a-z]/.test(mdp_client)) errors.push("Le mot de passe doit contenir une minuscule")
        if (!/[0-9]/.test(mdp_client)) errors.push("Le mot de passe doit contenir un chiffre")
        if (!/[^A-Za-z0-9]/.test(mdp_client)) errors.push("Le mot de passe doit contenir un caractère spécial")
    }

    if (!nom_client || !nom_client.trim()) {
        errors.push("Le nom est requis")
    }

    if (!prenom_client || !prenom_client.trim()) {
        errors.push("Le prénom est requis")
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

const validateClientUpdate = (req, res, next) => {
    const { nom_client, prenom_client } = req.body
    const errors = []

    if (!nom_client || !nom_client.trim()) {
        errors.push("Le nom est requis")
    }

    if (!prenom_client || !prenom_client.trim()) {
        errors.push("Le prénom est requis")
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

// ============================================
// VALIDATION EMPLOYE
// ============================================

const validateEmploye = (req, res, next) => {
    const { email_employe, mdp_employe, nom_employe, prenom_employe, role_employe } = req.body
    const errors = []

    if (!email_employe || !email_employe.trim()) {
        errors.push("L'email est requis")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_employe)) {
        errors.push("L'email n'est pas valide")
    }

    if (!mdp_employe) {
        errors.push("Le mot de passe est requis")
    } else {
        if (mdp_employe.length < 8) errors.push("Le mot de passe doit faire au moins 8 caractères")
        if (!/[A-Z]/.test(mdp_employe)) errors.push("Le mot de passe doit contenir une majuscule")
        if (!/[a-z]/.test(mdp_employe)) errors.push("Le mot de passe doit contenir une minuscule")
        if (!/[0-9]/.test(mdp_employe)) errors.push("Le mot de passe doit contenir un chiffre")
        if (!/[^A-Za-z0-9]/.test(mdp_employe)) errors.push("Le mot de passe doit contenir un caractère spécial")
    }

    if (!nom_employe || !nom_employe.trim()) {
        errors.push("Le nom est requis")
    }

    if (!prenom_employe || !prenom_employe.trim()) {
        errors.push("Le prénom est requis")
    }

    if (!role_employe || !['gerant', 'serveur', 'cuisine'].includes(role_employe)) {
        errors.push("Le rôle doit être 'gerant', 'serveur' ou 'cuisine'")
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

const validateEmployeUpdate = (req, res, next) => {
    const { nom_employe, prenom_employe, role_employe } = req.body
    const errors = []

    if (!nom_employe || !nom_employe.trim()) {
        errors.push("Le nom est requis")
    }

    if (!prenom_employe || !prenom_employe.trim()) {
        errors.push("Le prénom est requis")
    }

    if (!role_employe || !['gerant', 'serveur', 'cuisine'].includes(role_employe)) {
        errors.push("Le rôle doit être 'gerant', 'serveur' ou 'cuisine'")
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

// ============================================
// VALIDATION TABLE RESTO
// ============================================

const validateTable = (req, res, next) => {
    const { numero_table, capacite_table, emplacement_table } = req.body
    const errors = []

    if (!numero_table && numero_table !== 0) {
        errors.push("Le numéro de table est requis")
    } else if (!Number.isInteger(numero_table) || numero_table <= 0) {
        errors.push("Le numéro de table doit être un entier positif")
    }

    if (!capacite_table && capacite_table !== 0) {
        errors.push("La capacité est requise")
    } else if (!Number.isInteger(capacite_table) || capacite_table <= 0) {
        errors.push("La capacité doit être un entier positif")
    }

    if (!emplacement_table || !['interieur', 'terrasse', 'salon_prive'].includes(emplacement_table)) {
        errors.push("L'emplacement doit être 'interieur', 'terrasse' ou 'salon_prive'")
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

const validateTableUpdate = (req, res, next) => {
    const { numero_table, capacite_table, emplacement_table } = req.body
    const errors = []

    if (!numero_table && numero_table !== 0) {
        errors.push("Le numéro de table est requis")
    } else if (!Number.isInteger(numero_table) || numero_table <= 0) {
        errors.push("Le numéro de table doit être un entier positif")
    }

    if (!capacite_table && capacite_table !== 0) {
        errors.push("La capacité est requise")
    } else if (!Number.isInteger(capacite_table) || capacite_table <= 0) {
        errors.push("La capacité doit être un entier positif")
    }

    if (!emplacement_table || !['interieur', 'terrasse', 'salon_prive'].includes(emplacement_table)) {
        errors.push("L'emplacement doit être 'interieur', 'terrasse' ou 'salon_prive'")
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

// ============================================
// VALIDATION CATEGORIE
// ============================================

const validateCategorie = (req, res, next) => {
    const { nom_categorie } = req.body
    const errors = []

    if (!nom_categorie || !nom_categorie.trim()) {
        errors.push("Le nom de la catégorie est requis")
    }

    // ordre_affichage_categorie est optionnel (DEFAULT 0 en BDD)
    // mais s'il est fourni, il doit être un entier >= 0
    if (req.body.ordre_affichage_categorie !== undefined) {
        if (!Number.isInteger(req.body.ordre_affichage_categorie) || req.body.ordre_affichage_categorie < 0) {
            errors.push("L'ordre d'affichage doit être un entier positif ou zéro")
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

const validateCategorieUpdate = (req, res, next) => {
    const { nom_categorie } = req.body
    const errors = []

    if (!nom_categorie || !nom_categorie.trim()) {
        errors.push("Le nom de la catégorie est requis")
    }

    if (req.body.ordre_affichage_categorie !== undefined) {
        if (!Number.isInteger(req.body.ordre_affichage_categorie) || req.body.ordre_affichage_categorie < 0) {
            errors.push("L'ordre d'affichage doit être un entier positif ou zéro")
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

// ============================================
// VALIDATION HORAIRE
// ============================================

const validateHoraireUpdate = (req, res, next) => {
    const { heure_ouverture, heure_fermeture, est_ferme } = req.body
    const errors = []

    if (est_ferme === undefined || typeof est_ferme !== 'boolean') {
        errors.push("est_ferme est requis et doit être true ou false")
    }

    if (est_ferme === false) {
        if (!heure_ouverture) {
            errors.push("L'heure d'ouverture est requise quand le restaurant est ouvert")
        }
        if (!heure_fermeture) {
            errors.push("L'heure de fermeture est requise quand le restaurant est ouvert")
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

// ============================================
// VALIDATION PLAT
// ============================================

const validatePlat = (req, res, next) => {
    const { nom_item_menu, prix_item_menu, id_categorie } = req.body
    const errors = []

    if (!nom_item_menu || !nom_item_menu.trim()) {
        errors.push("Le nom du plat est requis")
    }

    if (prix_item_menu === undefined || prix_item_menu === null) {
        errors.push("Le prix est requis")
    } else if (typeof prix_item_menu !== 'number' || prix_item_menu <= 0) {
        errors.push("Le prix doit être un nombre positif")
    }

    if (!id_categorie || !Number.isInteger(id_categorie)) {
        errors.push("La catégorie est requise")
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

const validatePlatUpdate = (req, res, next) => {
    const { nom_item_menu, prix_item_menu } = req.body
    const errors = []

    if (!nom_item_menu || !nom_item_menu.trim()) {
        errors.push("Le nom du plat est requis")
    }

    if (prix_item_menu === undefined || prix_item_menu === null) {
        errors.push("Le prix est requis")
    } else if (typeof prix_item_menu !== 'number' || prix_item_menu <= 0) {
        errors.push("Le prix doit être un nombre positif")
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

module.exports = { 
    validateClient, 
    validateClientUpdate, 
    validateEmploye, 
    validateEmployeUpdate,
    validateTable,
    validateTableUpdate,
    validateCategorie,
    validateCategorieUpdate,
    validateHoraireUpdate,
    validatePlat,
    validatePlatUpdate
}