const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

// Route for the home page
router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error, loggedin: false });
});

// Route for the shopping page
router.get("/shop", isloggedin, async function (req, res) {
  let products = await productModel.find();
  let success = req.flash("success");
  res.render("shop", { products, success });
});

// Route for the cart page
router.get("/cart", isloggedin, async function (req, res) {
  let user = await userModel.findOne({ email: req.user.email }).populate("cart");
  const bill = user.cart.reduce((acc, item) => acc + item.price - item.discount, 0) + 20;  // Include shipping fee
  res.render("cart", { user, bill });
});

// Route for adding an item to the cart
router.get("/addtocart/:productid", isloggedin, async function (req, res) {
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Added to cart");
  res.redirect("/shop");
});

router.get('/removefromcart/:productId', isloggedin, async function (req, res) {
  const { productId } = req.params;
  let user = await userModel.findOne({ email: req.user.email });

  // Remove the product from the cart
  user.cart = user.cart.filter(item => item.toString() !== productId);
  
  await user.save();  // Save the updated user document
  res.redirect('/cart');  // Redirect to cart after removal
});

// Route for the checkout page
router.get("/checkout", isloggedin, (req, res) => {
  res.render("checkout");
});

// Handle form submission for checkout
router.post("/checkout", isloggedin, async function (req, res) {
  const { address, city, postalCode, contact, paymentMethod, cardNumber, expiryDate, cvv } = req.body;

  // Simulate order confirmation and processing
  let user = await userModel.findOne({ email: req.user.email }).populate("cart");

  // Calculate total amount
  const totalAmount = user.cart.reduce((acc, item) => acc + item.price - item.discount, 0) + 20; // Add shipping fee

  // Save the user's order details (you can expand this part to save the address, payment method, etc.)
  const orderDetails = {
    address,
    city,
    postalCode,
    contact,
    paymentMethod,
    cardNumber, // Store only necessary details for security
    expiryDate,
    cvv, // Avoid storing CVV for security reasons
    items: user.cart,
    totalAmount,
    status: "Pending",
  };

  // Save the order to the user's order history
  user.orders.push(orderDetails);
  await user.save();

  // Clear the user's cart after successful order placement
  user.cart = [];
  await user.save();

  // Redirect to the order confirmation page
  req.flash("success", "Order placed successfully!");
  res.redirect("/orderconfirmation");
});

// Route for order confirmation page
router.get("/orderconfirmation", isloggedin, function (req, res) {
  res.render("orderconfirmation");  // Render order confirmation page
});

module.exports = router;
