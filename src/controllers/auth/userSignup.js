const express = require("express");
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");

const userSignup = async (req, res) => {
  let { username, email, password, phoneNo, groupName, userRole } = req.body;
  username = username.trim();
  email = email.trim();
  password = password.trim();
  phoneNo = phoneNo.trim();
  groupName = groupName.trim();
  userRole = userRole.trim();

  if (!(username && email && password)) {
    return res.status(400).json({ message: "All fields are required" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email" });
  } else if (!/^[a-zA-Z\s]*$/.test(username)) {
    return res.status(400).json({ message: "Name must contain only letters" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phoneNo,
      groupName,
      userRole,
    });
    const createdUser = await newUser.save();
    return res.status(201).json({
      message: "User created successfully",
      user: createdUser,
      success:true
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const getUserDetails = async (req, res) => {
  const { username } = req.params;
  try {
    const userDetails = await User.findOne({ username });
    return res.status(200).json({
      message:"User details fetched successfully!",
      succeess:true,
      userDetails:userDetails
      });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  userSignup,
  getUserDetails,
};
