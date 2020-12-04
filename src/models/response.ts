import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
	questionNo: {
		type: Number,
	},

	response: {
		type: String,
	},
});

export default responseSchema;
