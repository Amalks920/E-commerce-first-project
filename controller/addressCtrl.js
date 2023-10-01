const categoryModal = require("../model/categoryModal");
const addressModel=require('../model/addressModal');
const walletModal = require("../model/walletModal");

const addAddressPost= async (req, res) => {
    try {
        console.log(req.body)
      const user = req.session.user._id;
      const address = req.body.address;
      const city = req.body.city;
      const state = req.body.state;
      const pincode = req.body.pincode;
      const mobileNumber=req.body.mobileNumber
      
      let newAddress={
        user:user,address:address,
        city:city,state:state,
        pincode:pincode,mobileNumber:mobileNumber
      }

      const isAddressExist = await addressModel.findOne({user:user});
      console.log("isAddressExist")
      console.log(isAddressExist)

      if(!isAddressExist){
       const newAddress=await addressModel.create(
        {
          user:user,address:[{address:address,city:city,mobileNumber:mobileNumber,state:state,
          pincode:pincode} ]
        }
      );
      res.redirect('/user-dashboard')
      // res.render("user/add-or-view-address", {layout:'./layout/homeLayout.ejs', user:user, addresses:newAddress });

      }else{
       const updatedAddress= await addressModel.findByIdAndUpdate(isAddressExist._id,
          {$push:{address:newAddress}},
          {new:true}
          )
          console.log(updatedAddress)
          res.redirect('/user-dashboard')
          // res.render("user/add-or-view-address", {layout:'./layout/homeLayout.ejs', user:user, addresses:updatedAddress });
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  const getAddAddress=async(req,res,next)=>{
    // try {
    //   const addresses=await addressModel.findOne({user:req.session.user._id})
    //     res.render('user/addAddress',{layout:'./layout/homeLayout.ejs',addresses:addresses,isLoggedIn:true})
    // } catch (error) {
    //     console.log(error)
    // }
  }

  const selectAddress=async(req,res,next)=>{
    const index=req.body.index
    console.log(index)
    let addressIndexToUpdate
    try {
        await addressModel.updateOne(
        {user:req.session.user._id},
        {$set:{[`address.$[].isSelected`]:false}}
      )

      const updatedAddress=await addressModel.updateOne(
        {user:req.session.user._id},
        {$set:{[`address.${index}.isSelected`]:true}}
      )
      console.log(updatedAddress)
      res.status(201).json({data:updatedAddress})
    } catch (error) {
      console.log(error)
    }
  }

  const deleteAddress=async(req,res,next)=>{
    let user=req.session.user._id;
    let addressIndexToDelete=Number(req.body.index)
    try {
      const updateUser=await addressModel.findOne(
        {user:user}
      )
     
      console.log(updateUser)
      if (addressIndexToDelete >= 0 && addressIndexToDelete < updateUser.address.length) {
        updateUser.address.splice(addressIndexToDelete, 1);
       
      }else{
        res.status(201).json({msg:'no address to delete'})
      }
      await updateUser.save();
      console.log("updateUser updateUser updateUser updateUser updateUser")
      console.log(updateUser)
      res.status(201).json({data:updateUser})
    } catch (error) {
      console.log(error)
    }
  }


  const userOverview=async(req,res,next)=>{
    let userId=req.session.user._id
    try {
        const wallet=await walletModal.findOne({user_id:userId}).populate('user_id')
        console.log(wallet)
        res.render('user/user-dashboard.ejs',{layout:'./layout/homeLayout.ejs',isLoggedIn:true,wallet:wallet})
    } catch (error) {
      res.redirect('user/404')
    }
  }

  module.exports={
    addAddressPost,getAddAddress,
    deleteAddress,selectAddress,
    userOverview
  }