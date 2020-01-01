const { Participant } = require('../mongeese/models');
const constants = require('../tools/constants');

const checkFirstAttempt = async (req, res, next) => {
    // TODO: JWT Authentication
    const participant = await Participant.findOne({ username: req.participant.username });
    const { domain } = req.body;

    if (participant.time[domain]) {
        if (participant.time[domain].timeStarted) {
            res.json({
                success: false,
                message: constants.quizStartedAlready,
            });
        } else {
            next();
        }
    } else {
        next();
    }
};

module.exports = checkFirstAttempt;
