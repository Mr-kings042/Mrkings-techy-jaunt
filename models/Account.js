const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Transaction = require('../models/Transaction');
// Define Account schema
const AccountSchema = new mongoose.Schema(
    {
      accountNumber: { 
        type: String,
         required: true,
          unique: true
         },

       firstName: {
         type: String, 
         required: true
         },

      lastName: {
         type: String,
          required: true
         },

      balance: { 
        type: Number, 
        required: true, 
        default: 0
       },
        
        dailyWithdrawalLimit: { 
          type: Number,
          required: true, 
          default: 1000 
        },
      
        withdrawnToday: {
           type: Number,
            default: 0 
          },
    transactions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Transaction' }]
  },
  { timestamps: true }
);

// export the model
  module.exports = mongoose.model('Account',AccountSchema);