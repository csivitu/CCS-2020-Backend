const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    questionId: {
        type: String,
        required: true,
    },
    response: {
        type: String,
        required: true,
    },
});

module.exports = {
    schema: responseSchema,
    model: mongoose.model('Response', responseSchema),
};
