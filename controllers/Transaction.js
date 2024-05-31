const asynchandler = require('express-async-handler');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const getTransactions = asynchandler (async (req,res) => {
 try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
 } 
 catch (error) {
    console.error(error);
    res.status(500).json({ 
        error: 'Error fetching transactions' });
    }
});

const getTransaction = asynchandler (async (req,res) => {
   const transactionID = req.params.id;
  
   
    try {
        const transaction = await Transaction.findById(transactionID);
         // check if transaction is avaliable
        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found' });
            }
        res.status(200).json(transaction);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            error: "Invalid Transaction Id"
        });
    }
 
});

const deleteTransaction = asynchandler (async (req,res) => {
    const transactionID = req.params.id;
            //find trasaction from  ID   
    const transaction = await Transaction.findById(transactionID)
    .then((transaction) => {
        if (!transaction) {
            return res.status(404).json({
                error: "Transaction not Found"
            });
        }
    })
    .catch((error) => {
        res.status(400).json({
            error: 'Error deleting Transaction'
        })
    });
    await Transaction.findByIdAndDelete(transactionID)
    .catch((error) => {
        res.status(400).json({
            error: 'Error deleting Transactions'
        })
});
res.status(200).json({ 
    message: 'Transaction deleted successfully' });
});

module.exports = {
    getTransactions,
    getTransaction,
    deleteTransaction
};