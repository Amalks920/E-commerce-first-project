const couponModal = require("../model/couponModal")
const {body, validationResult}=require('express-validator')

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
        const validationRules = [
            body('code').notEmpty().trim().escape(),
            body('discountType').notEmpty().trim().escape(),
            body('description').notEmpty().trim().escape(),
            body('discountAmount').notEmpty().isNumeric().toFloat(),
            body('minimumAmount').notEmpty().isNumeric().toFloat(),
            body('maxRedemptions').notEmpty().isNumeric().toInt(),
            body('expirationDate').notEmpty().isISO8601().toDate(),
        ];
        console.log(validationRules)
        await Promise.all(validationRules.map(validation => validation.run(req)));

                // Check for validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }


          let coupon = req.body;
          
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