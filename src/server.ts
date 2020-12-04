/* eslint-disable no-console */
import './utils/env.ts';
import './models/db.ts';
import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
