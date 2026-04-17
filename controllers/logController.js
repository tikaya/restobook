// Exemple dans reservationController.js
const logService = require('../services/logService');

create: async (req, res, next) => {
    const debut = Date.now();
    try {
        const data = req.body;
        const reservation = await reservationService.createReservation(data);

        // ✅ Log verbose
        await logService.log(
            'CREATION_RESERVATION',
            req.user?.id || null,
            {
                id_reservation:   reservation.id_reservation,
                date:             data.date_reservation,
                heure:            data.heure_reservation,
                nb_personnes:     data.nb_personnes,
                emplacement:      reservation.emplacement_table,
                id_table:         reservation.id_table
            },
            req.ip,
            {
                ...logService.fromReq(req),
                statut:   'succes',
                duree_ms: Date.now() - debut
            }
        );

        res.status(201).json(reservation);
    } catch (error) {
        // ✅ Log echec aussi !
        await logService.log(
            'CREATION_RESERVATION',
            req.user?.id || null,
            { erreur: error.message, body: req.body },
            req.ip,
            { ...logService.fromReq(req), statut: 'echec' }
        );
        next(error);
    }
}