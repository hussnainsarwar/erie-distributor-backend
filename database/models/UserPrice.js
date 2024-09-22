// Model for storing user prices
const mongoose = require('mongoose');

const userPriceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  subcategoryId: { type: String, required: true },
  updatedPrice: { type: Number, required: true },
});

const UserPrice = mongoose.model('UserPrice', userPriceSchema);

module.exports = UserPrice;
 