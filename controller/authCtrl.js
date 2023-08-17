const expressAsycnHandler=require('express-async-handler');
const User=require('../model/userSchema')

 const auth= expressAsycnHandler(async(req,res,next)=>{
  console.log(await User.find())
})


const createUser=expressAsycnHandler(async(req,res)=>{
    console.log(req.body);
    const {name,email,phone,password}=req.body
    let findUser
    console.log('signup finduser')
    console.log(findUser)
       
        if(!findUser){
            
            try {

                if(req.body.password[0]===req.body.password[1]){
                    req.body.password=req?.body?.password[0]
                }else{
                    res.status(491).json({msg:'both passwords should be same'})
                }

            let user=await User.create(req.body)
    
            if(!user.name || !user.email  || !user.password) res.status(402).json({err:"something missing"})
            
                 res.status(201).json({"name":user.name,"email":user.email,"mobile":user.mobile})
    
            } catch (error) {
                console.log('db error')
                console.log(error)
                res.status(401).json({code:error.status,msg:error.message})
            }
        
             
        }else{
            res.json({
                message:"user already exists",
                success:false,
            })
        }
    }
    )

const getUserLogin=expressAsycnHandler(async(req,res,next)=>{
    res.render('user/loginSignup',{layout:'./layout/signupLogin'})
})




module.exports={
    auth,
    getUserLogin,
   createUser
}