
const categoryModal = require("../model/categoryModal");
const productModal = require("../model/productModal");

const searchPage=async(req,res,next)=>{
  let NO_OF_PRODUCTS;
  let sort=req?.query?.sort;
  let categories=req?.query?.category?.split(',')
  let search=req?.query?.search
  let PAGE=req?.query?.page;
  let from=req?.query?.from;
  let to=req?.query?.to;
  console.log(PAGE,PAGE,PAGE,PAGE,PAGE )
 
          const category=await categoryModal.find({})
          
          const allProducts=await productModal.find({status:{$ne:"Delisted"}})
          console.log(allProducts.length)
          NO_OF_PAGES=allProducts.length/9;
          console.log(NO_OF_PAGES)
          console.log("NO_OF_PAGES")
 
          
    try {
        let products
        if(!categories){
          console.log('! cat ====>')
          products=await productModal.aggregate([
            {
              $skip:PAGE*9
            },
            {
              $limit:9
            },

          ])

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
            },
            {
              $skip:PAGE*9
            },
            {
                $limit: 9,
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

        if(from && to){
          products=products.filter((product,index)=>{
            return product?.price>=from && product?.price<=to
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
            isLoggedIn:true,
            searchInput:search,
            NO_OF_PAGES:NO_OF_PAGES,
            req
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
      },
      {
        $limit: 9,
      }
    ])
    console.log(filtered.length)
   
    res.render('user/searchPage',{layout:'./layout/homeLayout',
    products:filtered,
    category,
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