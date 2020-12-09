import express from 'express';
import {
	endRoute, domainRoute, startRoute, respondRoute,
} from '../controllers/controllers';

const router = express.Router();
// TODO: Why error here
router
	.route('/end')
	.post(endRoute);

router
	.route('/domains')
	.get(domainRoute);

router
	.route('/start')
	.post(startRoute);

router
	.route('/respond')
	.post(respondRoute);

export default router;
