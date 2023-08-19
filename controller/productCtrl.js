const expressAsyncHandler = require("express-async-handler");
const sharp = require('sharp');
const moment = require("moment");
const Product=require('../model/productModal');
const categoryModal = require("../model/categoryModal");



const getProduct=expressAsyncHandler(async(req,res,next)=>{
    res.render('admin/product',{layout:'./layout/adminLoginLayout.ejs'})
})

const getAddProduct=expressAsyncHandler(async(req,res,next)=>{
  try {
    const category = await categoryModal.find();
    res.render('admin/add-products',{layout:'./layout/adminLayout',data:category})

  } catch (error) {
    
  }
})


const addProduct=expressAsyncHandler(async (req, res) => {
    let product = req.body;
    const images = [];
    console.log(req.body,req.files)
    if (req.files.length > 0) {
    for (let file of req.files) {
      const imageName = `cropped_${file.filename}`;
      await sharp(file.path)
          .resize(920, 920, { fit: "cover" })
          .toFile(`./public/images/uploads/${imageName}`);

      images.push(imageName);
      }
      product.images = images;    
    } else {
      return res.status(400).json({ success: false, message: 'Please choose product image files' });
    }

    try {console.log(product)
    await Product.create(product);
    res.redirect("/admin/product/add-product");
    } catch (error) {
      console.log(error.message);
    }
  },)



module.exports={
    addProduct,getProduct,
    getAddProduct,addProduct
}