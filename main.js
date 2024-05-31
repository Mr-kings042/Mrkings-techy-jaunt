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

  


// creating routes
app.use('/users', require('./routes/user'));
app.use('/accounts', require('./routes/Account'));
app.use('/transactions', require('./routes/Transaction'));


// testing server port
app.listen(port, () => {
    console.log(`The server is running on port; http://localhost: ${port}...`)
});