const mongoose = require('mongoose');
const responseSchema = require('./response.schema').schema;

const participantSchema = new mongoose.Schema({
    participantId: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    responses: [responseSchema],
    time: {
        type: Object,
    },
});

module.exports = mongoose.model('Participant', participantSchema);
