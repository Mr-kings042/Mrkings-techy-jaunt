const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({

    type: { 
        type: String, 
        required: true,
        enum: ['deposit', 'withdrawal']
    },

    amount: { 
        type: Number,
         required: true
         },
         

         Account: { 
            type: mongoose.Schema.Types.ObjectId,
             ref: 'Account' 
            },

        },


   { 
    timestamp: true
  }
  );
  
  
  
  module.exports = mongoose.model('Transaction',transactionSchema );
