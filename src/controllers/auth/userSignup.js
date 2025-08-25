const Group = require("../../models/groupModel");
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const Notification = require("../../models/notifications");

const userSignup = async (req, res) => {
  const io = req.app.get("io");
  
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

    // notifications
    const newNotification = await Notification.create({
      user: createdUser._id,
      title: "Account Created Successfully",
      message: `Welcome aboard, ${username}! Your KikundiPay account is all set up.You can now participate in your group effectively!`,
    });

    if (createdUser.groupName) {
      const group = await Group.findById(createdUser.groupName);
      if (group) {
        group.members.push(createdUser._id);
        await group.save();
      } else {
        return res.status(400).json({ message: "Group not found" });
      }
    }

    io.emit("notification",{
      title:newNotification.title,
      message:newNotification.message,
    });
    
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
    const userDetails = await User.findOne({ username })
    .populate("groupName","name")
    .select("-password");

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
