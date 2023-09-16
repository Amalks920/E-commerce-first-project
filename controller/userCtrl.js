const productModal = require("../model/productModal")
const userSchema = require("../model/userSchema")
const addressModal=require('../model/addressModal')

const getViewUsers=async(req,res,next)=>{
    try {

       const allUsers= await userSchema.find({})

       res.render('admin/view-users',{layout:'./layout/adminLayout.ejs',data:allUsers})
        
    } catch (error) {
        console.log(error)
    }
}

const blockUser=async(req,res,next)=>{
    console.log(req.params.id)

    try {
        const user=await userSchema.findById(req.params.id)
        isUserBlocked=user.isBlocked

        if(isUserBlocked){
         const result=await userSchema.updateOne({_id:req.params.id},{isBlocked:false})
         return res.send(req.params.id)
        }else{
        const result=await userSchema.updateOne({_id:req.params.id},{isBlocked:true})
        return res.send(req.params.id)
        }
    } catch (error) {
        console.log(error)
    }
    // try {
    //   const result=await userSchema.updateOne({_id:req.params.id},{isBlocked:true})
    //   console.log(result)
    //   res.send(req.params.id)
    // } catch (error) {
    //     console.log(error) 
    // }
}

//shop page on user side

const getShopPage=async(req,res,next)=>{

    try {
       let products=await productModal.find({ status: { $ne: "Delisted" } })
       res.render('user/shopPage.ejs',{layout:'./layout/homeLayout.ejs',isLoggedIn:true,products})
    } catch (error) {
        console.log(error)
    }
}

const userDashboard=async(req,res,next)=>{
    try {
        const addresses=await addressModal.findOne({user:req.session.user._id})
        res.render('user/add-or-view-address.ejs',{layout:'./layout/homeLayout.ejs',isUserDashboard:true,isLoggedIn:true,addresses:addresses})
    } catch (error) {
        console.log(error)
    }
}


module.exports={
    getViewUsers,blockUser,
    getShopPage,userDashboard
}