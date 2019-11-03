const mongoose = require('mongoose');
const responseSchema = require('./response.schema').schema;
const timeObjSchema = require('./timeObj.schema');

const participantSchema = new mongoose.Schema({
    participantId: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    responses: [responseSchema],
    time: timeObjSchema,
});

module.exports = mongoose.model('Participant', participantSchema);
