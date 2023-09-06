const mongoose = require('mongoose'); // Erase if already required
const ObjectId=require('mongodb').ObjectId
const bcrypt=require('bcrypt')

const saltRounds = 10;

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
   
 
    username:{
        type:String,
        required:true,
        minLength: 3,
        maxLength: 50,
        pattern: /^[a-zA-Z ]+$/,
        message: 'Name must be at least 3 characters long and contain only letters and spaces',
    },
   

    email:{
        type:String,
        required:true,
        unique:true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/,
        message: 'Invalid email address',
    },

    password:{
        type:String,
        required:true,
        minLength: 8,
        maxLength: 128,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])[a-zA-Z0-9@#$%^&+=]{8,128}$/,
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        default:"user"
    },
    cart:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"Cart",
        default:new ObjectId(null)
    },
    address:[{
        type:mongoose.ObjectId,
        ref:"Address"
}],
  wishlists:[{
    type:mongoose.ObjectId,
    ref:"Product"
}],

},
{
    timestamps:true
}
);

userSchema.pre('save',async function (next){
    this.password=await bcrypt.hash(this.password, saltRounds)
})



userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
}



//Export the model
module.exports = mongoose.model('User', userSchema);