const mongoose = require('mongoose');

// Define Account schema
const AccountSchema = new mongoose.Schema(
    {
      accountNumber: { 
        type: String,
         required: true,
          unique: true
         },

       name: {
         type: String, 
         required: true
         },
         email:{
          type: String,
          required: true,
          unique: true,
          min: 6,
          max: 255
      },
  password:
   { type: String,
       required: true,
       min: 5,
       max: 1024
      },
      balance: { 
        type: Number, 
        required: true, 
        default: 0
       },
      
        dailyWithdrawalLimit: { 
          type: Number,
          required: true, 
          default: 1000000 
        },
      
        withdrawnToday: {
           type: Number,
            default: 0 
          },
    transactions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Transaction' }]
  },
  { 
    timestamps: true 
  }
);

// export the model
  module.exports = mongoose.model('Account',AccountSchema);