const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.');
    } else {
        console.log(`Error in DB connection: ${err}`);
    }
});
