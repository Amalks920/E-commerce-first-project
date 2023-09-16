const expressAsyncHandler = require("express-async-handler");
const cartModal = require("../model/cartModal");
const categoryModal = require("../model/categoryModal");

const getCart=async(req,res,next)=>{
  try {
    const category = await categoryModal.find();
    const userId = req.session.user._id;
    const coupon = req.query;
    const cart = await cartModal
    .findOne({ user: userId })
      .populate({ path: "products.product" });
    res.render("user/product-cart", {layout:'./layout/homeLayout.ejs', cart, category, coupon,isLoggedIn:true });
    console.log(cart.products);
    console.log(cart)
  } catch (error) {
    console.log(error.message);
  }
} 

const addToCartPost=async (req, res) => {
    const userId = req.session.user._id;
    console.log(userId)
    let { productId, quantity } = req.body;
    quantity=Number(quantity)
    console.log('req.body')
    console.log(req.body);
    
    try {
      
      let cart = await cartModal.findOne({ user: userId });

      if (cart == null) {
        cart = await cartModal.create({ user: userId });
        
      }

      if (cart.products.length === 0) {
        
        cart.products.push({ product: productId, quantity });
        //return res.status(200).json({ success: true });
      } else {
        let i;
        for (i = 0; i < cart.products.length; i++) {
          console.log('cart.products cart.products cart.products')
          console.log(cart.products)
          if (cart.products[i].product == productId) {
             cart.products[i].quantity += Number(quantity);
            break;
          }
        }

        console.log(i);
        if (i === cart.products.length) {
          cart.products.push({ product: productId, quantity });
          console.log(cart)
          
        }
      }
      await cart.save();
      console.log(cart)
      return res.status(200).json({ success: true });
    
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }


  const updateCartPost= async (req, res) => {
    const userId = req.session.user._id;
    const { productId, quantity } = req.body;
    console.log(req.body);
    try {
      let cart = await cartModal.findOne({ user: userId });

      if (cart.products.length === 0) {
        cart.products.push({ product: productId, quantity });
        res.status(200).json({ success: true });
      } else {
        let i;
        for (i = 0; i < cart.products.length; i++) {
          if (cart.products[i].product == productId) {
            cart.products[i].quantity = Number(quantity);
            res.status(200).json({ success: true });

            break;
          }
        }

        console.log(i);
        if (i === cart.products.length) {
          cart.products.push({ product: productId, quantity });
          res.status(200).json({ success: true });
        }
      }
      cart.save();
    } catch (error) {
      console.log(error.message);
    }
  }

  const removeFromCart=async (req, res) => {
    try {
     
      const { cartId, productId } = req.body;
      console.log(req.body)

      // Find the cartlist document by ID
      const cart = await cartModal.findById(cartId);

      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      // Find the index of the product in the "products" array
      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === productId
      );
      console.log(productIndex);
      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found in cart" });
      }

      // Remove the product from the "products" array
      cart.products.splice(productIndex, 1);

      // Save the updated cartlist document
      const updatedCart = await cart.save();
      res.redirect("/get-cart");
      // Respond with the updated cart or a success message
    } catch (error) {
      console.error("Error deleting product from cart:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }



module.exports={
    getCart,addToCartPost,
    updateCartPost,removeFromCart
}