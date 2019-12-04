const express = require('express');
const Participant = require('../models/participant.model');
const Question = require('../models/question.model');
const Response = require('../models/response.schema').model;
const constants = require('../tools/constants');
const authorize = require('../middlewares/authorize');
// const checkFirstAttempt = require('../middlewares/checkFirstAttempt');

const router = express.Router();

router.use(authorize);
// router.use(checkFirstAttempt);

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

const getResponseQuestions = async (r) => {
    // Retrieve questions by question No
    const questionNos = r.map((q) => q.questionNo);
    const questions = await Question.find(
        {
            questionNo: {
                $in: questionNos,
            },
        },
        {
            question: 1,
        },
    ).exec();

    questions.sort((a, b) => questionNos.indexOf(a) - questionNos.indexOf(b));

    // Add question to each corresponding response obj
    const responses = r;
    for (let i = 0; i < r.length; i += 1) {
        responses[i].question = questions[i].question;
    }
    return responses;
};

const generateQuestionList = (lastRandomQ, totalQuestions) => shuffle(range(1, lastRandomQ))
    .concat(range(lastRandomQ, totalQuestions + 1));

router.post('/start', async (req, res) => {
    let participant = await Participant.findOne({
        username: req.participant.username,
    });

    if (!participant) {
        participant = new Participant({
            username: req.participant.username,
            responses: {
                tech: [],
                design: [],
                management: [],
                video: [],
            },
            time: {
                tech: {
                    timeStarted: null,
                    timeEnded: null,
                },
                design: {
                    timeStarted: null,
                    timeEnded: null,
                },
                management: {
                    timeStarted: null,
                    timeEnded: null,
                },
                video: {
                    timeStarted: null,
                    timeEnded: null,
                },
            },
            adminData: {},
        });
    }

    const { domain } = req.body;

    if (!domain) {
        res.json({
            success: false,
            message: constants.invalidRequest,
        });
        return;
    }
    if (participant.time[domain].timeStarted !== null) {
        if (new Date().getTime >= participant.time[domain].timeEnded) {
            // Domain already attempted and time over
            res.json({
                success: false,
                message: constants.quizAlreadyAttempted,
            });
        } else {
            // Domain already started and in progress currently
            const responses = participant.responses[domain];
            res.json({
                success: true,
                responses: await getResponseQuestions(responses),
                time: participant.time[domain],
            });
        }
    } else {
        // Domain not attempted, generate question list
        const questionList = generateQuestionList(
            constants.lastRandomQuestion,
            constants.totalQuestions,
        );

        participant.responses[domain] = questionList.map((element) => ({
            questionNo: element,
            response: null,
        }));

        participant.time[domain] = {
            timeStarted: null,
            timeEnded: null,
        };

        const timeObj = participant.time[domain];

        timeObj.timeStarted = new Date().getTime();
        timeObj.timeEnded = timeObj.timeStarted + constants.quizDuration * 60000;

        await participant.save();

        const responses = participant.responses[domain];
        res.json({
            success: true,
            responses: await getResponseQuestions(responses),
            time: participant.time[domain],
        });
    }
});

router.post('/respond', async (req, res) => {
    const response = new Response();
    response.questionNo = req.body.questionNo;
    response.response = req.body.response;

    const participant = await Participant.findOne({
        username: req.participant.username, // TODO: figure out how to use middlware
    });

    if (!participant) {
        res.json({
            success: false,
            message: constants.participantNotFound,
        });

        return;
    }

    const { domain } = req.body;

    if (new Date().getTime >= participant.time[domain].timeEnded) {
        res.json({
            success: false,
            message: constants.quizTimeOver,
        });

        return;
    }

    const foundElement = participant.responses.find(
        (element) => element.questionNo === response.questionno,
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
