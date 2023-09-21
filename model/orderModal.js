const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
	},
	items: [
		{
			productId: {
				type: mongoose.Schema.ObjectId,
				ref: 'Product',
				required: true,
			},
            quantity: {	
                type: Number,
                required: true,
                min: 0,
            },
			price: {
				type: Number,
				required: true,
				min: 0,
			},
			status:{
				type: String,
				enum: ['pending','Delivered','placed','Cancelled'],
				default: 'pending',
			},
			
		},
	],
	orderStatus: {
		type: String,
		enum: ['pending','Delivered','placed','Cancelled'],
		default: 'pending',
	},
	totalAmount: {
		type: Number,
		required: true,
		min: 0,
	},
	paymentMode: {
		type: String,
		required: true,
	},
    isPaid: {
		type: Boolean,
		default: false,
	},
    paymentData:{
        type: Object,
    },
	address: {
	 	type: mongoose.Schema.ObjectId,
		ref:'Address'
	},

	coupon: {
		type: mongoose.Schema.ObjectId,
		ref: 'Coupon',
	  },
	  discountAmount: {
		type: Number,
		default: 0,
	  },
	//   finalPrice: {
	// 	type: Number,
	// 	required: true,
	
	//   },
	createdAt: {
		type: Date,
		default: Date.now,
	  }
	
})


module.exports = mongoose.model('Order', orderSchema, 'orders')