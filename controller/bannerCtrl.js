const bannerModal=require('../model/bannerModal'); 
const sharp = require('sharp');

const getBannerManagementPage=async(req,res,next)=>{
    try {
        res.render('admin/banner',{layout:'./layout/adminLayout.ejs'})
    } catch (error) {
        console.log(error)
    }
}

const addBannerPost= async (req, res) => {
    const { bannername } = req.body;
    let images = req.files[0].filename
            let imageName = `cropped_${images}`;
      await sharp(`./public/images/uploads/${images}`)
          .resize(1200, 1000, { fit: "cover" })
          .toFile(`./public/images/uploads/${imageName}`); 
      images=imageName  
    try {
      
      const banner = await bannerModal.create({bannername,images});
      if (banner) {
        const allBanners = await bannerModal.find(); 
        res.redirect("/admin/banner-management");
      }
       } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
    
  }



module.exports={
    getBannerManagementPage,
    addBannerPost
}