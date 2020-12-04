import Participant from '../models/participant';


const DOMAINS = ['tech', 'design', 'management', 'video'];

const endRoute = async (req: any, res: any) => {
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

const domainRoute = async (req: any, res: any) => {
	const participant = await Participant.findOne({
		username: req.participant.username,
	});

	if (!participant) {
		res.json({
			success: false,
			message: 'Data not found',
		});
	}
	const jsonResponse = {};
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
	}
};

export default {endRoute, domainRoute};
