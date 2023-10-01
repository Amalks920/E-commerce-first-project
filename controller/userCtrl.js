const productModal = require("../model/productModal")
const userSchema = require("../model/userSchema")
const addressModal=require('../model/addressModal')

const getViewUsers=async(req,res,next)=>{
    try {
        let ITEMS_PER_PAGE=6;
        let currentPage=req?.query?.page;
       const users= await userSchema.find({})
       const usersLength=users.length
       const BTN_NO=Math.ceil(usersLength/ITEMS_PER_PAGE)
       const allUsers=await userSchema.find({}).skip(currentPage*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)

       res.render('admin/view-users',{layout:'./layout/adminLayout.ejs',data:allUsers,BTN_NO})
        
    } catch (error) {
        res.redirect('/404')
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
        res.redirect('/404')
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
        res.redirect('/404')
    }
}

const userDashboard=async(req,res,next)=>{
    try {
        const addresses=await addressModal.findOne({user:req.session.user._id})
        console.log(addresses)
        res.render('user/add-or-view-address.ejs',{layout:'./layout/homeLayout.ejs'
        ,isUserDashboard:true,isLoggedIn:true,
        addresses:addresses})
    } catch (error) {
        console.log(error)
        res.redirect('/404')
    }
}


module.exports={
    getViewUsers,blockUser,
    getShopPage,userDashboard
}