const addressModal = require("../model/addressModal");
const cartModal = require("../model/cartModal");
const orderModal = require("../model/orderModal");
const productModal = require("../model/productModal");
const razorpay = require("../config/razorpay");
const Razorpay = require("razorpay");

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

    // selectedAddress=Object.assign({},selectedAddress)
    const order = await orderModal.create({
      user: userId,
      items: orderProducts,
      totalAmount: grandTotal,
      paymentMode: paymentMode,
      address: address._id,
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

      return res
        .status(200)
        .json({ success: true, url: `/razor-pay?oid=${order._id}` });
    }

    // await cartModal.deleteOne({user:req.session.user._id})
    // res.status(200).json({ response: order });
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

    const allOrders = await orderModal.aggregate([
      {
        $match: {
          orderStatus: {
            $nin: ['Delivered', 'Cancelled'], // Use $nin (not in) to exclude specific statuses
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

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
    const orders = await orderModal
      .findById(req.params.id)
      .populate("items.productId")
      .populate("address");
    res.render("user/order-details.ejs", {
      layout: "./layout/homeLayout.ejs",
      isLoggedIn: true,
      orders: orders,
    });
  } catch (error) {
    console.log(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const updatedOrder = await orderModal.findByIdAndUpdate(req.params.id, {
      orderStatus: "Cancelled",
    });
    res.status(200).json({ msg: "success" });
  } catch (error) {
    console.log(error);
  }
};

const viewOrdersAdmin = async (req, res, next) => {
  try {
    const ITEMS_PER_PAGE=5;
    const orders = await orderModal.aggregate([
      {
        $match: {
          orderStatus: {
            $nin: ['Delivered', 'Cancelled'], // Use $nin (not in) to exclude specific statuses
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

    console.log(Math.ceil(orders.length / 5));

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
  placeOrder,
  orderPage,
  viewOrders,
  editOrder,
  orderDetails,
  cancelOrder,
  viewOrdersAdmin,
};
