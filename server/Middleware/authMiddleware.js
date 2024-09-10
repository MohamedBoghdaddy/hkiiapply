import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const auth = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token is found, return an error
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization denied, no token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // console.log(decoded)

    // Get user from the token and attach to req object
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res
      .status(401)
      .json({ message: "Unauthorized, token verification failed" });
  }
};

// Middleware to authorize specific roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role ${req.user.role} is not authorized to access this resource`,
      });
    }
    next();
  };
};
