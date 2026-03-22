const User = require("../../models/userModel");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const updateProfilePicture = async (req, res) => {
    try {
        const { userId, base64Image } = req.body;
        
        if (!userId || !base64Image) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`, {
            folder: "KikundiPay_Profiles",
            transformation: [{ width: 500, height: 500, crop: "limit" }]
        });

        // Update User Document
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: uploadResponse.secure_url },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            profilePicture: uploadResponse.secure_url
        });
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return res.status(500).json({ success: false, message: "Failed to upload image. Make sure Cloudinary is installed on the backend." });
    }
};

module.exports = { updateProfilePicture };
