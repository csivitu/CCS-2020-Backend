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
    questionNo: {
        type: Number,
        required: true,
        index: true,
    },
});

module.exports = questionSchema;
