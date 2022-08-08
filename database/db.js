const mongoose = require('mongoose');
require('dotenv/config');


const connectDB = cb => {
    mongoose.connect(process.env.MONGO_URI)
    .then(onSuccessfulConnect => {
        cb();
    })
    .catch(err => console.log(err))
}

module.exports = connectDB;