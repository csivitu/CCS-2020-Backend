require('dotenv').config();
require('./models/db');

const express = require('express');

const bodyparser = require('body-parser');

const session = require('express-session');

const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const authRouter = require('./routes/auth');
const forgotPasswordRouter = require('./routes/forgotPassword');
const quizRouter = require('./routes/quiz');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({
    extended: true,
}));

app.use(bodyparser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 12 * 60 * 60 * 100,
    },
}));

app.listen(port, () => {
    console.log(`Express server started at port: ${port}`);
});

app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/forgotPassword', forgotPasswordRouter);
app.use('/quiz', quizRouter);
app.use('/', indexRouter);
