const express = require("express");
const router = express.Router();
const {authorizationMiddleware}=require('../middlewares/authorizationMiddleware')
const {landingPage,createUser,getUserLogin
    ,userLogin,getHomePage,getAdminHome}=require('../controller/authCtrl')


router.get("/",landingPage);


router.post('/user-signup',createUser)
router.get('/loginOrSignup',getUserLogin)
router.post('/user-login',userLogin)
router.get('/home',authorizationMiddleware,getHomePage)







// router.post('/user-signup',userSignup)


module.exports=router