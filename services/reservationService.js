// Importons le module reservationModel pour interagir avec les methodes de la base de données
const reservationModel = require('../models/reservationModel');

// Créons un objet contenant un pléthore de méthode pour gérer les réservations
const reservationService = {
    // Voir tous les reservations 
    getAllReservations: async () => {
        const reservations = await reservationModel.findAll();
        return reservations;
    },

    // Obtenir une réservation spécifique via son ID
    getReservationById: async (id) => {
        const reservation = await reservationModel.findById(id);
        if(!reservation) {
            const error = new Error('Réservation non trouvée');
            error.status = 404;
            throw error;
        };
        return reservation;
    },

    // Créer une nouvelle réservation
    createReservation : async (data) => {
        const newReservation = await reservationModel.create(data);
        if(!newReservation) {
            const error = new Error('Erreur lors de la création de la réservation');
            error.status = 500;
            throw error;
        }
        return newReservation;
    },

    // Mettre à jour une réservation existante
    updateReservation: async (id, data) => {
        const updatedReservation = await reservationModel.update(id, data);
        if(!updatedReservation) {
            const error = new Error('Reservation non trouvée ou erreur lors de la mise à jour');
            error.status = 404;
            throw error;
        }
        return updatedReservation;
    },

    // Supprimer une réservation
    deleteReservation : async (id) => {
        const reservation = await reservationModel.delete(id);
        if(!reservation) {
            const error = new Error('Réservation non trouvée ou erreur lors de la suppression');
            error.status = 404;
            throw error;
        }
        return reservation;
    }
}

module.exports = reservationService;