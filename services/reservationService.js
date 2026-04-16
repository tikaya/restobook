// Importons le module reservationModel pour interagir avec les methodes de la base de données
const reservationModel = require('../models/reservationModel');
const logService       = require('../services/logService');

// ── Validation horaires (memes regles que le frontend) ────
const validateHoraire = (dateStr, heureStr) => {
    if (!dateStr || !heureStr) return;

    const horaires = {
        0: { label: 'Dimanche : 12h-14h30',           services: [[720, 870]]  },
        1: { label: 'Ferme le lundi',                  services: []            },
        2: { label: 'Mar-Ven : 12h-14h · 19h-21h30', services: [[720, 840], [1140, 1290]] },
        3: { label: 'Mar-Ven : 12h-14h · 19h-21h30', services: [[720, 840], [1140, 1290]] },
        4: { label: 'Mar-Ven : 12h-14h · 19h-21h30', services: [[720, 840], [1140, 1290]] },
        5: { label: 'Mar-Ven : 12h-14h · 19h-21h30', services: [[720, 840], [1140, 1290]] },
        6: { label: 'Samedi : 12h-14h30 · 19h-22h',  services: [[720, 870], [1140, 1320]] }
    };

    const parts = dateStr.split('-');
    const jour  = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).getDay();

    if (jour === 1) {
        const error = new Error('Le restaurant est ferme le lundi.');
        error.status = 400;
        throw error;
    }

    const [h, m]   = heureStr.split(':').map(Number);
    const totalMin = h * 60 + m;
    const services = horaires[jour]?.services || [];
    const valide   = services.some(s => totalMin >= s[0] && totalMin <= s[1]);

    if (!valide) {
        const error = new Error(`Heure hors service. ${horaires[jour]?.label || ''}`);
        error.status = 400;
        throw error;
    }
};

// ── Service ───────────────────────────────────────────────
const reservationService = {

    // Voir toutes les reservations
    getAllReservations: async () => {
        const reservations = await reservationModel.findAll();
        return reservations;
    },

    // Obtenir une reservation specifique via son ID
    getReservationById: async (id) => {
        const reservation = await reservationModel.findById(id);
        if (!reservation) {
            const error = new Error('Reservation non trouvee');
            error.status = 404;
            throw error;
        }
        return reservation;
    },

    // Creer une nouvelle reservation
    createReservation: async (data) => {

        // Validation horaires cote backend — securite si appel direct API
        validateHoraire(data.date_reservation, data.heure_reservation);

        let table = null;

        // Chercher d'abord avec l'emplacement demande
        if (data.emplacement_table) {
            table = await reservationModel.findAvailableTable(
                data.date_reservation,
                data.heure_reservation,
                data.nb_personnes,
                data.emplacement_table
            );
        }

        // Fallback : emplacement demande mais indispo → chercher sans contrainte
        if (!table) {
            table = await reservationModel.findAvailableTable(
                data.date_reservation,
                data.heure_reservation,
                data.nb_personnes,
                null
            );
        }

        if (!table) {
            const error = new Error('Aucune table disponible pour ce creneau');
            error.status = 409;
            throw error;
        }

        data.id_table = table.id_table;

        const newReservation = await reservationModel.create(data);
        if (!newReservation) {
            const error = new Error('Erreur lors de la creation de la reservation');
            error.status = 500;
            throw error;
        }

        await logService.log('CREATION_RESERVATION', data.id_client, {
            id_table:    data.id_table,
            emplacement: table.emplacement_table,
            date:        data.date_reservation
        }, null);

        return newReservation;
    },

    // Mettre a jour une reservation existante
    updateReservation: async (id, data) => {

        // Valider horaires seulement si date ou heure sont modifiees
        if (data.date_reservation || data.heure_reservation) {
            validateHoraire(data.date_reservation, data.heure_reservation);
        }

        const updatedReservation = await reservationModel.update(id, data);
        if (!updatedReservation) {
            const error = new Error('Reservation non trouvee ou erreur lors de la mise a jour');
            error.status = 404;
            throw error;
        }

        await logService.log('MODIFICATION_RESERVATION', null, {
            id_reservation: id,
            statut:         data.statut_reservation
        }, null);

        return updatedReservation;
    },

    // Supprimer une reservation
    deleteReservation: async (id) => {
        const reservation = await reservationModel.delete(id);
        if (!reservation) {
            const error = new Error('Reservation non trouvee ou erreur lors de la suppression');
            error.status = 404;
            throw error;
        }

        await logService.log('ANNULATION_RESERVATION', null, { id_reservation: id }, null);
        return reservation;
    },

    // Reservations d'un client specifique
    getReservationsByClient: async (id_client) => {
        return await reservationModel.findByClient(id_client);
    }
};

module.exports = reservationService;
module.exports.validateHoraire = validateHoraire;