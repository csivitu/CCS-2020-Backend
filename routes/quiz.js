const express = require('express');
const Participant = require('../models/participant.model');
const Response = require('../models/response.schema').model;
const constants = require('../tools/constants');

const router = express.Router();

const shuffle = (array) => {
    const newArray = array;
    let i = newArray.length - 1;
    let j; let temp;
    if (i === 0) return newArray;
    while (i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = temp;
        i -= 1;
    }
    return newArray;
};

const range = (start, end) => {
    const length = end - start;
    return Array.from({ length }, (_, i) => start + i);
};

const generateQuestionList = (lastRandomQ, totalQuestions) => shuffle(range(1, lastRandomQ))
    .concat(range(lastRandomQ, totalQuestions + 1));

router.post('/start', async (req, res) => {
    const participant = await Participant.findOne({
        email: req.session.email,
    });

    if (!participant) {
        res.json({
            success: false,
            message: constants.participantNotFound,
        });

        return;
    }

    const { domain } = req.body;

    const timeObj = participant.time[domain];

    if (timeObj.timeStarted) {
        res.json({
            success: false,
            message: constants.quizStartedAlready,
        });

        return;
    }

    const questionList = generateQuestionList(
        constants.lastRandomQuestion,
        constants.totalQuestions,
    );

    participant.responses = questionList.map((element) => ({
        questionId: element,
        response: null,
    }));

    timeObj.timeStarted = new Date().getTime();
    timeObj.timeEnded = timeObj.timeStarted + constants.quizDuration * 60000;

    await participant.save();

    res.json({
        success: true,
        message: questionList,
    });
});

router.post('/respond', async (req, res) => {
    const response = new Response();
    response.questionId = req.body.questionId;
    response.response = req.body.response;

    // TODO: 1. Find participant middleware through OAuth
    const participant = await Participant.findOne({
        email: req.session.email,
    });

    if (!participant) {
        res.json({
            success: false,
            message: constants.participantNotFound,
        });

        return;
    }

    const foundElement = participant.responses.find(
        (element) => element.questionId === response.questionId,
    );

    if (!foundElement) {
        res.json({
            success: false,
            message: constants.invalidQuestion,
        });
        return;
    }

    foundElement.response = response.response;

    await participant.save();

    res.json({
        success: true,
        message: constants.responseSaved,
    });
});

module.exports = router;
