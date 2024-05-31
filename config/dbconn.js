const mongoose = require('mongoose');

const dBUri = process.env.DB_URI;

const connectDB = async () => {
    mongoose.connect(dBUri)
        .then(() => {
            console.log('Successively Connected to MongoDB...')
        })
        .catch((err) => {
            console.log('Failed to connect to MongoDB...', err)
        });
}



module.exports = connectDB;