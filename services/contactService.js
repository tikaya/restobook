const contactModel = require('../models/contactModel');

const contactService = {
    getAllMessages: async () => {
        return await contactModel.findAll();
    },

    getMessageById: async (id) => {
        const message = await contactModel.findById(id);
        if (!message) {
            const error = new Error('Message non trouvé');
            error.status = 404;
            throw error;
        }
        return message;
    },

    createMessage: async (data) => {
        const newMessage = await contactModel.create(data);
        if (!newMessage) {
            const error = new Error('Erreur lors de l\'envoi du message');
            error.status = 500;
            throw error;
        }
        return newMessage;
    },

    deleteMessage: async (id) => {
        const message = await contactModel.delete(id);
        if (!message) {
            const error = new Error('Message non trouvé');
            error.status = 404;
            throw error;
        }
        return { message: 'Message supprimé' };
    }
}

module.exports = contactService;