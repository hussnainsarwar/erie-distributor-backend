const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  subcategoryId: { type: String, required: true },
  quantity: { type: Number, default: 1 }, // Add quantity field
  addedAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
