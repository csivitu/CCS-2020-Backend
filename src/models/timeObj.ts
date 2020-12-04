import mongoose from 'mongoose';

const timeObjSchema = new mongoose.Schema({
	timeStarted: {
		type: Date,
	},
	timeEnd: {
		type: Date,
	},
});

export default timeObjSchema;
