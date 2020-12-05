/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';
import './utils/env.ts';
import './models/db.ts';
import mainRoutes from 'routes/routes';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/', mainRoutes);

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
