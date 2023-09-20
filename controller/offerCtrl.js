const offerModal = require("../model/offerModal")
const { validationResult } = require('express-validator');
const validator = require('validator');


const getAddOffers=async(req,res,next)=>{
    try {
        res.render('admin/add-offers',{layout:'./layout/adminLayout.ejs'})
    } catch (error) {
        console.log(error)
    }
}

const getEditOffers=async(req,res,next)=>{
  try {
    const offerId=req.params.offerId;
    const offer=await offerModal.findById(offerId)
      res.render('admin/edit-offers',{layout:'./layout/adminLayout.ejs',offer})
  } catch (error) {
      console.log(error)
  }
}

const viewOffers=async(req,res,next)=>{
    try {
        const offers=await offerModal.find({})
        res.render('admin/view-offers',{layout:'./layout/adminLayout.ejs',offers:offers})
    } catch (error) {
        console.log(error)
    }
}

const addOffer=async(req,res,next)=>{


      // Validate and sanitize input fields
      console.log(req.body)
      const {
        offertitle,
        offerdescription,
        offerType,
        discountType,
        discountAmount,
        expirationDate,
      } = req.body;
    
      // Create an array of validation errors
      const errors = [];
    
      if (!validator.isLength(offertitle, { min: 5, max: 100 })) {
        errors.push('Offer title must be between 5 and 100 characters.');
      }
    
      if (!validator.isLength(offerdescription, { min: 10 })) {
        errors.push('Offer description must be at least 10 characters.');
      }
    
      if (!['Category', 'Product'].includes(offerType)) {
        errors.push('Invalid offer type.');
      }
    
      if (!['Percentage', 'Fixed'].includes(discountType)) {
        errors.push('Invalid discount type.');
      }
    
      if (!validator.isNumeric(discountAmount.toString())) {
        errors.push('Discount amount must be a valid number.');
      } else if (discountAmount < 0 || discountAmount > 2000) {
        errors.push('Discount amount must be between 0 and 2000.');
      }
    
      if (!validator.isISO8601(expirationDate)) {
        console.log('hello')
        errors.push('Invalid expiration date format.');
      } 
    
      // Check if there are validation errors
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
    
      try {
        // If validation passes, create the offer
        await offerModal.create({
          offertitle,
          offerdescription,
          offerType,
          discountType,
          discountAmount,
          expirationDate,
        });
        
        res.redirect('/admin/view-offers');
      } catch (error) {offertitle
        console.log(error);
        res.status(500).send('Internal Server Error');
      }offertitle
    }

const editOffer=async(req,res,next)=>{
  const offerId=req.params.offerId
  try {
    await offerModal.updateOne({_id:offerId},req.body)
    res.redirect('/admin/view-offers')
  } catch (error) {
    console.log(error)
  }
}


module.exports={
    getAddOffers,viewOffers,
    addOffer,editOffer,
    getEditOffers
}