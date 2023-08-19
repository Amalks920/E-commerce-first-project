const express = require("express");
const router = express.Router();
const {getAdminHome,adminLogin,getAdminLogin}=require('../controller/authCtrl')
const {adminAuthorizationMiddleware}=require('../middlewares/authorizationMiddleware')

router.get('/admin-login',getAdminLogin)
router.post('/admin-login',adminLogin)
router.get('/admin-home',adminAuthorizationMiddleware,getAdminHome)



module.exports=router