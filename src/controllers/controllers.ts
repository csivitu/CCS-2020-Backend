import express from 'express';
import Participant from '../models/participant';
import { reqSchema, jsonResponseSchema } from '../interfaces/interfaces';
import constants from '../tools/constants';

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

const respondRoute = async (req, res) => {
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

export default { endRoute, domainRoute, respondRoute };
