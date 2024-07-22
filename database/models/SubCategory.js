const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  flavors: {
    type: [String],
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
});

const SubCategory = mongoose.model('SubCategory', SubCategorySchema);

module.exports = SubCategory;
