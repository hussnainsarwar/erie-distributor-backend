const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  password: { type: String, required: true },
  usertype: { type: String, default: "user" } // Add usertype field with default value
});

const User = mongoose.model('User', userSchema);

module.exports = User;
