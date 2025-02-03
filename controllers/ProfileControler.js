const User = require("../models/Users");

const ProfilePic = async (req, res) => {
  try {
    console.log("File upload request received.");

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = req.file.filename; // Extract the filename
    console.log("Uploaded file:", filePath);

    const userId = req.body.userId;
    
    console.log("userid ; ", userId);
    // Assuming the user ID is sent in the request body

    // Find the user and update the profilePic field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: filePath }, // Save only the filename, not full path
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile picture updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { ProfilePic };
