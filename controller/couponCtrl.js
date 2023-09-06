const couponModal = require("../model/couponModal")

const getCoupon=async(req,res,next)=>{
    res.render('user/coupon',{layout:'./layout/userLayout'})
}

const addCoupon=async(req,res,next)=>{
    try {
        res.render('admin/add-coupon',{layout:'./layout/adminLayout.ejs'})
    } catch (error) {
        console.log(error)
    }
}

const addCouponPost=async(req, res,next) => {
    try {
          let coupon = req.body;
          console.log(coupon)
          await couponModal.create(coupon);
          res.redirect("/admin/view-coupon");
    } catch (error) {
      console.log(error.message);
    }
  }

const viewCouponAdmin=async(req,res,next) => {
    try {
        const coupon=await couponModal.find({})
       res.render('admin/view-coupon',{layout:'./layout/adminLayout.ejs',data:coupon}) 
    } catch (error) {
        console.log(error)
    }
}
module.exports={
    getCoupon,
    addCoupon,
    addCouponPost,
    viewCouponAdmin
}