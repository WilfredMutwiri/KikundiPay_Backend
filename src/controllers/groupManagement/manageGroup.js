const Group = require("../../models/groupModel");
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");

// Create a new group
const addGroup = async (req, res) => {
  try {
    const { name, code,username,email,phone,password} = req.body;

    if (!name || !code || !username || !email || !phone || !password) {
      return res
        .status(400)
        .json({ message: "Kindly fill all required fields" });
    }

    const groupExists = await Group.findOne({ $or: [{ name }, { code }] });
    if (groupExists) {
      return res
        .status(400)
        .json({ message: "Group with this name or code already exists" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Admin with this username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = new User({
      username, 
      email,
      phoneNo: phone,
      password: hashedPassword,
      userRole: "admin",
    });

    await adminUser.save();

    const newGroup = new Group({
      name,
      code,
      members: [adminUser._id],
      admin: adminUser._id,
    });

    const createdGroup = await newGroup.save();

    return res.status(201).json({
      message: "Group and admin created successfully",
      group: createdGroup,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all groups
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("members", "username email phoneNo userRole");
    if (groups.length === 0) {
      return res.status(200).json({ message: "No groups found!" });
    }
    return res.status(200).json({
        message: "Groups fetched successfully",
        groups:groups,
        success:true
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a single group by ID
const getSingleGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const singleGroup = await Group.findById(id).populate("members", "name email");
    if (!singleGroup) {
      return res.status(404).json({ message: "Group not found!" });
    }
    return res.status(200).json({
    message: "Group fetched successfully",  
    success:true,  
    group: singleGroup
});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a group
const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedGroup = await Group.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("members", "name email");

    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found!" });
    }

    return res.status(200).json({
      message: "Group updated successfully",
      group: updatedGroup,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get group members by member ID
const getGroupMembersByMember = async (req, res) => {
  const { memberId } = req.params;

  try {
    const group = await Group.findOne({ members: memberId })
      .populate("members", "username email phoneNo userRole");

    if (!group) {
      return res.status(404).json({
        message: "No group found for this member",
        success: false,
      });
    }

    // Reorder members: put the requesting member first and add a "You" tag
    const reorderedMembers = group.members.map(m => {
      if (m._id.toString() === memberId) {
        return { ...m.toObject(), tag: "You" };
      }
      return m.toObject();
    });

    // Move "You" to the start
    reorderedMembers.sort((a, b) => (a.tag === "You" ? -1 : 1));

    return res.status(200).json({
      message: "Members fetched successfully",
      groupId: group._id,
      groupName: group.name,
      members: reorderedMembers,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Delete a group
const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGroup = await Group.findByIdAndDelete(id);
    if (!deletedGroup) {
      return res.status(404).json({ message: "Group not found!" });
    }
    return res.status(200).json({ message: "Group deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addGroup,
  getGroups,
  getSingleGroup,
  updateGroup,
  deleteGroup,
  getGroupMembersByMember,
};
