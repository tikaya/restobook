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

module.exports = { 
    validateClient, 
    validateClientUpdate, 
    validateEmploye, 
    validateEmployeUpdate 
}