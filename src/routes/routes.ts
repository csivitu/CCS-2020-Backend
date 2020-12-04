import express from 'express';
import controllers from '../controllers/controllers';

const router = express.Router();

router
	.route('/')
	.get(controllers.domainRoute)
	.post(controllers.endRoute);

module.exports = router;
