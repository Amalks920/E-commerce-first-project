const express = require("express");
const router = express.Router();
const {auth,createUser,getUserLogin}=require('../controller/authCtrl')



router.get("/",auth);


router.post('/user-signup',createUser)
router.get('/login',getUserLogin)



// router.post('/user-signup',userSignup)


module.exports=router