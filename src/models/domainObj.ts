import mongoose from 'mongoose';
import timeObjSchema from 'models/timeObj';

const domainObjSchema = new mongoose.Schema({

	tech: timeObjSchema,
	design: timeObjSchema,
	video: timeObjSchema,
	management: timeObjSchema,

});

export default domainObjSchema;
