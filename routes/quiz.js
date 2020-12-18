const express = require('express');
const { Participant, Question } = require('../mongeese/models');
const constants = require('../tools/constants');
const authorize = require('../middlewares/authorize');
// const checkFirstAttempt = require('../middlewares/checkFirstAttempt');

const DOMAINS = ['tech', 'design', 'management', 'video'];

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

const getResponseQuestions = async (d, r) => {
    // Retrieve questions by question No
    console.log(r);
    const questionNos = r.map((q) => q.questionNo);
    const questions = await Question.find(
        {
            questionNo: {
                $in: questionNos,
            },
            domain: d,
        },
        {
            question: 1,
            questionNo: 1,
        },
    ).exec();

    questions.sort((a, b) => questionNos.indexOf(a.questionNo) - questionNos.indexOf(b.questionNo));
    // Add question to each corresponding response obj
    const responses = r.toObject();
    console.log(responses);
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
        });
    }

    const { domain } = req.body;

    if (!domain || DOMAINS.indexOf(domain) === -1) {
        res.json({
            success: false,
            message: constants.invalidRequest,
        });
        return;
    }
    if (participant.time[domain].timeStarted !== null) {
        if (new Date() >= participant.time[domain].timeEnded) {
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
                responses: await getResponseQuestions(domain, responses),
                time: participant.time[domain],
            });
        }
    } else {
        // Domain not attempted, generate question list
        for (let i = 0; i < DOMAINS.length; i += 1) {
            const d = DOMAINS[i];
            if (d !== domain) {
                if (new Date() < participant.time[d].timeEnded) {
                    res.json({
                        success: false,
                        domain: d,
                        message: constants.anotherDomainInProgress,
                    });
                    return;
                }
            }
        }
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

        const now = Date.now();
        timeObj.timeStarted = now;
        timeObj.timeEnded = now + constants.quizDuration * 60000;
        await participant.save();

        const responses = participant.responses[domain];
        res.json({
            success: true,
            responses: await getResponseQuestions(domain, responses),
            time: participant.time[domain],
            timestamp: Date.now(),
        });
    }
});

router.get('/domains', async (req, res) => {
    const participant = await Participant.findOne({
        username: req.participant.username,
    });

    if (!participant) {
        res.json({
            success: false,
            message: 'serverError',
        });
        return;
    }
    const jsonResponse = {};
    for (let i = 0; i < DOMAINS.length; i += 1) {
        const domain = DOMAINS[i];
        const { timeEnded } = participant.time[domain];

        if (!timeEnded) {
            jsonResponse[domain] = 'notAttempted';
        } else if (new Date() > timeEnded) {
            jsonResponse[domain] = 'ended';
        } else {
            jsonResponse[domain] = 'progress';
        }
    }

    jsonResponse.success = true;
    res.json(jsonResponse);
});

router.post('/respond', async (req, res) => {
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

    const { domain, responses } = req.body;

    if (!domain || DOMAINS.indexOf(domain) === -1) {
        res.json({
            success: false,
            message: constants.invalidRequest,
        });
        return;
    }

    if (!participant.time[domain].timeStarted) {
        res.json({
            success: false,
            message: constants.quizNotStarted,
        });
        return;
    }

    if (responses.length !== constants.totalQuestions) {
        res.json({
            success: false,
            message: constants.invalidRequest,
        });
        return;
    }

    for (let i = 0; i < constants.totalQuestions; i += 1) {
        if (responses[i].questionNo !== participant.responses[domain][i].questionNo) {
            res.json({
                success: false,
                message: constants.invalidRequest,
            });
            return;
        }
    }

    participant.responses[domain] = responses;
    participant.markModified('responses');

    const now = new Date();
    if (now >= participant.time[domain].timeEnded) {
        if (now.getTime() < participant.time[domain].timeEnded.getTime() + 60000) {
            // Buffer period of 1 minute for saving response
            await participant.save();
            res.json({
                success: true,
                message: constants.quizAlreadyAttempted,
                timestamp: Date.now(),
            });
        } else {
            res.json({
                success: false,
                message: constants.quizAlreadyAttempted,
            });
        }
    } else {
        await participant.save();
        res.json({
            success: true,
            message: constants.responseSaved,
            timestamp: Date.now(),
        });
    }
});

router.post('/end', async (req, res) => {
    const { domain } = req.body;

    if (!domain || DOMAINS.indexOf(domain) === -1) {
        res.json({
            success: false,
            message: constants.invalidRequest,
        });
        return;
    }

    const participant = await Participant.findOne({ username: req.participant.username });
    if (!participant.time[domain].timeStarted) {
        res.json({
            success: false,
            message: constants.quizNotStarted,
        });
    } else if (new Date() >= participant.time[domain].timeEnded) {
        res.json({
            success: false,
            message: constants.quizAlreadyAttempted,
        });
    } else {
        participant.time[domain].timeEnded = new Date();
        await participant.save();
        res.json({
            success: true,
            message: constants.quizEnded,
            timestamp: Date.now(),
        });
    }
});

module.exports = router;
