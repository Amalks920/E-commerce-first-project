

const authorizationMiddleware=async(req,res,next)=>{
    if(req.session.user){
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        next()
    }
   else res.redirect('/loginOrSignup')
}

const adminAuthorizationMiddleware=async(req,res,next)=>{
    if(req.session.admin){
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        next()
    }
   else res.redirect('/admin/admin-login')
}



module.exports={authorizationMiddleware,adminAuthorizationMiddleware}