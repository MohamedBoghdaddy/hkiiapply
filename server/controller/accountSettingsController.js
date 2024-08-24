import bcrypt from "bcrypt";
import User from "../models/UserModel.js"; // Adjust the path to your User model

export const updateAccountSettings = async (req, res) => {
  const { userId } = req.params;
  const { username, email, password, gender } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // Check if the new email is already used by another user
    const existingUserWithEmail = await User.findOne({ email });
    if (
      existingUserWithEmail &&
      existingUserWithEmail._id.toString() !== userId
    ) {
      return res
        .status(400)
        .json({ message: "Email is already in use by another user" });
    }

    // Find the user by id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.email = email;

    // Hash the new password if it is provided
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    // Save the updated user to the database
    await user.save();

    res
      .status(200)
      .json({ message: "Account settings updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};
