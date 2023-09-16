const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    address: [
        {

            address: {
                type: String,
                required: true,
            },
            mobileNumber:{
                type:Number,
                required:true
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            pincode: {
                type: Number,
                required: true,
            },
            isSelected: {
                type:Boolean,
                default:false
            }
           
        }

    ]
    
});

module.exports = mongoose.model('Address',addressSchema,'Address');