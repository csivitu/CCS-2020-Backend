const mongoose = require('mongoose');

const timeObj = require('./timeObj');

const domainObjSchema = new mongoose.Schema({
    tech: timeObj,
    design: timeObj,
    management: timeObj,
    video: timeObj,
});

// each object will have timeStarted and timeEnded

module.exports = domainObjSchema;
