const addressModal = require("../model/addressModal");
const cartModal = require("../model/cartModal");
const couponModal=require('../model/couponModal')

const checkout = async (req, res, next) => {
  try {
    const address = await addressModal.findOne({ user: req.session.user._id });
    const cart = await cartModal.findOne({ user: req.session.user._id })
                    .populate({ path: "products.product" });

    const coupons=await couponModal.find({})

    const selectedAddress = address?.address?.filter((address) => {
      return address?.isSelected === true;
    });
    console.log(selectedAddress);
    res.render("user/checkout.ejs", {
      layout: "./layout/homeLayout.ejs",
      isLoggedIn: true,
      address: selectedAddress,
      cart: cart,
      coupons:coupons
    });
  } catch (error) {
    console.log(error);
  }
};



module.exports = {
  checkout
};
