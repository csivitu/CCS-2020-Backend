import mongoose from 'mongoose';
import timeObjSchema from './timeObj';

const domainObjSchema = new mongoose.Schema({

	tech: timeObjSchema,
	design: timeObjSchema,
	video: timeObjSchema,
	management: timeObjSchema,

});

export default domainObjSchema;
