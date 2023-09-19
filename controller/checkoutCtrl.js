const addressModal = require("../model/addressModal");
const cartModal = require("../model/cartModal");
const couponModal=require('../model/couponModal')
const walletModal=require('../model/walletModal');

const checkout = async (req, res, next) => {
  try {
    const wallet=await walletModal.findOne({user_id:req.session.user._id});

    const address = await addressModal.findOne({ user: req.session.user._id });
    const cart = await cartModal.findOne({ user: req.session.user._id })
                    .populate({ path: "products.product" });

    const coupons=await couponModal.find({})

    const selectedAddress = address?.address?.filter((address) => {
      return address?.isSelected === true;
    });
    console.log(selectedAddress)
    console.log(selectedAddress);
    res.render("user/checkout.ejs", {
      layout: "./layout/homeLayout.ejs",
      isLoggedIn: true,
      address: selectedAddress,
      cart: cart,
      coupons:coupons,
      wallet:wallet
    });
  } catch (error) {
    console.log(error);
  }
};



module.exports = {
  checkout
};
