const Notification = require("../../models/notifications");
const User = require("../../models/userModel");

// Get user notifications
const getUserNotifications=async(req,res)=>{
    let {userId}=req.params;
    try {
        const Notifications=await Notification.find({user:userId}).sort({createdAt:-1})
        res.json(Notifications);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

// mark notification as read
const markNotificationAsRead = async (req, res) => {
  let { notificationId } = req.params;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found!" });
    }
    notification.read = true;
    await notification.save();
    return res.json(notification);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// delete notification
const deleteNotification = async (req, res) => {
  let { notificationId } = req.params;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found!" });
    }
    await notification.deleteOne();
    return res.json({
      message:"Notification deleted!",
      success:true
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports={
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification
}