const express = require("express");
const upload = require("../config/multer")
const router = express.Router();

const {authorizationMiddleware,adminAuthorizationMiddleware}=require('../middlewares/authorizationMiddleware')
const {getProduct,getAddProduct,addProduct,getProductPage
    ,getViewProducts,deleteProduct}=require('../controller/productCtrl');
const { setCacheControl } = require("../middlewares/cacheControllMiddleware");


 router.get('/add-product',setCacheControl, adminAuthorizationMiddleware,getAddProduct)
 router.post('/add-product',setCacheControl, upload.array("images",10),adminAuthorizationMiddleware,addProduct)

//  router.get('/delete-products', adminAuthorizationMiddleware,deleteProduct)


 


module.exports=router