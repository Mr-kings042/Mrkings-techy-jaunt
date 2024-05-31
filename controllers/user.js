const asynchandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const Account = require('../models/Account');

const JWTSECRET = process.env.JWTSECRET;

const getUsers = asynchandler(async (req,res) => {
    try {
        const users = await Owner.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

const createUser = asynchandler (async (req,res) => {

const { username, email, password }  = req.body;

// check if all field are inputed
if (!username || !email || !password) {
    return res.status(400).json({
        error: "Username, Email and Password fields are required"
    });
}
  // Check if the email is already in use
  const existingUser = await User.findOne({ email,username });
  if (existingUser) {
    return res.status(400).json({
      error: "Username or Email is already in use"
    });
  }

// hash users password
const hashPassword = await bcrypt.hash(password, 10);

try {
    // Create a new user
    const newUser = new User({
        username,
        email,
        password: hashPassword
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with the created new user
    res.status(201).json(newUser);
} catch (error) {
    // Handle any errors that occur during saving
    res.status(500).json({
        error: "An error occurred while saving new user"
    });
}
});

const getUser =  asynchandler (async (req,res) => { 
    const userID = req.user.id;

   await User.findById(userID)
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    error: "User not Found"
                });
            }
            res.status(200).json(user);
        })
        .catch((error) => {
            res.status(400).json({
                error: error.message
            });
        });
});

const updateUser = asynchandler(async (req, res) => {
    const userID = req.user.id;
    const { username,  email } = req.body;
   
    const isUserIDValid = mongoose.Types.ObjectId.isValid(userID);
    
    if (!isUserIDValid) {
        return res.status(400).json({
            error: "Invalid User ID"
        });
    }

    
    if (!username) {
        return res.status(400).json({
            error: "Username field is required"
        });
    }

    if (!email) {
        return res.status(400).json({
            error: "Email field is required"
        });
    }

    // check if user exist
    await User.findById(userID)
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    error: "User not Found"
                });
            }
        })
        .catch((error) => {
            res.status(400).json({
                error: error.message
            });
        });

    let user = await User.findByIdAndUpdate(
        userID,
        { username: username, email: email },
        { new: true }
    ).catch((error) => {
        res.status(400).json({
            error: error.message
        });
    });

    res.status(200).json(user);
});

const deleteUser = asynchandler (async (req,res) => {
    const userID = req.user.id;
    const isUserIDValid = mongoose.Types.ObjectId.isValid(userID);

    if (!isUserIDValid) {
        return res.status(400).json({
            error: "Invalid User ID"
        });
    }

    // check if User exist
    await User.findById(userID)
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    error: "User not Found"
                });
            }
        })
        .catch((error) => {
            res.status(400).json({
                error: error.message
            });
        });

    await User.findByIdAndDelete(userID)

    res.status(200).json({});
});

const Userlogin = asynchandler(async (req, res) => {
    const {username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            error: "Username, Email and Password fields are required"
        });
    }

    const user = await Owner.findOne({ email,username })
        .catch((error) => {
            res.status(400).json({
                error: error.message
            });
        });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(400).json({
            error: "Incorrect Password provided"
        });
    }

    const token = jwt.sign({ 
        id: user._id, email: user.email }, JWTSECRET, { expiresIn: '5h' });
    res.status(200).json({
        token: token
    })
});

module.exports = {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    Userlogin,
};