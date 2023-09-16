const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
	productCategory: {
		type: String,
		lowercase:true,
		required: [true, 'Please Enter Category name'],
		unique: [true, 'Please Enter diff Category name'],
		
	},
	categoryDescription: {
		type: String,
        required:true,
		lowercase:true
	},
	images: [{ type: String, required: true }],

	
})

// Define a pre-save middleware to convert values to lowercase
// categorySchema.pre('save', function (next) {
// 	this.productCategory = this.productCategory.toLowerCase();
// 	this.categoryDescription = this.categoryDescription.toLowerCase();
	// If you want to convert image URLs to lowercase as well, you can add that here
	// this.images = this.images.map(image => image.toLowerCase());
// 	next();
//   });

module.exports = mongoose.model('Category', categorySchema, 'categories')

