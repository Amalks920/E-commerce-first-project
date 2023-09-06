const userSchema = require("../model/userSchema")

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


module.exports={
    getViewUsers,blockUser
}