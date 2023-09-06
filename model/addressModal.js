const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
   
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
            landMark:{
                type:String,
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
            }
           
        }
    ]
    
});

module.exports = mongoose.model('Address',addressSchema,'Address');