import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const JWT_SECRET = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded._id).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: `Role ${req.user.role} is not allowed to access this resource`,
        });
    }
    next();
  };
};

export { auth, authorizeRoles };
