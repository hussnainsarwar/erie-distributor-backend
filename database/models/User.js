const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true  },
  contact: { type: String },
  password: { type: String, required: true, default: 'GoogleUserPassword' },
  usertype: { type: String, default: "user" } // Add usertype field with default value
});

const User = mongoose.model('User', userSchema);

module.exports = User;
