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



module.exports = mongoose.model('Category', categorySchema, 'categories')

