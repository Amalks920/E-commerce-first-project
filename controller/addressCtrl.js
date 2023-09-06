const categoryModal = require("../model/categoryModal");

const addAddressPost= async (req, res) => {
    try {
        console.log(req.body)
      const category = await addressModel.find();
      const userId = req.session.user._id;
      const address = req.body.address;
      const city = req.body.city;
      const state = req.body.state;
      const pincode = req.body.pincode;
      const user = await usermodel.findByIdAndUpdate(
        userId,
        {
          $push: {
            address: {
              address: address,
              city: city,
              state: state,
              pincode: pincode,
            },
          },
        },
        { new: true }
      );

      res.render("users/adAddress", { user, category });
    } catch (error) {
      console.log(error.message);
    }
  }

  const getAddAddress=async(req,res,next)=>{
    try {
        res.render('user/addAddress',{layout:'./layout/userLayout.ejs'})
    } catch (error) {
        console.log(error)
    }
  }

  module.exports={
    addAddressPost,getAddAddress
  }