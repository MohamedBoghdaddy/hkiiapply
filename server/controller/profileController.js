import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Profile from "../models/ProfileModel.js";
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

// Get profile by UID
export const getProfile = async (req, res) => {
  console.log(
    "GET /profile/get/:UID - Received request with params:",
    req.params
  );

  try {
    const { UID } = req.params;
    const profile = await Profile.findOne({ UID }).populate(
      "userId",
      "username email"
    );

    if (!profile) {
      console.log("Profile not found for UID:", UID);
      return res.status(404).json({ message: "Profile not found" });
    }

    console.log("Profile found:", profile);
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create or update profile by UID
export const upsertProfile = async (req, res) => {
  console.log(
    "PUT /profile/upsert/:UID - Received request with params:",
    req.params
  );
  console.log("Request body:", req.body);
  console.log("Uploaded files:", req.files);

  try {
    const { UID } = req.params;
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

    console.log("Profile updates:", updates);

    // Upsert profile
    const profile = await Profile.findOneAndUpdate(
      { UID },
      { $set: updates },
      { new: true, upsert: true }
    );

    console.log("Profile upserted successfully:", profile);
    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

// Delete profile by UID
export const deleteProfile = async (req, res) => {
  console.log(
    "DELETE /profile/delete/:UID - Received request with params:",
    req.params
  );

  try {
    const { UID } = req.params;
    const profile = await Profile.findOneAndDelete({ UID });
    if (!profile) {
      console.log("Profile not found for UID:", UID);
      return res.status(404).json({ message: "Profile not found" });
    }

    // Optionally, delete the CV file from the filesystem
    if (profile.cvFilePath && fs.existsSync(profile.cvFilePath)) {
      console.log("Deleting CV file from path:", profile.cvFilePath);
      fs.unlinkSync(profile.cvFilePath);
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: error.message });
  }
};

// Upload CV by UID
export const uploadCv = async (req, res) => {
  console.log("POST /profile/uploadCv - Received request with file:", req.file);

  try {
    const { UID } = req.params;
    const file = req.file;
    const filePath = path.join(
      cvDirectory,
      `${Date.now()}_${file.originalname}`
    );

    // Move the file to the desired directory
    console.log("Moving CV file to:", filePath);
    fs.renameSync(file.path, filePath);

    const profile = await Profile.findOneAndUpdate(
      { UID },
      { cvFileName: file.originalname, cvFilePath: filePath },
      { new: true, upsert: true }
    );

    console.log("CV uploaded and profile updated:", profile);
    res.status(200).json({
      message: "CV uploaded successfully",
      profile,
    });
  } catch (error) {
    console.error("Error uploading CV:", error);
    res.status(500).json({ message: "CV upload failed", error });
  }
};

// Download CV by UID
export const downloadCv = async (req, res) => {
  console.log(
    "GET /profile/downloadCv/:UID - Received request with params:",
    req.params
  );

  try {
    const profile = await Profile.findOne({ UID: req.params.UID });

    if (!profile || !profile.cvFilePath) {
      console.log("CV not found for UID:", req.params.UID);
      return res.status(404).json({ message: "CV not found" });
    }

    // Add authorization check to ensure the user owns the CV
    if (profile.userId.toString() !== req.user.id) {
      console.log(
        "User does not have permission to access this CV:",
        req.user.id
      );
      return res.status(403).json({
        message: "You do not have permission to access this CV",
      });
    }

    console.log("Sending CV file for download:", profile.cvFilePath);
    res.download(profile.cvFilePath, profile.cvFileName);
  } catch (error) {
    console.error("Error downloading CV:", error);
    res.status(500).json({ message: "CV download failed", error });
  }
};

// Delete CV by UID
export const deleteCv = async (req, res) => {
  console.log(
    "DELETE /profile/deleteCv/:UID - Received request with params:",
    req.params
  );

  try {
    const profile = await Profile.findOne({ UID: req.params.UID });

    if (!profile || !profile.cvFilePath) {
      console.log("CV not found for UID:", req.params.UID);
      return res.status(404).json({ message: "CV not found" });
    }

    // Add authorization check to ensure the user owns the CV
    if (profile.userId.toString() !== req.user.id) {
      console.log(
        "User does not have permission to delete this CV:",
        req.user.id
      );
      return res.status(403).json({
        message: "You do not have permission to delete this CV",
      });
    }

    console.log("Deleting CV file from path:", profile.cvFilePath);
    fs.unlinkSync(profile.cvFilePath);

    // Clear the CV information from the profile
    profile.cvFileName = undefined;
    profile.cvFilePath = undefined;
    await profile.save();

    console.log("CV deleted and profile updated:", profile);
    res.status(200).json({ message: "CV deleted successfully" });
  } catch (error) {
    console.error("Error deleting CV:", error);
    res.status(500).json({ message: "CV deletion failed", error });
  }
};

// Preview CV by UID
export const previewCv = async (req, res) => {
  console.log(
    "GET /profile/previewCv/:UID - Received request with params:",
    req.params
  );

  try {
    const profile = await Profile.findOne({ UID: req.params.UID });

    if (!profile || !profile.cvFilePath) {
      console.log("CV not found for UID:", req.params.UID);
      return res.status(404).json({ message: "CV not found" });
    }

    if (profile.userId.toString() !== req.user.id) {
      console.log(
        "User does not have permission to preview this CV:",
        req.user.id
      );
      return res.status(403).json({
        message: "You do not have permission to preview this CV",
      });
    }

    // Read the file and return it as a base64 encoded string
    console.log("Reading CV file for preview:", profile.cvFilePath);
    const base64Data = fs.readFileSync(profile.cvFilePath, {
      encoding: "base64",
    });
    res.json({ base64: base64Data });
  } catch (error) {
    console.error("Error previewing CV:", error);
    res.status(500).json({ message: "CV preview failed", error });
  }
};
