import express from 'express';
import controllers from 'controllers/controllers';

const router = express.Router();
// TODO: Why error here
router
	.route('/end')
	.post(controllers.endRoute);

router
	.route('/domains')
	.get(controllers.domainRoute);

router
	.route('/start')
	.post(controllers.startRoute);

router
	.route('/respond')
	.post(controllers.respondRoute);

export default router;
