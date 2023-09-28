const bannerModal=require('../model/bannerModal'); 
const sharp = require('sharp');
const offerModal = require('../model/offerModal');
const { default: mongoose } = require('mongoose');

const getBannerManagementPage=async(req,res,next)=>{
    try {
        const banners=await bannerModal.find({});
        const productOffers=await offerModal.find({})
        res.render('admin/banner',{layout:'./layout/adminLayout.ejs',productOffers:productOffers,banner:banners})
    } catch (error) {
        console.log(error)
    }
}

const addBannerPost= async (req, res) => {
    const { bannername,offer } = req.body;
    let images = req.files[0].filename
            let imageName = `cropped_${images}`;
      await sharp(`./public/images/uploads/${images}`)
          .resize(1200, 1000, { fit: "cover" })
          .toFile(`./public/images/uploads/${imageName}`); 
      images=imageName  
    try {
      
      const banner = await bannerModal.create({bannername,images,offer});
      if (banner) {
        const allBanners = await bannerModal.find(); 
        res.redirect("/admin/banner-management");
      }
       } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
    
  }


const getEditBanner=async(req,res,next)=>{
  try {
      const banners=await bannerModal.findById(req.params.bannerId);
      const productOffers=await offerModal.find({})
      res.render('admin/edit-banner',{layout:'./layout/adminLayout.ejs',productOffers:productOffers,banner:banners})
  } catch (error) {
      console.log(error)
  }
}

const editBanner=async (req, res) => {
  try {
    console.log(req.body)
    const banner = await bannerModal.findById(req.params.bannerId);
    if (!banner) {
      return res.status(404).send('Banner not found');
    }

    const { bannername,offer } = req.body;
    
    let images = req.files[0].filename
            let imageName = `cropped_${images}`;
      await sharp(`./public/images/uploads/${images}`)
          .resize(1200, 1000, { fit: "cover" })
          .toFile(`./public/images/uploads/${imageName}`); 
      images=imageName  

      let updateFields={
        offer:new mongoose.Types.ObjectId(offer),
        bannername:bannername,
        images:images
      }

// Use findOneAndUpdate to update the document
await bannerModal.findOneAndUpdate({ _id: req.params.bannerId }, updateFields, { new: true });

// The { new: true } option returns the updated document after the update
// If you want to return the original document before the update, omit this option


    // Redirect to a page or send a response indicating success
    res.redirect('/admin/banner-management'); // Redirect to a banners listing page
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
}



module.exports={
    getBannerManagementPage,
    addBannerPost,getEditBanner,
    editBanner
}