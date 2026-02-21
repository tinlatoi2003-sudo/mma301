const jwt = require("jsonwebtoken");
const User = require("../models/User");
const createError = require("../utils/createError");

async function authMiddleware(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Authentication token is missing");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw createError(401, "User no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : createError(401, "Invalid authentication token"));
  }
}

function adminOnly(req, _res, next) {
  if (req.user.role !== "admin") {
    return next(createError(403, "Admin role is required"));
  }

  next();
}

module.exports = {
  authMiddleware,
  adminOnly
};
