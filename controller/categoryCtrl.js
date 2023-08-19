const expressAsyncHandler = require("express-async-handler")
const sharp = require('sharp');
const Category=require('../model/categoryModal')

const addCategory=expressAsyncHandler(async(req,res,next)=>{
    res.render('admin/add-category',{layout:'./layout/adminLayout.ejs'})
})


const addCategoryPost=expressAsyncHandler(async (req, res) => {
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

      data.images.push(imageName);
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
        res.redirect("/admin/categorylist");
      }
      // res.status(201).json({ message: 'Category added successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },)




module.exports={
    addCategory,addCategoryPost
}