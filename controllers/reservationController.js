const reservationService = require('../services/reservationService');

const reservationController = {
    getAll: async (req, res, next) => {
        try {
            const reservations = await reservationService.getAllReservations();
            res.json(reservations);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        const id = parseInt(req.params.id);
        try {
            const reservation = await reservationService.getReservationById(id);
            res.json(reservation);
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const reservation = await reservationService.createReservation(req.body);
            res.status(201).json(reservation);
        } catch (error) {
            if (error.code === '23503') {
                return res.status(400).json({ error: 'ID client ou ID table invalide' });
            }
            next(error);
        }
    },

    update: async (req, res, next) => {
        const id = parseInt(req.params.id);
        try {
            const updatedReservation = await reservationService.updateReservation(id, req.body);
            res.json(updatedReservation);
        } catch (error) {
            if (error.code === '23503') {
                return res.status(400).json({ error: 'ID client ou ID table invalide' });
            }
            next(error);
        }
    },

    delete: async (req, res, next) => {
        const id = parseInt(req.params.id);
        try {
            const deletedReservation = await reservationService.deleteReservation(id);
            res.json(deletedReservation);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = reservationController;