const addressModal = require("../model/addressModal");
const cartModal = require("../model/cartModal");
const orderModal = require("../model/orderModal");
const productModal = require("../model/productModal");
const razorpay = require("../config/razorpay");
const Razorpay = require("razorpay");
const walletModal=require('../model/walletModal');
const { disconnect } = require("mongoose");

const placeOrder = async (req, res, next) => {
  const userId = req.session.user._id;

  try {
    const cart = await cartModal.aggregate([
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products", // The name of the collection
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          _id: 0, // Keep the _id field
          items: {
            productId: "$products.product",
            quantity: "$products.quantity",
            price: { $arrayElemAt: ["$productDetails.price", 0] }, // Access the price field
          },
        },
      },
      {
        $group: {
          _id: null, // Group all documents into a single group
          items: { $push: "$items" }, // Push each item into the "items" array
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          items: 1, // Include the "items" field
        },
      },
    ]);

    console.log(cart[0].items);

    const address = await addressModal.findOne({ user: userId });
    // let selectedAddress=address.address.filter((address,index)=>{
    //     return address.isSelected===true;
    // })

    const orderProducts = cart[0].items;
    let grandTotal = req.body.totalAmountAfterCoupon;
    let paymentMode = req.body.paymentMode;
    let coupon=req?.body?.couponId;


    // selectedAddress=Object.assign({},selectedAddress)
    const order = await orderModal.create({
      user: userId,
      items: orderProducts,
      totalAmount: grandTotal,
      paymentMode: paymentMode,
      address: address._id,
      coupon:coupon
    });

    let errorMessages = [];

    // if(paymentMode==="COD"){

    const updatedProducts = await Promise.all(
      cart[0]?.items?.map(async ({ productId, quantity }) => {
        // Find the product by its ID
        const product = await productModal.findById(productId);

        if (!product) {
          errorMessages.push({ productId, message: "Product not found" });
          return null; // Return null for products not found
        }

        // Check if the stock is sufficient
        if (product.stock <= 0 || product.stock < quantity) {
          errorMessages.push({ productId, message: "Insufficient stock" });
          return null; // Return null for products with insufficient stock
        }

        if (!product) {
          return { productId, message: "Product not found" };
        }

        // Find the product by its ID and update the stock
        const updatedProduct = await productModal.findByIdAndUpdate(
          productId,
          {
            $inc: { stock: -quantity }, // Decrease the stock by the specified quantity
          },
          { new: true } // Return the updated document
        );

        return product;
      })
    );

    if (errorMessages.length > 0) {
      console.log(errorMessages);
      return res.status(400).json({ errors: errorMessages });
    }

    // }else
    if (paymentMode === "ONLINE") {
      const razorpay_order = await razorpay.orders.create({
        amount: order.totalAmount * 100,
        currency: "INR",
        receipt: order._id.toString(),
      });
      console.log(razorpay_order);
      order.paymentData = razorpay_order;
      await order.save();

      await cartModal.deleteOne({ user: req.session.user._id });
      return res
        .status(200)
        .json({ success: true, url: `/razor-pay?oid=${order._id}` });
    }

    if(paymentMode==="WALLET"){
      const wallet = await walletModal.updateOne(
        { user_id: req.session.user._id },
        { $inc: { amount: -order.totalAmount } }
      );
    }

    await cartModal.deleteOne({ user: req.session.user._id });
    res.status(200).json({ response: order });
  } catch (error) {
    console.log(error);
  }
};

const orderPage = async (req, res, next) => {
  try {
    res.render("user/order-page.ejs", {
      layout: "./layout/homeLayout.ejs",
      isLoggedIn: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const viewOrders = async (req, res, next) => {
  try {
    // const allOrders = (await orderModal.find({ user: req.session.user._id }))
    console.log(req.session.user._id)
    let allOrders = await orderModal.aggregate([
      {
      
         
          
  
        $match: {
          orderStatus: {
            $nin: ["Delivered", "Cancelled"], // Use $nin (not in) to exclude specific statuses
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
   console.log(allOrders)

   allOrders=allOrders.filter((order,index)=>{
      return order.user==req.session.user._id
   })

    res.render("user/view-orders", {
      layout: "./layout/homeLayout.ejs",
      isLoggedIn: true,
      orders: allOrders,
    });
  } catch (error) {
    console.log(error);
  }
};

const orderDetails = async (req, res, next) => {
  try {
    let orders = await orderModal
      .findById(req.params.id)
      .populate("items.productId")
      .populate("address");
     orders.items= orders?.items.filter((item,index)=>{
        return item.status!="Cancelled"
      })
    res.render("user/order-details.ejs", {
      layout: "./layout/homeLayout.ejs",
      isLoggedIn: true,
      orders: orders,
    });
  } catch (error) {
    console.log(error);
  }
};

const getOrderProducts=async (req,res,next) => {
  console.log("req.params.id")
  console.log(req.params.id)
  try {
    const order=await orderModal.findById(req.params.id).populate('items.productId')
    .populate('user').populate('address')
    console.log(order)
    res.render('admin/order-product',{layout:'./layout/adminLayout.ejs'
    ,isLoggedIn:true,order:order,req:req})
  } catch (error) {
    console.log(error)
  }
}

const cancelOrder = async (req, res, next) => {
  try {
    let orderStatus=req.body.status
    console.log(req.params, req.query);
    console.log(req.query.productId)

    const order=await orderModal.findById(req.params.id)
    
    if (!order) {
      throw new Error('Order not found');
    }


    if(req?.query?.productId){
    const itemToUpdate = order.items.find(item => item.productId.equals(req.query.productId));
    

    if (!itemToUpdate) {
      throw new Error('Item not found in the order');
    }

   

    if(orderStatus==="Cancelled"){
      const order=await orderModal.findById(req.params.id).populate('coupon');

      // If Coupon Applied ot Order

      let totalAmount

     let discountAmount=order?.coupon?.discountAmount
      
      if(!discountAmount) discountAmount=0;

      let cancelledQty=itemToUpdate.quantity-req.body.qty
      
      console.log(cancelledQty)
      console.log(req.body.qty)
      if(req?.body?.qty!=0){
        

        if(order?.coupon){
          console.log("("+itemToUpdate.price +"*"+itemToUpdate.quantity+"-"+cancelledQty+"*"+itemToUpdate.price+")-("+discountAmount+"/"+req.body.qty+")")
          totalAmount=(Number(itemToUpdate.price)*Number(itemToUpdate.quantity)-Number(cancelledQty)*Number(itemToUpdate.price))
                      -((discountAmount/req.body.qty))
        //  totalAmount=(itemToUpdate.price*req.body.qty)-(discountAmount/req.body.qty)
        }else{
          totalAmount=Number(itemToUpdate.price)*Number(itemToUpdate.quantity)-Number(cancelledQty)*Number(itemToUpdate.price)
        }
        itemToUpdate.quantity=req.body.qty;
       const updated=await orderModal.updateOne({_id:order._id},{$set:{totalAmount:Number(totalAmount)}})
        console.log(updated)

        // if(order?.paymentMode==="ONLINE" || "WALLET"){
        // let walletAmountAdd=(cancelledQty*itemToUpdate.price)-(discountAmount/cancelledQty)
        // console.log(walletAmountAdd)
        
        
        // const wallet = await walletModal.updateOne(
        //   { user_id: req.session.user._id },
        //   { $inc: { amount: walletAmountAdd } }
        // );
        // }

      }else{
        itemToUpdate.status = orderStatus;
      }

      let walletAmountAdd

      if(order?.paymentMode==="ONLINE" || "WALLET"){
        
        if(order?.coupon) walletAmountAdd=(cancelledQty*itemToUpdate.price)-(discountAmount/cancelledQty)
        else walletAmountAdd=(cancelledQty*itemToUpdate.price)
        console.log(walletAmountAdd)
        
        
        const wallet = await walletModal.updateOne(
          { user_id: req.session.user._id },
          { $inc: { amount: walletAmountAdd } }
        );
        }

      
    }

  }else{

    order.items.forEach(item => {
      item.status = orderStatus;
    });

    await orderModal.findByIdAndUpdate(req.params.id, {
        orderStatus: orderStatus,
       });

  }
    await order.save();


    // const updatedOrder = await orderModal.findByIdAndUpdate(req.params.id, {
    //   orderStatus: "Cancelled",
    // });
    res.status(200).json({ msg: "success" });
  } catch (error) {
    console.log(error);
  }
};

const viewOrdersAdmin = async (req, res, next) => {
  try {
    const ITEMS_PER_PAGE = 5;
    const orders = await orderModal.aggregate([
      {
        $match: {
          orderStatus: {
            $nin: ["Delivered", "Cancelled"], // Use $nin (not in) to exclude specific statuses
          },
        },
      },
      {
        $lookup: {
          from: "users", // The name of the collection
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          user: { $arrayElemAt: ["$user.username", 0] },
          orderStatus: 1,
          totalAmount: 1,
          isPaid: 1,
          productcount: { $size: "$items" },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

    // const orders2 = await orderModal.find({}).populate('items.productId').populate('user').populate('address')
    // console.log("orders2")
    // console.log(orders2)
    // console.log('orders2')



  //  const order2=await  orderModal.findById(req?.params?.id) // Replace 'orderId' with the actual order ID you want to query
  // .select('items.productId items.quantity items.status paymentMode')
  // .populate('items.productId', 'productname description price') // Replace with the fields you want to populate
  // .exec()



   // console.log(Math.ceil(orders.length / 5));

    res.render("admin/view-orders", {
      layout: "./layout/adminLayout.ejs",
      orders: orders,
    });
  } catch (error) {
    console.log(error);
  }
};

const editOrder = async (req, res, next) => {
  try {
    const updatedOrder = await orderModal.updateOne(
      { _id: req.body.orderId },
      { $set: { orderStatus: req.body.selectedStatus } }
    );
    console.log(updatedOrder);
    res.status(200).json({ msg: "success" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  placeOrder,getOrderProducts,
  orderPage,
  viewOrders,
  editOrder,
  orderDetails,
  cancelOrder,
  viewOrdersAdmin,
};
