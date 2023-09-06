const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { getAdminHome, adminLogin, getAdminLogin, adminLogout, getAdminOtpLogin, adminOtpLoginPost, getAdminVerifyOtpLogin, verifyOtpAdminPost } = require('../controller/authCtrl')
const { adminAuthorizationMiddleware } = require('../middlewares/authorizationMiddleware')
const { addCoupon, addCouponPost, viewCouponAdmin } = require('../controller/couponCtrl');
const { setCacheControl } = require('../middlewares/cacheControllMiddleware');
const { addCategory, addCategoryPost, viewCategory } = require('../controller/categoryCtrl');
const { getViewProducts, getEditProduct, editProductPost, deleteImage } = require("../controller/productCtrl");
const { getViewUsers, blockUser } = require('../controller/userCtrl')



router.get('/admin-login', setCacheControl, getAdminLogin)
router.post('/admin-login', setCacheControl, adminLogin)
router.get('/admin-otp-login', setCacheControl, getAdminOtpLogin)
router.post('/admin-otp-login', setCacheControl, adminOtpLoginPost)
router.get('/verify-otp-login', setCacheControl, getAdminVerifyOtpLogin)
router.post('/verify-otp-login', setCacheControl, verifyOtpAdminPost)

router.get('/admin-home', setCacheControl, adminAuthorizationMiddleware, getAdminHome)


router.get('/add-category', setCacheControl, adminAuthorizationMiddleware, addCategory)
router.post('/add-category', setCacheControl, upload.array("images", 10), adminAuthorizationMiddleware, addCategoryPost)
router.get('/edit-product/:id', setCacheControl, adminAuthorizationMiddleware, getEditProduct)

router.post('/edit-product', upload.array("images", 10), setCacheControl, adminAuthorizationMiddleware, editProductPost)
router.get('/admin-logout', setCacheControl, adminAuthorizationMiddleware, adminLogout)
router.get('/view-products', setCacheControl, adminAuthorizationMiddleware, getViewProducts)
router.get('/view-users', setCacheControl, adminAuthorizationMiddleware, getViewUsers)
router.put('/block-user/:id', setCacheControl, adminAuthorizationMiddleware, blockUser)

router.post('/remove-images', setCacheControl, adminAuthorizationMiddleware, deleteImage)







module.exports = router


// router.get('/add-coupon',setCacheControl,addCoupon)
// router.post('/add-coupon',setCacheControl,addCouponPost)
// router.get('/view-coupon',setCacheControl,viewCouponAdmin)
