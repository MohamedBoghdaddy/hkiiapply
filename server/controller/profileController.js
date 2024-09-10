import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/UserModel.js";

// Fix __dirname issue in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cvDirectory = path.join(__dirname, "../uploads/cvs");
const photoDirectory = path.join(__dirname, "../uploads/photos");

// Ensure directories exist
if (!fs.existsSync(cvDirectory)) {
  fs.mkdirSync(cvDirectory, { recursive: true });
}
if (!fs.existsSync(photoDirectory)) {
  fs.mkdirSync(photoDirectory, { recursive: true });
}

// Get user profile by userId
export const getProfile = async (req, res) => {
  console.log(
    "GET /profile/get/:userId - Received request with params:",
    req.params
  );

  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "username email cvFileName photoUrl"
    );

    if (!user) {
      console.log("User not found for userId:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update user profile (including CV and photo)
export const upsertProfile = async (req, res) => {
  console.log(
    "PUT /profile/upsert/:userId - Received request with params:",
    req.params
  );
  console.log("Request body:", req.body);
  console.log("Uploaded files:", req.files);

  try {
    const { userId } = req.params;
    const updates = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.cvFile && req.files.cvFile.length > 0) {
        const cvFile = req.files.cvFile[0];
        updates.cvFileName = cvFile.filename;
        updates.cvFilePath = path.join(cvDirectory, cvFile.filename);
        fs.renameSync(cvFile.path, updates.cvFilePath);
      }

      if (req.files.photoFile && req.files.photoFile.length > 0) {
        const photoFile = req.files.photoFile[0];
        updates.photoFileName = photoFile.filename;
        updates.photoUrl = `/uploads/photos/${photoFile.filename}`;
        fs.renameSync(
          photoFile.path,
          path.join(photoDirectory, photoFile.filename)
        );
      }
    }

    console.log("User profile updates:", updates);

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User updated successfully:", updatedUser);
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res
      .status(500)
      .json({ message: "Error updating user profile", error: error.message });
  }
};

// Delete user profile
export const deleteProfile = async (req, res) => {
  console.log(
    "DELETE /profile/delete/:userId - Received request with params:",
    req.params
  );

  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      console.log("User not found for userId:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally, delete the CV file from the filesystem
    if (user.cvFilePath && fs.existsSync(user.cvFilePath)) {
      console.log("Deleting CV file from path:", user.cvFilePath);
      fs.unlinkSync(user.cvFilePath);
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Upload CV
export const uploadCv = async (req, res) => {
  console.log("POST /profile/uploadCv - Received request with file:", req.file);

  try {
    const { userId } = req.params;
    const file = req.file;
    const filePath = path.join(
      cvDirectory,
      `${Date.now()}_${file.originalname}`
    );

    // Move the file to the desired directory
    console.log("Moving CV file to:", filePath);
    fs.renameSync(file.path, filePath);

    const user = await User.findByIdAndUpdate(
      userId,
      { cvFileName: file.originalname, cvFilePath: filePath },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("CV uploaded and user updated:", user);
    res.status(200).json({
      message: "CV uploaded successfully",
      user,
    });
  } catch (error) {
    console.error("Error uploading CV:", error);
    res.status(500).json({ message: "CV upload failed", error });
  }
};

// Download CV
export const downloadCv = async (req, res) => {
  console.log(
    "GET /profile/downloadCv/:userId - Received request with params:",
    req.params
  );

  try {
    const user = await User.findById(req.params.userId);

    if (!user || !user.cvFilePath) {
      console.log("CV not found for userId:", req.params.userId);
      return res.status(404).json({ message: "CV not found" });
    }

    // Check if the logged-in user has permission to access this CV
    if (user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access to CV" });
    }

    console.log("Sending CV file for download:", user.cvFilePath);
    res.download(user.cvFilePath, user.cvFileName);
  } catch (error) {
    console.error("Error downloading CV:", error);
    res.status(500).json({ message: "CV download failed", error });
  }
};

// Delete CV
export const deleteCv = async (req, res) => {
  console.log(
    "DELETE /profile/deleteCv/:userId - Received request with params:",
    req.params
  );

  try {
    const user = await User.findById(req.params.userId);

    if (!user || !user.cvFilePath) {
      return res.status(404).json({ message: "CV not found" });
    }

    // Check if the logged-in user has permission to delete this CV
    if (user._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to delete CV" });
    }

    console.log("Deleting CV file from path:", user.cvFilePath);
    fs.unlinkSync(user.cvFilePath);

    // Clear the CV information from the user profile
    user.cvFileName = undefined;
    user.cvFilePath = undefined;
    await user.save();

    res.status(200).json({ message: "CV deleted successfully" });
  } catch (error) {
    console.error("Error deleting CV:", error);
    res.status(500).json({ message: "CV deletion failed", error });
  }
};
