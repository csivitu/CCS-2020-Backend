const mongoose = require('mongoose');
const constants = require('../tools/constants');

const adminDataSchema = new mongoose.Schema({
    round1Evaluations: [{
        domain: {
            type: String,
            required: true,
            enum: constants.domains,
        },
        evaluator: String,
        comments: String,
        score: {
            type: Number,
            min: 0,
            max: 10,
        },
        status: {
            type: String,
            enum: ['Pass', 'Fail'],
        },
    }],
    round2Evaluations: [{
        domain: {
            type: String,
            required: true,
            enum: constants.domains,
        },
        evaluator: String,
        comments: String,
        score: {
            type: Number,
            min: 0,
            max: 10,
        },
        status: {
            type: String,
            enum: ['Pass', 'Fail'],
        },
    }],
    round3Evaluation: {
        evaluators: [String],
        interviewStatus: {
            type: String,
            default: 'Left',
            enum: ['Left', 'Done', 'Won\'t Come', 'Not Reachable'],
        },
        status: {
            type: String,
            enum: ['Pass', 'Fail', 'On Hold', 'Needs Discussion'],
        },
        selectedFor: {
            type: String,
            enum: constants.domains,
        },
        taskGiven: {
            type: String,
            default: 'None',
        },
        otherChapters: String,
    },
});

module.exports = adminDataSchema;
