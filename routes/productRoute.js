const express = require("express");
const upload = require("../config/multer")
const router = express.Router();

const {authorizationMiddleware,adminAuthorizationMiddleware}=require('../middlewares/authorizationMiddleware')
const {getProduct,getAddProduct,addProduct}=require('../controller/productCtrl')


 router.get('/add-product',adminAuthorizationMiddleware,getAddProduct)
 router.post('/add-product',upload.array("images",10),adminAuthorizationMiddleware,addProduct)
 


module.exports=router