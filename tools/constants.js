module.exports = {
    emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((vitstudent.ac.in)|(vit.ac.in))$/,
    mobileRegex: /^[6-9]\d{8,9}$/, // 9-10 characters
    passwordRegex: /^[a-zA-Z0-9`!@#$%^&*()-/:'.,{}"~]{8,16}$/, // 8-16 characters,
    regNoRegex: /^19[A-Z]{3}[0-9]{4}$/,

    defaultResponse: 'defaultResponse',

    home: 'homePage',

    domains: ['tech', 'management', 'design', 'video'],

    invalidEmail: 'invalidEmail',
    invalidMobile: 'invalidMobile',
    invalidPassword: 'invalidPassword',
    invalidRegNo: 'invalidRegNo',
    invalidQuestion: 'invalidQuestion',
    incorrectPassword: 'incorrectPassword',

    participantNotFound: 'participantNotFound',
    loginSuccess: 'loginSuccess',
    logoutSuccess: 'logoutSuccess',
    maxFieldLengthExceeded: 'maxFieldLengthExceeded',
    adminLoginSuccess: 'adminLoginSuccess',
    adminLogoutSuccess: 'adminLogoutSuccess',

    registrationSuccess: 'registrationSuccess',

    questionAdded: 'questionAdded',
    passwordResetMail: 'passwordResetMailSent',
    passwordResetSuccess: 'passwordResetSuccess',

    emailFrom: 'CSI-VIT',
    senderEmail: 'tech@csivit.com',
    emailReplyTo: 'askcsivit.com',

    sendResetMailSubject: 'Reset your CCS Password',
    sendVerificationMailSubject: 'Verify your CCS Account',
    verificationSuccess: 'verificationSuccess',

    quizStarted: 'quizStarted',
    responseSaved: 'responseSaved',
    alreadyAnswered: 'alreadyAnswered',
    questionNotFound: 'questionNotFound',
    quizDuration: 45, // in minutes
    lastRandomQuestion: 13,
    totalQuestions: 15,

    invalidJWT: 'invalidJWT',
    verifiedJWT: 'verifiedJWT',
};
