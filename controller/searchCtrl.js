const categoryModal = require("../model/categoryModal");
const productModal = require("../model/productModal");

const searchPage=async(req,res,next)=>{
    try {
        const products=await productModal.find({})
        const category=await categoryModal.find({})
        const productCountByCategory = await productModal.aggregate([
            {
              $group: {
                _id: "$productCategory", // Group products by category
                productCount: { $sum: 1 }, // Calculate the count of products in each group
              },
            },
          ]);

        res.render('user/searchPage',{layout:'./layout/userLayout',
            products:products,
            category,
            productCountByCategory
        })

        
    } catch (error) {
        console.log(error.message)
    }
}



module.exports={
    searchPage
}