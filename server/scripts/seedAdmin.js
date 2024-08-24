// scripts/seedAdmin.js
import mongoose from "mongoose";
import User from "../models/UserModel.js"; // Adjust the path as needed
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const admin = await User.findOne({ role: "admin" });

    if (admin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    const newAdmin = new User({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    console.log("Admin created successfully");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};

export {createAdmin};
