const { mongoose }=require('mongoose');

const dbConnect=()=>{
    console.log(process.env.MONGODB_URL_STRING);
    try {
        const connection=mongoose.connect(process.env.MONGODB_URL_STRING);
        console.log('connection successfull')
        
    } catch (error) {
        console.log(`connection failed ${error}`);
        
    }
}

module.exports=dbConnect;