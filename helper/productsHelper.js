const orderModal = require("../model/orderModal")


const findReturnedPrdoucts=()=>{
    return new Promise(async (resolve,reject)=>{
        try {
      //  let returnedProducts=await orderModal.find({orderStatus:'Delivered'}).populate('items.productId')
            let returnedProducts=await orderModal.aggregate([
                {
                    $unwind: '$items'
                  },
                  {
                    $match: {
                      'items.isReturned': true // Filter items with isReturned true
                    }
                  },
                  {
                    $group: {
                      _id: {
                        user: '$user',
                        productId: '$items.productId'
                      },
                      quantity: {
                        $sum: '$items.quantity'
                      }
                    }
                  },
                  {
                    $lookup: {
                      from: 'products',
                      localField: '_id.productId',
                      foreignField: '_id',
                      as: 'productData'
                    }
                  },
                  {
                    $unwind: '$productData'
                  },
                  {
                    $project: {
                      _id: 0,
                      productId: '$_id.productId',
                      user: '$_id.user',
                      quantity: 1,
                      productData: 1
                    }
                  }
                
                
            ])

          resolve(returnedProducts)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports={
    findReturnedPrdoucts
}