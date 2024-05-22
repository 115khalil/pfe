const mongoose = require("mongoose");

const User = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  cin: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['user', 'admin'], 
    default: 'user', 
 },
});
const UserModel = mongoose.model("User", User);
module.exports = UserModel;