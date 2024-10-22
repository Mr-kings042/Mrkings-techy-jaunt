// install express
const express = require('express');

// install mongoose
const mongoose = require('mongoose');

// install middleware
const bodyParser = require('body-parser');

//install dotenv
const _ = require('dotenv').config();

// assign port and create express app
const app = express();
const port = process.env.port;

// create middleware app
app.use(bodyParser.json());

// mongoDB url
const dBUrl = process.env.DB_URI;
const connectDB = require('./config/dbconn');
connectDB();

// create JWTSecret
const JWTSECRET = process.env.JWTSECRET;

  


// testing my api
app.get('/', (req, res) => {
    res.send('Welcome to my API, what is ur name');
    });
    // creating routes
app.use('/accounts', require('./routes/Account'));
app.use('/transactions', require('./routes/Transaction'));


// testing server port and displaying to console
app.listen(port, () => {
    console.log(`The server is running on port; http://localhost: ${port}...`)
});