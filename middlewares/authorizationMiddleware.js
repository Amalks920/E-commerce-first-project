

const authorizationMiddleware=async(req,res,next)=>{
    if(req.session.user){
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        next()
    }
   else res.redirect('/loginOrSignup')
}



module.exports=authorizationMiddleware;