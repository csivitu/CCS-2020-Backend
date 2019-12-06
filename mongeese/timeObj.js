const mongoose = require('mongoose');

const timeObjSchema = new mongoose.Schema({
    timeStarted: {
        type: Date,
    },
    timeEnded: {
        type: Date,
    },
});

// each object will have timeStarted and timeEnded

module.exports = timeObjSchema;
