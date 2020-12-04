import './utils/env.ts';

import './models/db.ts';

const fastify = require('fastify')({
	logger: true,
});
fastify.register(require('./routes/routes.ts'), { prefix: '/' });

const PORT = process.env.PORT || 3000;

fastify.listen(PORT, () => {
	fastify.log.info(`Server listening on ${PORT}`);
});
