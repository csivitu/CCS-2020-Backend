const mongoose = require('mongoose');

const timeObjSchema = new mongoose.Schema({
    tech: Object,
    design: Object,
    management: Object,
    video: Object,
});

// each object will have timeStarted and timeEnded

module.exports = timeObjSchema;
