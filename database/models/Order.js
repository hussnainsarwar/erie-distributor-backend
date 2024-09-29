const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
    required: true, // Make this field required
  },
  cartItems: [{
    name: String,
    quantity: Number,
    price: Number,
  }],
  totalValue: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fulfilled: {
    type: Boolean,
    default: false, // Default value set to false
  },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
