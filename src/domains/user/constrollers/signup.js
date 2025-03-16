const express=require('express');
const User = require('../model');
const bcrypt = require('bcrypt');
// signup
const signup= async(req, res) => {
    let {username, email, password} = req.body;
    username=username.trim();
    email=email.trim();
    password=password.trim();

    if(!(username && email && password)){
      return res.status(400).json({message: 'All fields are required'});
    }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      return res.status(400).json({message: 'Invalid email'});
    }else if(!/^[a-zA-Z\s]*$/.test(username)){
      return res.status(400).json({message: 'Name must contain only letters'});
    }


    //create new user
    try {
    // check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
      return res.status(400).json({message: 'User already exists'});
      }
      //hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      //new user
      const newUser = new User({ 
        username,
        email, 
        password: hashedPassword 
      });
      const createdUser= await newUser.save();
      //send response
      return res.status(201).json({
        message: 'User created successfully',
        user:createdUser
      });
      } catch (error) {
        return  res.status(500).json({message: error.message});
      }
}; 

module.exports = { signup };