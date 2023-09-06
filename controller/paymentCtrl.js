

const getPaymentPage=async(req,res,next)=>{
    try {
        res.render('user/payment',{layout:'./layout/userLayout.ejs'})
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    getPaymentPage
}