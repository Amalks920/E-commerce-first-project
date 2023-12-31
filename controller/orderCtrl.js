const addressModal = require("../model/addressModal");
const cartModal = require("../model/cartModal");
const orderModal = require("../model/orderModal");
const productModal = require("../model/productModal");
const razorpay = require("../config/razorpay");
const Razorpay = require("razorpay");
const walletModal = require("../model/walletModal");
const { disconnect } = require("mongoose");
const couponModal = require("../model/couponModal");
const { findReturnedPrdoucts } = require("../helper/productsHelper");


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
            offerPrice: { $arrayElemAt: ["$productDetails.offerPrice", 0] },
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

   

    const address = await addressModal.findOne({ user: userId });
    // let selectedAddress=address.address.filter((address,index)=>{
    //     return address.isSelected===true;
    // })

    const orderProducts = cart[0].items;
    let grandTotal = req.body.totalAmountAfterCoupon;
    let paymentMode = req.body.paymentMode;
    let coupon = req?.body?.couponId;

    // selectedAddress=Object.assign({},selectedAddress)
    const order = await orderModal.create({
      user: userId,
      items: orderProducts,
      totalAmount: grandTotal,
      paymentMode: paymentMode,
      address: address._id,
      coupon: coupon,
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

      await couponModal.updateOne(
        { _id: coupon },
        { $inc: { maxRedemptions: -1 } }
      );
      await cartModal.deleteOne({ user: req.session.user._id });
      return res
        .status(200)
        .json({ success: true, url: `/razor-pay?oid=${order._id}` });
    }

    if (paymentMode === "WALLET") {
      const wallet = await walletModal.updateOne(
        { user_id: req.session.user._id },
        { $inc: { amount: -order.totalAmount } }
      );
    }

    await couponModal.updateOne(
      { _id: coupon },
      { $inc: { maxRedemptions: -1 } }
    );
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
    let ORDER_PER_PAGE=3;
    let currentPage=req?.query?.page
    
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

    allOrders = allOrders.filter((order, index) => {
      return order.user == req.session.user._id;
    });
    let allOrderLength=allOrders.length
    let BTN_N0=Math.ceil(allOrderLength/ORDER_PER_PAGE)
    console.log('btn no');
    console.log(BTN_N0)
   const orderIds=  allOrders.map((el,index)=>{
      return el._id
    })
   const orders= await orderModal.find({
      _id: { $in: orderIds }
    }).sort({_id:-1})
    .skip(currentPage*ORDER_PER_PAGE)
    .limit(ORDER_PER_PAGE)
    

    res.render("user/view-orders", {
      layout: "./layout/homeLayout.ejs",
      isLoggedIn: true,
      orders: orders,
      BTN_N0
      
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
    orders.items = orders?.items.filter((item, index) => {
      return item.status != "Cancelled";
    });
    res.render("user/order-details.ejs", {
      layout: "./layout/homeLayout.ejs",
      isLoggedIn: true,
      orders: orders,
    });
  } catch (error) {
    console.log(error);
  }
};

const getOrderProducts = async (req, res, next) => {
  console.log("req.params.id");
  console.log(req.params.id);
  try {
    const order = await orderModal
      .findById(req.params.id)
      .populate("items.productId")
      .populate("user")
      .populate("address");
    console.log(order);
    res.render("admin/order-product", {
      layout: "./layout/adminLayout.ejs",
      isLoggedIn: true,
      order: order,
      req: req,
    });
  } catch (error) {
    console.log(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    let orderStatus = req?.body?.status;
    let userId = req.body.user;
    console.log(req.query.productId)

    const order = await orderModal.findById(req?.params?.id);

    if (!order) {
      throw new Error("Order not found");
    }

    if (req?.query?.productId) {
      const itemToUpdate = order.items.find((item) =>
        item.productId.equals(req.query.productId)
      );
      let price;

      let productId = itemToUpdate?.productId;
      const product = await productModal.findById(productId);

      if (product.offerPrice === 0) {
        price = itemToUpdate.price;
        console.log(price);
        console.log("price");
      } else {
        price = product.offerPrice;
        console.log(price);
        console.log("offerprice");
      }
      // if(itemToUpdate.offerPrice!=0) itemToUpdate.price=itemToUpdate.offerPrice
      if (!itemToUpdate) {
        throw new Error("Item not found in the order");
      }

      if (orderStatus === "Cancelled") {
        const order = await orderModal
          .findById(req.params.id)
          .populate("coupon");

        // If Coupon Applied ot Order

        let totalAmount = 0;

        let discountAmount = order?.coupon?.discountAmount;

        if (!discountAmount) discountAmount = 0;

        let cancelledQty = itemToUpdate.quantity - req.body.qty;

        const notCancelledArr = order.items.filter((item, index) => {
          return item.status != "Cancelled";
        });

        if (req?.body?.qty != 0) {
          if (order?.coupon) {
            totalAmount =
              Number(cancelledQty) * Number(price) -
              discountAmount / req.body.qty;
            //  totalAmount=(itemToUpdate.price*req.body.qty)-(discountAmount/req.body.qty)
          } else {
            totalAmount = Number(cancelledQty) * Number(price);
          }
          itemToUpdate.quantity = req.body.qty;
          const updated = await orderModal.updateOne(
            { _id: order._id },
            { $inc: { totalAmount: -Number(totalAmount) } }
          );
          console.log(updated);

          // if(order?.paymentMode==="ONLINE" || "WALLET"){
          // let walletAmountAdd=(cancelledQty*itemToUpdate.price)-(discountAmount/cancelledQty)
          // console.log(walletAmountAdd)

          // const wallet = await walletModal.updateOne(
          //   { user_id: req.session.user._id },
          //   { $inc: { amount: walletAmountAdd } }
          // );
          // }
        } else if (notCancelledArr.length === 1) {
          itemToUpdate.status = orderStatus;
          await orderModal.updateOne(
            { _id: order._id },
            { orderStatus: orderStatus }
          );
        } else {
          itemToUpdate.status = "Cancelled";

          if (order?.coupon) {
            console.log(price);
            console.log(price);
            console.log(price);
            totalAmount =
              Number(cancelledQty) * Number(price) -
              discountAmount / order.items.length;
            //  totalAmount=(itemToUpdate.price*req.body.qty)-(discountAmount/req.body.qty)
          } else {
            totalAmount = Number(cancelledQty) * Number(price);
          }
          itemToUpdate.quantity = req.body.qty;
          const updated = await orderModal.updateOne(
            { _id: order._id },
            { $inc: { totalAmount: -Number(totalAmount) } }
          );
          console.log(updated);
        }

        let walletAmountAdd;

        if (
          order?.paymentMode === "ONLINE" ||
          order?.paymentMode === "WALLET"
        ) {
          if (order?.coupon)
            walletAmountAdd =
              cancelledQty * price - discountAmount / order.items.length;
          else walletAmountAdd = cancelledQty * price;
          console.log(walletAmountAdd);

          const wallet = await walletModal.updateOne(
            { user_id: req.session.user._id },
            { $inc: { amount: walletAmountAdd } }
          );
        }
      }
    } else {
      order.items.forEach((item) => {
        item.status = orderStatus;
      });

      if (orderStatus === "Cancelled") {
        if (order.paymentMode === "ONLINE" || order.paymentMode === "WALLET") {
          console.log(userId);
          const wallet = await walletModal.updateOne(
            { user_id: userId },
            { $inc: { amount: order.totalAmount } }
          );
        }
      }
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
    console.log(req.query.page);
    const ITEMS_PER_PAGE = 4;
    let ITEMS_TO_SKIP;
    if (req.query.page) {
      ITEMS_TO_SKIP = req.query.page * ITEMS_PER_PAGE;
    } else {
      ITEMS_TO_SKIP = 0;
    }

    const findOrders = await orderModal.find({
      orderStatus: { $nin: ["Delivered", "Cancelled"] },
    });
    const noOfDocuments = findOrders.length / ITEMS_PER_PAGE;

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
          user: { $arrayElemAt: ["$user._id", 0] },
          orderStatus: 1,
          paymentMode: 1,
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
      {
        $skip: ITEMS_TO_SKIP,
      },
      {
        $limit: ITEMS_PER_PAGE,
      },
    ]);

  

    res.render("admin/view-orders", {
      layout: "./layout/adminLayout.ejs",
      orders: orders,
      documentsNo: noOfDocuments,
      req
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



const viewDeliveredOrders= async (req,res,next) => {
  let userId=req.session.user._id
  try {
    const ITEMS_PER_PAGE=3;
    const currentPage=req?.query?.page;
    let BTN_NO;
    const orders=await orderModal.find({user:userId,orderStatus:'Delivered'})
   BTN_NO=Math.ceil(orders.length/ITEMS_PER_PAGE);
    console.log(BTN_NO)
    console.log('btn nod')
    res.render('user/delivered-orders',{layout:'./layout/homeLayout.ejs',
    isLoggedIn:true,orders:orders,BTN_NO:BTN_NO
  })
  } catch (error) {
    res.redirect('/404')
  }
}

const viewDeliveredProducts=async (req,res,next)=>{
  try {
    let ITEMS_PER_PAGE=3;
    let currentPage=req?.query?.page;
    
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const order = await orderModal
    .findOne({_id:req.params.orderId,createdAt:{$gte:sevenDaysAgo}})
    .populate("items.productId")
    .populate("user")
    .populate("address")

    
    

    res.render('user/deliveredProducts.ejs',{layout:'./layout/homeLayout.ejs'
    ,order:order,isLoggedIn:true})
  } catch (error) {
    console.log(error)
  }
}

const returnProduct=async(req,res,next)=>{
  let orderId=req.query.orderId;
  let productId=req.query.productId;
  try {
    await orderModal.findOneAndUpdate(
      {
        _id:orderId,
        'items.productId':productId
      },
      {
        $set: {
          'items.$.isReturned':true
        }
      },
      {
        new:true
      }
    )
    res.status(200).json({response:true});

  } catch (error) {
    console.log(error);
  }
}

const returnedProducts=async(req,res,next)=>{
  const returnedProducts= await findReturnedPrdoucts()
  res.render('admin/cancelledProducts',
  {layout:'./layout/adminLayout.ejs',products:returnedProducts})

}


module.exports = {
  placeOrder,
  getOrderProducts,
  orderPage,
  viewOrders,
  editOrder,
  orderDetails,
  cancelOrder,
  viewOrdersAdmin,
  viewDeliveredOrders,
  viewDeliveredProducts,
  returnProduct,
  returnedProducts
};
