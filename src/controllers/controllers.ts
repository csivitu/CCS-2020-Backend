import express from 'express';
import Participant from '../models/participant';
import { reqSchema, jsonResponseSchema } from '../interfaces/interfaces';
import constants from '../utils/constants';
import generateQuestionList from '../utils/generateQuestionList';
import getResponseQuestions from '../utils/getResponseQuestions';

const DOMAINS = ['tech', 'design', 'management', 'video'];

const endRoute = async (req: reqSchema, res: express.Response) => {
	const { domain } = req.body;
	if (!domain) {
		res.json({
			success: false,
			message: 'Invalid request',
		});
	}
	const participant = await Participant.findOne({
		username: req.participant.username,
	});

	if (!participant.time[domain].timeStarted) {
		res.json({
			success: false,
			message: 'Quiz not started',
		});
	} else if (new Date() >= participant.time[domain].timeEnded) {
		res.json({
			success: false,
			message: 'Quiz already attempted',
		});
	} else {
		participant.time[domain].timeEnded = new Date();
		await participant.save();
		res.json({
			success: true,
			message: 'Quiz ended',
			timestamp: Date.now(),
		});
	}
};

const domainRoute = async (req: reqSchema, res: express.Response) => {
	const participant = await Participant.findOne({
		username: req.participant.username,
	});

	if (!participant) {
		res.json({
			success: false,
			message: 'Data not found',
		});
	}
	const jsonResponse : jsonResponseSchema = {};
	for (let i = 0; i < 4; i += 1) {
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
};

const respondRoute = async (req: reqSchema, res: express.Response) => {
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
};

const startRoute = async (req: reqSchema, res: express.Response) => {
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
		timeObj.timeStarted = <Date><any>now;
		timeObj.timeEnded = <Date> <any>(now + constants.quizDuration * 60000);
		await participant.save();

		const responses = participant.responses[domain];
		res.json({
			success: true,
			responses: await getResponseQuestions(domain, responses),
			time: participant.time[domain],
			timestamp: Date.now(),
		});
	}
};

export {
	endRoute, domainRoute, respondRoute, startRoute,
};
