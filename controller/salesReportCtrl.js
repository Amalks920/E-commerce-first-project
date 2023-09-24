const orderModal = require("../model/orderModal")
const moment=require('moment')


const getSalesReport=async(req,res,next)=>{
    try {
        res.render('admin/sales-report',{layout:'./layout/adminLayout.ejs'})
    } catch (error) {
        console.log(error)
    }
}


const salesReport=async (req, res, next) => {

    try {


 let {from,to}=req.query
    

    const today = moment().format('YYYY-MM-DD')
   
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
   
    const last7days = moment().subtract(7, 'days').format('YYYY-MM-DD')
   
    const last30days = moment().subtract(30, 'days').format('YYYY-MM-DD')
   
    const lastYear = moment().subtract(1, 'years').format('YYYY-MM-DD')
   
   
    if (!from || !to) {
    from = last30days
   
    to = today
   
    }
   
   
    if (from > to) [from, to] = [to, from]
   
    to += 'T23:59:59.999Z'
   
    const orders = await orderModal.find({ createdAt: { $gte: from, $lte: to }, orderStatus: 'Delivered' }).populate(
   
    'user'
   
    )

 from = from.split('T')[0]
 to = to.split('T')[0]
 const netTotalAmount = orders.reduce((acc, order) => acc + order.totalAmount, 0)
 const netFinalAmount = orders.reduce((acc, order) => acc + order.finalAmount, 0)
 const netDiscount = orders.reduce((acc, order) => acc + order.discount, 0)
 const dateRanges = [
   
  { text: 'Today', from: today, to: today },          
  { text: 'Yesterday', from: yesterday, to: yesterday },          
  { text: 'Last 7 days', from: last7days, to: today },          
  { text: 'Last 30 days', from: last30days, to: today },
  { text: 'Last year', from: lastYear, to: today },
   
    ]

  console.log(orders, from, to, dateRanges, netTotalAmount, netFinalAmount, netDiscount)
   
    res.render('admin/sales-report', { layout:'./layout/adminLayout.ejs', orders, from, to, dateRanges, netTotalAmount, netFinalAmount, netDiscount })          
    } catch (error) {
     console.log(error)
    next(error)
   
    }
   
    }


module.exports={
    getSalesReport,salesReport
}