import mongoose from 'mongoose';

const fastify = require('fastify')({
	logger: true,
});

if (!process.env.DB_URL) {
	fastify.log.info({
		Message: 'DB connection failed',
		error: 'Error: DB_URL is not defined, did you create a .env file? Check sample.env for reference',
	});
	process.exit(1);
}

mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => fastify.log.info({ Message: 'DB connected successfully', error: 'Value: null' }))
	.catch((e) => {
		fastify.log.info({ Message: 'DB connection failed', error: e.toString() });
		process.exit(1);
	});
