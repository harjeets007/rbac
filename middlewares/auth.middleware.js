const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { error } = require("../services/responseSerivce");


const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return error(401, "Unauthorized access", null, res);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return error(401, "User not found", null, res);
    }

    req.user = user;

    next();
  } catch (err) {
    return error(401, "Invalid or expired token", null, res);
  }
};

module.exports = authMiddleware;
