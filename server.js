require('dotenv').config();

const express = require('express');

const bodyparser = require('body-parser');
const cors = require('cors');

const quizRouter = require('./routes/quiz');

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
    console.error('Fatal Error: JWT_SECRET not defined');
    process.exit(1);
}

app.use(bodyparser.urlencoded({
    extended: true,
}));

app.use(bodyparser.json());

if (process.env.ENVIRONMENT === 'dev') app.use(cors());

app.listen(port, () => {
    console.log(`Express server started at port: ${port}`);
});

app.use(cors());
app.use('/', quizRouter);
