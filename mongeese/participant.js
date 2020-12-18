const mongoose = require('mongoose');
const responseSchema = require('./response').schema;
const domainObjSchema = require('./domainObj');

const participantSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    responses: {
        tech: [responseSchema],
        design: [responseSchema],
        management: [responseSchema],
        video: [responseSchema],
    },
    time: domainObjSchema,
});

module.exports = participantSchema;
