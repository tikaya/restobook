const reservationService = require('../services/reservationService');
const logService         = require('../services/logService');

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
        const debut = Date.now();
        try {
            const reservation = await reservationService.createReservation(req.body);
            res.status(201).json(reservation);
        } catch (error) {
            await logService.log(
                'CREATION_RESERVATION',
                req.user?.id || null,
                { erreur: error.message, body: req.body },
                req.ip,
                { ...logService.fromReq(req), statut: 'echec', duree_ms: Date.now() - debut }
            );
            if (error.code === '23503') {
                return res.status(400).json({ error: 'ID client ou ID table invalide' });
            }
            next(error);
        }
    },

    update: async (req, res, next) => {
        const id    = parseInt(req.params.id);
        const debut = Date.now();
        try {
            const updatedReservation = await reservationService.updateReservation(id, req.body);

            // ✅ Log verbose de la modification
            await logService.log(
                'MODIFICATION_RESERVATION',
                req.user?.id || null,
                {
                    id_reservation:    id,
                    statut:            req.body.statut_reservation,
                    date_reservation:  req.body.date_reservation,
                    heure_reservation: req.body.heure_reservation,
                    modifie_par:       req.user?.role || 'inconnu',
                    horodatage:        new Date().toISOString()
                },
                req.ip,
                { ...logService.fromReq(req), statut: 'succes', duree_ms: Date.now() - debut }
            );

            res.json(updatedReservation);
        } catch (error) {
            await logService.log(
                'MODIFICATION_RESERVATION',
                req.user?.id || null,
                { erreur: error.message, id_reservation: id },
                req.ip,
                { ...logService.fromReq(req), statut: 'echec' }
            );
            if (error.code === '23503') {
                return res.status(400).json({ error: 'ID client ou ID table invalide' });
            }
            next(error);
        }
    },

    delete: async (req, res, next) => {
        const id    = parseInt(req.params.id);
        const debut = Date.now();
        try {
            const deletedReservation = await reservationService.deleteReservation(id);

            await logService.log(
                'ANNULATION_RESERVATION',
                req.user?.id || null,
                {
                    id_reservation: id,
                    annule_par:     req.user?.role || 'inconnu',
                    horodatage:     new Date().toISOString()
                },
                req.ip,
                { ...logService.fromReq(req), statut: 'succes', duree_ms: Date.now() - debut }
            );

            res.json(deletedReservation);
        } catch (error) {
            next(error);
        }
    },

    getMesReservations: async (req, res, next) => {
        try {
            const reservations = await reservationService.getReservationsByClient(req.user.id);
            res.json(reservations);
        } catch (error) {
            next(error);
        }
    }

};

module.exports = reservationController;