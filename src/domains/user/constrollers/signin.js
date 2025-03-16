const User = require('../model');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
// signin
const signin = async (req, res) => {
    try {
    let {username, password } = req.body;
    username = username.trim();
    password = password.trim();

    if (!username || !password) {
        return res.status(400).json({ message: "Invalid input" });
    }
    // check if user exists
    const userExists=await User.findOne({username});
    if(!userExists){
        return res.status(400).json({message: 'User does not exist'});
    };
    //confirm password
    const passwordMatch=await bcrypt.compare(password,userExists.password);
    if(!passwordMatch){
        return res.status(400).json({message: 'Invalid password'});
    }
    // generate token
    const token=jwt.sign({id:userExists._id},process.env.JWT_SECRET);
    // send response
    // res.status(200).json({message: 'User signed in'});
    return res.status(200).json({
        success: true,
        token: token,
        message: 'User signed in successfully'
    });
        
    } catch (error) {
        res.status(500).json({message: error.message}); 
    }
}
module.exports = { signin };