const productModal = require("../model/productModal")

const pagination=()=>{
    return new Promise((resolve,reject)=>{
        try {
            
        } catch (error) {
            reject(error)
        }
    })
}

const findProducts= ()=>{

    return new Promise(async(resolve,reject)=>{
        try {
        const products=await productModal.find({ status: { $ne: "Delisted" } })
        resolve(products)
        return docu
        } catch (error) {
            reject(error)
        }
    })

}


module.exports={
    pagination,findProducts
}