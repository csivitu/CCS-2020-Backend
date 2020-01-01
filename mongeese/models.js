const participantSchema = require('./participant');
const questionSchema = require('./question');
const ccsDB = require('./db');

const Participant = ccsDB.model('Participant', participantSchema);
const Question = ccsDB.model('Question', questionSchema);

module.exports = {
    Participant,
    Question,
};
