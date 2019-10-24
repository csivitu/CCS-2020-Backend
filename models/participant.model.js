const mongoose = require('mongoose');
const responseSchema = require('./response.schema').schema;

const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    regNo: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['M', 'F'],
        required: true,
    },
    responses: [responseSchema],
    time: {
        type: Object,
    },
    emailVerificationToken: {
        type: String,
        required: true,
    },
    verificationStatus: {
        type: String,
        required: true,
        default: false,
    },
    passwordResetToken: {
        type: String,
    },
});

module.exports = mongoose.model('Participant', participantSchema);
