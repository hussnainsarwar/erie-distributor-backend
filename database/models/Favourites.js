const mongoose = require('mongoose');

const FavouriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  subcategoryId: { type: String, required: true },
});

const Favourite = mongoose.model('Favourite', FavouriteSchema);

module.exports = Favourite;
