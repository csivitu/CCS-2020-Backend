const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const hb = require('express-handlebars').create({
    extname: '.hbs',
    partialsDir: '.',
});

const router = express.Router();
const Participant = require('../models/participant.model');
const constants = require('../tools/constants');
const {
    verifyEmail,
    verifyMobile,
    verifyPassword,
    verifyRegNo,
} = require('../tools/verify');
const sendMail = require('../tools/sendMail');

const sendVerificationMail = async (participant) => {
    const verifyLink = new URL(process.env.VERIFY_LINK);
    verifyLink.search = `?token=${participant.emailVerificationToken}`;
    const renderedHtml = await hb.render('../templates/verify.hbs', {
        participant,
        verifyLink: verifyLink.href,
    });
    await sendMail(participant.name, participant.email,
        constants.sendVerificationMailSubject, renderedHtml);
};

router.post('/', async (req, res) => {
    const participant = new Participant({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        regNo: req.body.regNo,
        gender: req.body.gender,
    });

    const jsonResponse = {
        success: false,
        message: constants.defaultResponse,
    };

    if (!verifyEmail(participant.email)) {
        jsonResponse.message = constants.invalidEmail;
        res.json(jsonResponse);

        return;
    }

    if (!verifyMobile(participant.mobile)) {
        jsonResponse.message = constants.invalidMobile;
        res.json(jsonResponse);

        return;
    }

    if (!verifyPassword(participant.password)) {
        jsonResponse.message = constants.invalidPassword;
        res.json(jsonResponse);

        return;
    }

    if (!verifyRegNo(participant.regNo)) {
        jsonResponse.message = constants.invalidRegNo;
        res.json(jsonResponse);

        return;
    }

    if (participant.email.length > 320 || participant.gender.length > 1) {
        jsonResponse.success = false;
        jsonResponse.message = constants.maxFieldLengthExceeded;
        return;
    }
    const saltRounds = 10;

    participant.password = await bcrypt.hash(req.body.password, saltRounds);
    participant.emailVerificationToken = (await crypto.randomBytes(32)).toString('hex');
    participant.passwordResetToken = (await crypto.randomBytes(32)).toString('hex');

    Promise.all(constants.domains.forEach((domain) => {
        participant.time[domain] = {
            timeStarted: null,
            timeEnded: null,
        };
    }));

    await participant.save();

    sendVerificationMail(participant);

    jsonResponse.success = true;
    jsonResponse.message = constants.registrationSuccess;

    res.json(jsonResponse);
});

router.post('/verify', async (req, res) => {
    const participant = await Participant.findOneAndUpdate({
        emailVerificationToken: req.body.emailVerificationToken,
    }, {
        verificationStatus: true,
    });

    if (!participant) {
        res.json({
            success: false,
            message: constants.participantNotFound,
        });
        return;
    }

    res.json({
        success: true,
        message: constants.verificationSuccess,
    });
});

module.exports = router;
