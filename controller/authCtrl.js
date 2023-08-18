const expressAsycnHandler=require('express-async-handler');
const User=require('../model/userSchema')

 const landingPage= expressAsycnHandler(async(req,res,next)=>{
    console.log(req.session.user)
        res.render('user/user')
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


const userLogin=expressAsycnHandler(async (req,res,next)=>{
    const {email,password}=req.body
    //check if user exist or not
    try {
       let findUser=await User.findOne({email:email})
       

       
       if(findUser?.isBlocked===true){
        res.status(401).json({msg:"user is blocked"})
       }  

        //validate the password
        if(findUser && (await findUser.isPasswordMatched(password)) ){   
        
        //making user in session true
        req.session.user=true

        //destructuring finduser to get details of user 
        const { _id,email,isBlocked,name,role} = findUser;
            

        //send response to client side
        res.redirect('/home')
               
        }else{   
        //if user doesn't exist send error
          res.status(401).json({msg:"invalid credentials"})
        }  
    } catch (error) {
        res.status(401).json({error:error.message})
    } 
}
)


const getHomePage=expressAsycnHandler(async(req,res,next)=>{
    console.log(req.session.user=true)
    res.render('user/home',{layout:'./layout/userLayout'})
})

const getAdminHome=expressAsycnHandler(async(req,res,next)=>{
    res.render('admin/admin-home',{layout:'./layout/adminLayout'})
})




module.exports={
    landingPage,
    getUserLogin,
   createUser,
   userLogin,
   getHomePage,
   getAdminHome
}