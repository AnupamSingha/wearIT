const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    minLength: 3,
    trim: true,
  },
  email: String,
  password: String,
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  }],
  orders: [{
    address: String,
    city: String,
    postalCode: String,
    contact: String,
    paymentMethod: String,
    cardNumber: String,
    expiryDate: String,
    cvv: String,
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "product"
    }],
    totalAmount: Number,
    status: String,
    date: { type: Date, default: Date.now }
  }],
  contact: Number,
  picture: String,
});

module.exports = mongoose.model("user", userSchema);
