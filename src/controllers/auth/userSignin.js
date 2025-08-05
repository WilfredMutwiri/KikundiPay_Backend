const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSignin = async (req, res) => {
  try {
    let { username, password } = req.body;
    
    username = username.trim();
    password = password.trim();

    if (!username || !password) {
      return res.status(400).json({ message: "Invalid input" });
    }
    const userExists = await User.findOne({ username });
    if (!userExists) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET,{expiresIn:'1h'});
    return res.status(200).json({
      success: true,
      token: token,
      username: username,
      id:userExists._id,
      message: "User signed in successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { userSignin };
