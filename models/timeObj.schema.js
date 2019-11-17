const mongoose = require('mongoose');

const timeObjSchema = new mongoose.Schema({
    timeStarted: {
        type: Date,
        required: true
    },
    timeEnded: {
        type: Date,
        required: true
    }
});

// each object will have timeStarted and timeEnded

module.exports = timeObjSchema;
