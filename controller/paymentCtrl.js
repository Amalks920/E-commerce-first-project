const cartModal = require('../model/cartModal');
const categoryModal=require('../model/categoryModal');
const orderModal = require('../model/orderModal');
const crypto=require('crypto');

const getPaymentPage=async (req, res) => {

    const category = await categoryModal.find();
    const { oid: orderId } = req.query;
    const order = await orderModal.findById(orderId);
    console.log(order);
    if (order.orderStatus === "pending") {
      res.render("user/razorPay.ejs", {
        layout:'./layout/signupLogin',
        category,
        order,
        isLoggedIn:true,
        razorpay_key: process.env.RAZORPAY_API_KEY,
      });
    }
  }

  const checkPayment= async (req, res) => {
    const userId = req.session.user._id;
    const { razorpayOrderId, razorpayPaymentId, secret } = req.body;
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET);
    hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
    let generatedSignature = hmac.digest("hex");
    if (generatedSignature == secret) {
      await orderModal.findOneAndUpdate(
        { "paymentData.id": razorpayOrderId },
        { orderStatus: "placed" }
      );
      await cartModal.findOneAndUpdate({ user: userId }, { products: [] });
      res.status(200).json({ success: true });
    } else res.status(400).json({ success: false });
  }

const payment=async (req,res,next) => {
  try {
    res.render('user/payment.ejs',
    {layout:'./layout/homeLayout.ejs',isLoggedIn:true})
  } catch (error) {
    console.log(error)
  }
}

module.exports={
    getPaymentPage,checkPayment,
    payment
}