const mongoose = require('mongoose');
const constants = require('../tools/constants');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
        required: true,
        enum: constants.domains,
    },
    questionId: {
        type: String,
        required: true,
        index: true,
    },
});

module.exports = mongoose.model('Question', questionSchema);
