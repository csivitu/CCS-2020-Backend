const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    questionNo: {
        type: Number,
    },
    response: {
        type: String,
    },
});

module.exports = {
    schema: responseSchema,
    model: mongoose.model('Response', responseSchema),
};
