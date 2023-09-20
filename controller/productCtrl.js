const expressAsyncHandler = require("express-async-handler");
const sharp = require('sharp');
const moment = require("moment");
const { body, validationResult } = require('express-validator');
const Product=require('../model/productModal');
const categoryModal = require("../model/categoryModal");
const productModal = require("../model/productModal");
const offerModal=require('../model/offerModal');



const getProduct=expressAsyncHandler(async(req,res,next)=>{
    res.render('admin/product',{layout:'./layout/adminLoginLayout.ejs'})
})

const getAddProduct=expressAsyncHandler(async(req,res,next)=>{
  try {
    const category = await categoryModal.find();
    const productOffers = await offerModal.find({ offerType: 'Product' });
    res.render('admin/add-products',{layout:'./layout/adminLayout',data:category,productOffers:productOffers})

  } catch (error) {
    console.log(error)
  }
})


// const addProduct=expressAsyncHandler(async (req, res) => {
//     let product = req.body;
//     const images = [];
//     console.log(req.body,req.file)
//     if (req.files.length > 0) {
//     for (let file of req.files) {
//       const imageName = `cropped_${file.filename}`;
//       await sharp(file.path)
//           .resize(920, 920, { fit: "cover" })
//           .toFile(`./public/images/uploads/${imageName}`);

//       images.push(imageName);
//       }
//       product.images = images;    
//     } else {
//       return res.status(400).json({ success: false, message: 'Please choose product image files' });
//     }

//     try {console.log(product)
//     await Product.create(product);
//     res.redirect("/admin/product/add-product");
//     } catch (error) {
//       console.log(error.message);
//     }
//   },)

  const addProduct = expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
  
    let product = req.body;
    const images = [];
  
    if (req.files.length > 0) {
      for (let file of req.files) {
        const imageName = `cropped_${file.filename}`;
        await sharp(file.path)
          .resize(920, 920, { fit: 'cover' })
          .toFile(`./public/images/uploads/${imageName}`);
  
        images.push(imageName);
      }
      product.images = images;
    } else {
      return res
        .status(400)
        .json({ success: false, message: 'Please choose product image files' });
    }

    //check for offfer
    if(req.body.offer){
      const productOffer=await offerModal.findById(req.body.offer)
      console.log("productOffer");
      if(productOffer.discountType==="Fixed"){
        req.body.offerPrice=req.body.price-productOffer.discountAmount
      }else if(productOffer.discountType==="Percentage"){
        req.body.offerPrice=req.body.price-(req.body.price*(productOffer.discountAmount/100))
      }
    }
    
  
    try {
      await Product.create(product);
      res.redirect('/admin/product/add-product');
    } catch (error) {
      console.log(error.message);
    }
  });
  
 
  

const getViewProducts=expressAsyncHandler(async(req,res,next)=>{

  try {

    const products=await productModal.find({})
    res.render('admin/view-products',{layout:'./layout/adminLayout',data:products})

  } catch (error) {
    console.log(error.message)
  }
})

const deleteProduct=expressAsyncHandler(async(req,res,next)=>{

})

const getProductPage=expressAsyncHandler(async(req,res,next)=>{
  try {
    console.log(req?.params?.id)
    const product=await productModal.findById(req?.params?.id)
    res.render('user/product-page',{layout:'./layout/homeLayout.ejs',data:product,isLoggedIn:true})
  } catch (error) {
    console.log(error.message)
  }
})

const getEditProduct=async(req,res,next)=>{
  try {
    const productOffers = await offerModal.find({ offerType: 'Product' });
    const category = await categoryModal.find();
    const product=await productModal.findById(req.params.id)

    res.render('admin/edit-product',{layout:'./layout/adminLayout',
    data:category,product:product,productOffers:productOffers})

  } catch (error) {
    console.log(error)
  }
}

const editProductP=async(req,res,next)=>{
  console.log('hello')
console.log(req.body)
}

const deleteImage=async (req, res) => {
  const { id, file } = req.body
  try {
    await productModal.findByIdAndUpdate(id, { $pull: { images: file } })
    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ success: false, message: 'Image deleting failed' })
  }
}

const editProductPost=async (req, res,next) => {
  const id = req.body.id;
  console.log(id)
  const product = req.body;
  const images = [];
  console.log(product)

  if (req.files && req.files.length > 0) {
    for (let file of req.files) {
      const imageName = `cropped_${file.filename}`;

      await sharp(file.path)
        .resize(920, 920, { fit: 'cover' })
        .toFile(`./public/images/uploads/${imageName}`);

      images.push(imageName);
    }
    // Add the new cropped image filenames to the product.images array
    // product.images = images;
  }
  // Update the product with the new data, including the images array if available
  await productModal.findByIdAndUpdate(id, { $push: { images: { $each: images } } }, { new: true });
  // await productlist.findByIdAndUpdate(id, { $set: { ...product } }, { new: true });
  try {
         if (req.body.status === '2') {
           await productModal.findByIdAndUpdate(id, { $set: { ...product, status: 'Delisted' } });
         } else {
       await productModal.findByIdAndUpdate(id, { $set: { ...product, status: 'Listed' } });
        }

    //check for offfer
    if(req.body.offer){
      const productOffer=await offerModal.findById(req.body.offer)
      
      if(productOffer.discountType==="Fixed"){
        req.body.offerPrice=req.body.price-productOffer.discountAmount
        await productModal.updateOne({_id:id},{offerPrice:req.body.offerPrice})
      }else if(productOffer.discountType==="Percentage"){
        req.body.offerPrice=req.body.price-(req.body.price*(productOffer.discountAmount/100))
        await productModal.updateOne({_id:id},{offerPrice:req.body.offerPrice})
      }
    }

        res.redirect('/admin/view-products');
      } catch (error) {
        console.log(error.message);
      }
    }


module.exports={
    addProduct,getProduct,
    getProductPage,editProductP,
    getAddProduct,addProduct,
    getViewProducts,deleteProduct,
    getEditProduct,editProductPost,
    deleteImage
}