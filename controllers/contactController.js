const contactService = require('../services/contactService');

const contactController = {
    getAll: async (req, res, next) => {
        try {
            const messages = await contactService.getAllMessages();
            res.json(messages);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        const id = parseInt(req.params.id);
        try {
            const message = await contactService.getMessageById(id);
            res.json(message);
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const message = await contactService.createMessage(req.body);
            res.status(201).json(message);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        const id = parseInt(req.params.id);
        try {
            const result = await contactService.deleteMessage(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = contactController;