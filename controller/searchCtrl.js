const { filter } = require("lodash");
const categoryModal = require("../model/categoryModal");
const productModal = require("../model/productModal");

const searchPage=async(req,res,next)=>{
  let sort=req?.query?.sort;
  let categories=req?.query?.category?.split(',')
  let search=req?.query?.search
  // const finalElements = categories.slice(0, -1);
  // console.log(categories)
          const category=await categoryModal.find({})
        const productCountByCategory = await productModal.aggregate([
            {
              $group: {
                _id: "$productCategory", // Group products by category
                productCount: { $sum: 1 }, // Calculate the count of products in each group
              },
            },
          ]);
    try {
        let products
        if(!categories){
          products=await productModal.find({})
          categories=[]
        }else if(categories){
          products=await  productModal.aggregate([
            {
              $lookup: {
                from: 'categories', // Replace with the actual name of the referenced collection
                localField: 'productCategory', // Replace with the field in the current collection that references the other collection
                foreignField: '_id', // Replace with the field in the referenced collection to match against
                as: 'category' // Name for the array of matching documents from the referenced collection
              }
            },
            {
              $match: {
                'category.productCategory': { $in: categories }
              }
            }
          ]) 
        }

        if(sort=='lowtohigh'){
         products= products.sort(function(a,b){
            return a.price-b.price
          })
        }else if(sort=='hightolow'){
          products= products.sort(function(a,b){
            return b.price-a.price
          })
        }

        if(search){
         products=products.filter((product,index)=>{
            return product.productname.startsWith(search)
          })
        }

         req.session.filteredProducts=products



        res.render('user/searchPage',{layout:'./layout/homeLayout',
            products:req.session.filteredProducts,
            category,
            categories,
            productCountByCategory,
            isLoggedIn:true,
            searchInput:search
        })

        
    } catch (error) {
        console.log(error.message)
    }
}

const filteredProducts=async(req,res,next)=>{
  try {
    console.log(req.body)
   const filtered=await  productModal.aggregate([
      {
        $lookup: {
          from: 'categories', // Replace with the actual name of the referenced collection
          localField: 'productCategory', // Replace with the field in the current collection that references the other collection
          foreignField: '_id', // Replace with the field in the referenced collection to match against
          as: 'category' // Name for the array of matching documents from the referenced collection
        }
      },
      {
        $match: {
          'category.productCategory': { $in: req.body.checkedValues }
        }
      }
    ])
    console.log(filtered)
   
    res.render('user/searchPage',{layout:'./layout/homeLayout',
    products:filtered,
    category,
    productCountByCategory,
    isLoggedIn:true
})
    res.status(200).json({msg:'success'})
  } catch (error) {
    console.log(error)
  }
}


module.exports={
    searchPage,filteredProducts
}