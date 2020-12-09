import mongoose from 'mongoose';
import responseSchema from './response';
import domainObjSchema from './domainObj';
import { participant } from '../interfaces/interfaces';

const participantSchema = new mongoose.Schema({
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
const Participant = mongoose.model<participant>('Participant', participantSchema);
export default Participant;
