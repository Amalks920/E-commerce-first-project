const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { getAdminHome, adminLogin, getAdminLogin, adminLogout, getAdminOtpLogin, 
    adminOtpLoginPost, getAdminVerifyOtpLogin, verifyOtpAdminPost,getAdminForgotPassword, adminForgotPasswordPost, getAdminChangePassword, adminChangePasswordPost } = require('../controller/authCtrl')
const { adminAuthorizationMiddleware } = require('../middlewares/authorizationMiddleware')
const { addCoupon, addCouponPost, viewCouponAdmin } = require('../controller/couponCtrl');
const { setCacheControl } = require('../middlewares/cacheControllMiddleware');
const { addCategory, addCategoryPost, viewCategory } = require('../controller/categoryCtrl');
const { getViewProducts, getEditProduct, editProductPost, deleteImage } = require("../controller/productCtrl");
const { getViewUsers, blockUser } = require('../controller/userCtrl')
const {viewOrdersAdmin,editOrder, getOrderProducts, cancelOrder}=require('../controller/orderCtrl');
const { set } = require("lodash");
const { getBannerManagementPage, addBannerPost } = require("../controller/bannerCtrl");

const {getAddOffers, viewOffers, addOffer, getEditOffers, editOffer}=require('../controller/offerCtrl')



router.get('/admin-login', setCacheControl, getAdminLogin)
router.post('/admin-login', setCacheControl, adminLogin)
router.get('/admin-otp-login', setCacheControl, getAdminOtpLogin)
router.post('/admin-otp-login', setCacheControl, adminOtpLoginPost)
router.get('/verify-otp-login', setCacheControl, getAdminVerifyOtpLogin)
router.post('/verify-otp-login', setCacheControl, verifyOtpAdminPost)
router.get('/forgot-password',setCacheControl,getAdminForgotPassword)
router.post('/forgot-password',setCacheControl,adminForgotPasswordPost)
router.get('/change-password',setCacheControl,getAdminChangePassword)
router.post('/change-password',setCacheControl,adminChangePasswordPost)
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


router.get('/view-orders',setCacheControl,adminAuthorizationMiddleware,viewOrdersAdmin);
router.get('/order-products/:id',setCacheControl,adminAuthorizationMiddleware,getOrderProducts)

router.post("/edit-order-status/:id",adminAuthorizationMiddleware,cancelOrder);

router.get('/add-coupon',setCacheControl,adminAuthorizationMiddleware,addCoupon)
router.post('/add-coupon',setCacheControl,adminAuthorizationMiddleware,addCouponPost)

router.get('/view-coupon',setCacheControl,adminAuthorizationMiddleware,viewCouponAdmin)

//banner
router.get('/banner-management',getBannerManagementPage)
router.post('/add-banner',upload.array("images", 10),addBannerPost)



// Offers

router.get('/add-offers',getAddOffers)
router.get('/view-offers',viewOffers)
router.post('/add-offer',addOffer)
router.get('/edit-offer/:offerId',getEditOffers)
router.post('/edit-offer/:offerId',editOffer)


module.exports = router




