const express = require("express");
const router = express.Router();
const upload = require("../config/multer")

const {authorizationMiddleware,adminAuthorizationMiddleware}=require('../middlewares/authorizationMiddleware')
const {addCategory,addCategoryPost}=require('../controller/categoryCtrl')




router.get('/add-category',adminAuthorizationMiddleware,addCategory)
router.post('/add-category',upload.array("images",10),adminAuthorizationMiddleware,addCategoryPost)


module.exports=router