const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ccsDB = mongoose.createConnection(`${process.env.MONGO_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
});

ccsDB.once('open', () => {
    console.log('Connected to Mongo Sucesfully!');
});

module.exports = ccsDB;
