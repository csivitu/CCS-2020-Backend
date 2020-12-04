import mongoose from 'mongoose';
import responseSchema from 'models/response';
import domainObjSchema from 'models/domainObj';

const Participant = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		index: true,
		unique: true,
	},
	responses: {
		tech: [responseSchema],
		design: [responseSchema],
		management: [responseSchema],
		video: [responseSchema],
	},

	time: domainObjSchema,
});

export default Participant;
