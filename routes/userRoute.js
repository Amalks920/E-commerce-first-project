const express = require("express");
const router = express.Router();

const {authorizationMiddleware}=require('../middlewares/authorizationMiddleware')

const {landingPage,createUser,getUserLogin
    ,userLogin,getHomePage,getAdminHome,
    logout,getOtpLogin, otpLoginPost,getVerifyOtp, verifyOtpPost, getHomePageNotLoggedIn}=require('../controller/authCtrl');

const {getProductPage}=require('../controller/productCtrl')
const {setCacheControl}=require('../middlewares/cacheControllMiddleware');


//search page
const {searchPage} = require('../controller/searchCtrl')


router.get("/",setCacheControl,getHomePageNotLoggedIn);


router.post('/user-signup',setCacheControl,createUser)
router.get('/loginOrSignup',setCacheControl,getUserLogin)
router.post('/user-login',setCacheControl,userLogin)
router.get('/otp-login',setCacheControl,getOtpLogin)
router.post('/otp-login',setCacheControl,otpLoginPost)
router.get('/verify-otp',setCacheControl,getVerifyOtp)
router.post('/verify-otp',setCacheControl,verifyOtpPost)

router.get('/home',setCacheControl,authorizationMiddleware,getHomePage)
router.get('/product-page/:id',setCacheControl,authorizationMiddleware,getProductPage)


router.get('/logout',authorizationMiddleware,logout)

router.get('/search-page',setCacheControl,authorizationMiddleware,searchPage)




module.exports=router






// router.get('/get-cart',setCacheControl,authorizationMiddleware,getCart)
// router.post('/add-to-cart',authorizationMiddleware,addToCartPost)
// router.get('/coupon',setCacheControl,authorizationMiddleware,getCoupon)
// router.get('/payment',setCacheControl,getPaymentPage)
// router.get('/add-address',setCacheControl,authorizationMiddleware,getAddAddress)
// router.post('/add-address',setCacheControl,authorizationMiddleware,addAddressPost)
// router.post('/update-cart',setCacheControl,authorizationMiddleware,updateCartPost)
// router.post('/remove-from-cart',setCacheControl,authorizationMiddleware,removeFromCart)