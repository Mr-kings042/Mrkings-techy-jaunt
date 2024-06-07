const asynchandler = require('express-async-handler');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

const JWTSECRET = process.env.JWTSECRET;

const getAccounts = asynchandler(async (req,res) =>{
    try {
        const accounts  = await Account.find();
        res.status(200).json(accounts);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: "Error Fetching Accounts"
        });
    }
});

const createAccount = asynchandler (async (req,res) =>{
    const { name, email, password } = req.body;
// function to generate a random 10 digit account number
    const generateAccountNumber = () => {
      return Math.random().toString().slice(2,12);
    };
const accountNumber = generateAccountNumber();

console.log(accountNumber);

    if( !name || !email || !password){
      return res.status(400).json({ 
        error: 'Name, Email and Password required'});
    }
    // // // check if there is an existing same account,name and email
    // try {
    //   const existingAccount = await Account.find({ 
    //    name, email});
  
    //   if (existingAccount) {
    //     return res.status(400).json({ 
    //       error:  'Email and  Name already exists' });
    //   }
     
    // }catch (error) {
    //   console.log(error);
    //   res.status(500).json({ 
    //     error: 'Error while creating account' });
    // }

    // hash users password
const hashPassword = await bcrypt.hash(password, 10);
  
    const newAccount = new Account({
         accountNumber,
         name, 
         email,
        password: hashPassword});
    await newAccount.save();
  
    res.status(201).json(newAccount);
});

const getAccount = asynchandler(async (req,res) =>{
   const accountId = req.params.id;
//    check if the account Id is correct
   const account = await Account.findById(accountId)
    .then((account) => {
       if (!account) {
         return res.status(404).json({
            error: 'Account not found' 
           });
       }
       res.status(200).json(account); //display account
     })
      .catch ((error) => {
       res.status(400).json({ 
         error: 'Error fetching account' 
       });
     });
     
});

const updateAccount = asynchandler(async (req,res) =>{
    const accountId = req.params.id;
    const {email,name,dailyWithdrawalLimit} = req.body;

    // check if account exist
    await Account.findById(accountId)
        .then((account) => {
            if (!account) {
                return res.status(404).json({
                    error: "account not Found"
                });
            }
        })
        .catch((error) => {
            res.status(400).json({
                error: error.message
            });
        });
//  find account and update the name,email,and dailywithdrawal limit

    const account = await Account.findByIdAndUpdate(
        accountId,
        {name:name,
          email: email,
          dailyWithdrawalLimit: dailyWithdrawalLimit},
         { new: true }  // Return updated account
        ).catch((error) => {
            res.status(400).json({
                error: error.message
            })
        }); 

    res.status(200).json(account);
});

const deleteAccount = asynchandler(async (req, res) =>{
    const accountId = req.params.id;
// check if user id is valid
    const isUserIDValid = mongoose.Types.ObjectId.isValid(userID);

    if (!isUserIDValid) {
        return res.status(400).json({
            error: "Invalid User ID"
        });
    }
            //check if accound  is avaliable  
const account = await Account.findById(accountId)
.then((account) => {
    if (!account) {
        return res.status(404).json({
            error: "Account not Found"
        });
    }
})
.catch((error) => {
    res.status(400).json({
        error: 'Error deleting account'
    })
});
await Account.findByIdAndDelete(accountId)
.catch((error) => {
    res.status(400).json({
        error: 'Error deleting account'
    })
});



res.status(200).json({ 
    message: 'Account deleted successfully' });
});
const getAccountTransactions = asynchandler(async(req, res) =>{
    const accountId = req.params.id;
  const account = await Account.findById(accountId);
  if (!account) {
    return res.status(404).json({
        error: 'Account not found'});
  }

  const transactions = await Transaction.find({ _id: { $in: account.transactions } });
  res.status(200).json(transactions);
});
const getAccountBalance = asynchandler (async (req,res) =>{
    const accountId = req.params.id;

    // check account ID
   const account = await Account.findById(accountId)
    .then((account) => {
       if (!account) {
         return res.status(404).json({
            error: 'Account not found' 
           });
       }
     })
      .catch ((error) => {
       res.status(400).json({ 
         error: 'Error fetching account' 
       });
     });
     res.status(200).json({
         balance: account.balance });
})

const getAccountwithdrawals = asynchandler(async (req,res) =>{
    const accountId = req.params.id;
    const amount = req.body;

//   check if amount input is a number and check if amount is greater than account balance
    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({
        error: 'Invalid withdrawal amount'});
    }
 
// check account ID      
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({
        error:'Account not found'});
    }
    // check if the funds is sufficient
    if (amount > account.balance) {
      return res.status(400).json({
           error: 'Insufficient funds' });
    }
//   check withdrawal limit
    if ((account.withdrawnToday || 0) + amount > account.dailyWithdrawalLimit) {
        return res.status(400).json({ 
            error: 'Daily withdrawal limit exceeded' });
      }
    
    

    
  
    try {
  //  create new transaction
      const transaction = new Transaction({
         type: 'withdrawal',
          amount, 
          accountId: account._id });
          // update account balance
      account.balance -= amount;
      account.withdrawnToday = (account.withdrawnToday || 0) + amount;
      account.transactions.push(transaction);
    
      await account.save();
      await transaction.save(); //save the transaction
      res.status(200).json(transaction); // Return the created transaction object
    } 
    catch (error) {
      return res.status(400).json({
        error: message
    }); // Handle withdrawal errors (insufficient funds, daily limit exceeded)
    }
});
const getAccountDeposit = asynchandler(async (req,res) =>{
    const accountId = req.params.id;
    const amount = req.body.amount;
    account.balance += amount;

    if (!amount || typeof amount !== 'number' && amount <= 0) {
      return res.status(400).json({
        error: 'Invalid deposit amount'});
    }
//   check account ID
    const account = await Account.findById(accountId);
    if (!account) {
        return res.status(400).json({
            error: 'Account not found'});
        }
    
  
  
    try {
    //   const transaction = await account.deposit(amount);
    const transaction = new Transaction({ 
        type: 'deposit',
         amount, 
         accountId: account._id });
  account.transactions.push(transaction);

  await account.save();
  await transaction.save();
      res.status(200).json(transaction); // Return the created transaction object
    } catch (error) {
      return res.status(400).json({
        error: message}); // Handle potential errors (e.g., negative deposit amount)
    }
});

const Userlogin = asynchandler(async (req, res) => {
  const {name, email, password } = req.body;

  if (!name || !email || !password) {
      return res.status(400).json({
          error: "Username, Email and Password fields are required"
      });
  }

  const account = await Account.findOne({ email,name })
      .catch((error) => {
          res.status(400).json({
              error: error.message
          });
      });

  const passwordMatch = await bcrypt.compare(password, account.password);
  if (!passwordMatch) {
      return res.status(400).json({
          error: "Incorrect Password provided"
      });
  }

  const token = jwt.sign({ 
      id: account._id, email: account.email }, JWTSECRET, { expiresIn: '5h' });
  res.status(200).json({
      token: token
  })
});


module.exports = {
    getAccounts,
    createAccount,
    getAccount,
    updateAccount,
    deleteAccount,
    getAccountTransactions,
    getAccountBalance,
    getAccountDeposit,
    getAccountwithdrawals,
     Userlogin
}