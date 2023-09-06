const express = require("express");
const router = express.Router();
const upload = require("../config/multer");


const {authorizationMiddleware,adminAuthorizationMiddleware}=require('../middlewares/authorizationMiddleware')
const {addCategory,addCategoryPost,viewCategory,getEditCategory,
    editCategoryPost,deleteCategory}=require('../controller/categoryCtrl');
const { setCacheControl } = require("../middlewares/cacheControllMiddleware");


router.post('/add-category',setCacheControl, upload.array("images",10),adminAuthorizationMiddleware,addCategoryPost)
router.get('/view-category',setCacheControl, adminAuthorizationMiddleware,viewCategory)
router.get('/edit-category/:id',setCacheControl, adminAuthorizationMiddleware,getEditCategory)
router.post('/edit-category/:id',setCacheControl, upload.array("images",10),adminAuthorizationMiddleware,editCategoryPost)
router.get('/delete-category/:id',setCacheControl, adminAuthorizationMiddleware,deleteCategory)




module.exports=router