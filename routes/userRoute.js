const express = require("express");
const router = express.Router();

const {
  authorizationMiddleware,
} = require("../middlewares/authorizationMiddleware");

const {
  landingPage,
  createUser,
  getUserLogin,
  userLogin,
  getHomePage,
  getAdminHome,
  logout,
  getOtpLogin,
  otpLoginPost,
  getVerifyOtp,
  verifyOtpPost,
  getHomePageNotLoggedIn,
  getForgotPassword,
  forgotPasswordPost,
  changePassword,
  changePasswordPost,
  get404Err,
} = require("../controller/authCtrl");

const {
  getCart,
  addToCartPost,
  updateCartPost,
  removeFromCart,
} = require("../controller/cartCtrl");

const { getProductPage } = require("../controller/productCtrl");
const { setCacheControl } = require("../middlewares/cacheControllMiddleware");

//checkout
const { checkout } = require("../controller/checkoutCtrl");

//search page
const { searchPage, filteredProducts } = require("../controller/searchCtrl");
const { getShopPage, userDashboard } = require("../controller/userCtrl");
const {
  addAddressPost,
  deleteAddress,
  selectAddress,
} = require("../controller/addressCtrl");

const {
  placeOrder,
  orderPage,
  viewOrders,
  orderDetails,
  cancelOrder,
  editOrder,
} = require("../controller/orderCtrl");
const { getPaymentPage, checkPayment, payment } = require("../controller/paymentCtrl");
const { showOfferProducts } = require("../controller/offerCtrl");

router.get("/", setCacheControl, getHomePageNotLoggedIn);

router.post("/user-signup", setCacheControl, createUser);
router.get("/loginOrSignup", setCacheControl, getUserLogin);
router.post("/user-login", setCacheControl, userLogin);
router.get("/otp-login", setCacheControl, getOtpLogin);
router.post("/otp-login", setCacheControl, otpLoginPost);
router.get("/verify-otp", setCacheControl, getVerifyOtp);
router.post("/verify-otp", setCacheControl, verifyOtpPost);
router.get("/forgot-password", setCacheControl, getForgotPassword);
router.post("/forgot-password", setCacheControl, forgotPasswordPost);
router.get("/change-password", setCacheControl, changePassword);
router.post("/change-password", setCacheControl, changePasswordPost);

//user-dashboard
router.get(
  "/user-dashboard",
  setCacheControl,
  authorizationMiddleware,
  userDashboard
);
router.post(
  "/add-address",
  setCacheControl,
  authorizationMiddleware,
  addAddressPost
);
router.post(
  "/delete-address",
  setCacheControl,
  authorizationMiddleware,
  deleteAddress
);
router.post(
  "/select-address",
  setCacheControl,
  authorizationMiddleware,
  selectAddress
);

router.get("/home", setCacheControl, authorizationMiddleware, getHomePage);
router.get("/shop", setCacheControl, authorizationMiddleware, getShopPage);
router.get(
  "/product-page/:id",
  setCacheControl,
  authorizationMiddleware,
  getProductPage
);

//cart
router.get("/get-cart", setCacheControl, authorizationMiddleware, getCart);
router.post("/add-to-cart", authorizationMiddleware, addToCartPost);
router.post(
  "/updatecart",
  setCacheControl,
  authorizationMiddleware,
  updateCartPost
);
router.post(
  "/remove-from-cart",
  setCacheControl,
  authorizationMiddleware,
  removeFromCart
);

router.post(
  '/filter-products',
  setCacheControl,
  authorizationMiddleware,
  filteredProducts
)

//checkout
router.get("/checkout", setCacheControl, authorizationMiddleware, checkout);

// Order
router.post(
  "/place-order",
  setCacheControl,
  authorizationMiddleware,
  placeOrder
);

router.get("/order-page", setCacheControl, authorizationMiddleware, orderPage);

router.post(
  "/cancel-order/:id",
  setCacheControl,
  authorizationMiddleware,
  cancelOrder
);

router.get("/logout", authorizationMiddleware, logout);

router.get(
  "/search-page",
  setCacheControl,
  authorizationMiddleware,
  searchPage
);

router.get(
  "/view-orders",
  setCacheControl,
  authorizationMiddleware,
  viewOrders
);

router.get(
  "/order-details/:id",
  setCacheControl,
  authorizationMiddleware,
  orderDetails
);


router.get(
  '/razor-pay',
  setCacheControl,
  authorizationMiddleware,
  getPaymentPage

)

router.post(
  '/check-payment',
  setCacheControl,
  authorizationMiddleware,
  checkPayment
)


router.get(
  '/payment-page',
  payment
)


router.get('/show-offer-products/:offerId',setCacheControl,authorizationMiddleware,showOfferProducts)

router.get('/404',get404Err)


module.exports = router;

// router.get('/coupon',setCacheControl,authorizationMiddleware,getCoupon)
// router.get('/payment',setCacheControl,getPaymentPage)
// router.get('/add-address',setCacheControl,authorizationMiddleware,getAddAddress)
// router.post('/add-address',setCacheControl,authorizationMiddleware,addAddressPost)
