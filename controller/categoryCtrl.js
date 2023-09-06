const expressAsyncHandler = require("express-async-handler")
const sharp = require('sharp');
const Category=require('../model/categoryModal');
const categoryModal = require("../model/categoryModal");

const addCategory=expressAsyncHandler(async(req,res,next)=>{
  try {
    const allCategory=await categoryModal.find({})
    console.log(allCategory)
    res.render('admin/add-category',{layout:'./layout/adminLayout.ejs',data:allCategory})
  } catch (error) {
    console.log(error)
  }
})


const addCategoryPost=async (req, res) => {
    const { productCategory, categoryDescription } = req.body;
    
    const data = {
      productCategory: productCategory,
      categoryDescription: categoryDescription,
    };
    // let category = req.body;
    data.images = [];
    console.log(req.files)
    if (req.files.length > 0) {
  
    for (let file of req.files) {
      const imageName = `cropped_${file.filename}`;
      await sharp(file.path)
          .resize(500, 600, { fit: "cover" })
          .toFile(`./public/images/uploads/${imageName}`);

      data.images[0]=imageName;
      }
      // category.images = images;    
    } else {
      return res.status(400).json({ success: false, message: 'Please choose product image files' });
    }

    try {
      // Check if the category already exists
      const existingCategory = await Category.findOne({ productCategory });
      if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" });
      }

      // Save the new category to the database
      const category = await Category.create(data);
      if (category) {
        const allCategories = await Category.find(); // Fetch all categories from the database
        res.redirect("/admin/category/view-category");
      }
      // res.status(201).json({ message: 'Category added successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

const viewCategory=async(req,res,next)=>{
  try {
    const allCategory=await categoryModal.find({})
    console.log(allCategory)
    res.render('admin/view-category',{layout:'./layout/adminLayout.ejs',data:allCategory})
  } catch (error) {
    console.log(error)
  }
}

const getEditCategory=async(req,res,next)=>{
  
  try {
    const category=await categoryModal.findById(req.params.id)
    res.render('admin/edit-category',{layout:'./layout/adminLayout.ejs',data:category})
  } catch (error) {
    console.log(error.message)
  }
}

const editCategoryPost=async(req,res,next)=>{

    try { const category = req.body;
      const categoryId = req.params.id;
      console.log(categoryId)
      console.log(category)

      const images = [];
      if (req.files && req.files.length > 0) {
        for (let file of req.files) {
          const imageName = `cropped_${file.filename}`;
    
          await sharp(file.path)
            .resize(500, 600, { fit: 'cover' })
            .toFile(`./public/images/uploads/${imageName}`);
    
          images.push(imageName);
        }
        // Add the new cropped image filenames to the product.images array
        // product.images = images;
      }
      // Update the product with the new data, including the images array if available
      await categoryModal.findByIdAndUpdate(categoryId, {images:images}, { new: true });
      const updatedCategory = await categoryModal.findById(categoryId);
      updatedCategory.productCategory = req.body.productCategory;
      updatedCategory.categoryDescription = req.body.categoryDescription;
      await updatedCategory.save();
      res.redirect("/admin/category/view-category");
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: 'Server Error' });
    }

}

const deleteCategory=async(req,res,next)=>{
  console.log(req.params.id)
  try {
  const deletedCategory=await categoryModal.findByIdAndDelete(req.params.id)
  res.status(201).send(req.params.id)

  } catch (error) {
    console.log(error)
  }
}




module.exports={
    addCategory,addCategoryPost,
    viewCategory,getEditCategory,
    editCategoryPost,deleteCategory
}