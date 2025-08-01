const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
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
  phoneNo: {
    type: Number,
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
  },
  resetOtp: {
    type: Number,
    required: false,
  },
  otpExpires: {
    type: Date,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
