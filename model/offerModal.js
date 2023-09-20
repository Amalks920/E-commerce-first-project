const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  offertitle: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase:true
  },
  offerdescription: {
    type: String,
    required: true,
    lowercase:true
  },
  offerType: {
    type: String,
    enum: ['Category', 'Product'],
    required: true,
  },
  discountType: {
    type: String,
    enum: ['Percentage', 'Fixed'],
    required: true,
  },
  discountAmount: {
    type: Number,
    required: true,
    min: 0,
    max: 2000,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Offer', couponSchema,'offers')
