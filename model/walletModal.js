const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({

  user_id: {
    type: mongoose.Schema.ObjectId,
    ref:'User',
    required: true,
  },
  balance: {
    amount: {
      type: Number,
      required: true,
      default:0
    },
    currency: {
        type: String,
        default: "INR",
        required: true,
      },
      
  },
  transactions: [
    {
    //   transaction_id: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //   },
      date: {
        type: Date,
        
      },
      description: {
        type: String,
      
      },
      amount: {
        type: Number,
        
      },
      currency: {
        type: String,
     
      },
      type: {
        type: String,
     
      },
      status: {
        type: String,
      },
    },
  ],
//   cards: [
//     {
//       card_id: {
//         type: String,
//         required: true,
//         unique: true,
//       },
//       card_type: {
//         type: String,
//         required: true,
//       },
//       card_number: {
//         type: String,
//         required: true,
//       },
//       expiry_date: {
//         type: String,
//         required: true,
//       },
//       name_on_card: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   payment_methods: [
//     {
//       method_id: {
//         type: String,
//         required: true,
//         unique: true,
//       },
//       method_type: {
//         type: String,
//         required: true,
//       },
//       details: {
//         account_number: {
//           type: String,
//         },
//         routing_number: {
//           type: String,
//         },
//         paypal_email: {
//           type: String,
//         },
//       },
//     },
//   ],

},
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  }

);

module.exports = mongoose.model('Wallet', walletSchema);


