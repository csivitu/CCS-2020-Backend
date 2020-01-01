const { Participant } = require('../mongeese/models');
const constants = require('../tools/constants');

const validateParticipant = async (req, res, next) => {
    res.locals.participant = req.participant;

    const participant = await Participant.findOne({
        participantId: res.locals.participant.participantId,
    });

    if (!participant) {
        res.json({
            success: false,
            message: constants.participantNotFound,
        });

        return;
    }

    next();
};

module.exports = validateParticipant;
