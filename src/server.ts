/* eslint-disable import/no-unresolved */
import dotenv from 'dotenv';

dotenv.config();
const fastify = require('fastify')({
  logger: true,
});

fastify.register(require('./routes/routes'), { prefix: '/' });

const PORT = process.env.PORT || 3000;

fastify.listen(PORT, () => {
  fastify.log.info(`Server listening on ${PORT}`);
});
