const bcrypt = require("bcryptjs");
const User = require("../models/User");
const createError = require("../utils/createError");
const createToken = require("../utils/createToken");


async function register(req, res, next) {
  try {
    const { fullName, email, password, phone } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!fullName || !normalizedEmail || !password) {
      throw createError(400, "fullName, email and password are required");
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw createError(409, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = normalizedEmail === "admin@gmail.com" ? "admin" : "user";
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      role,
      chatEnabled: role === "admin"
    });

    const token = createToken(user);

    res.status(201).json({
      success: true,
      message: "Register successful",
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          chatEnabled: user.chatEnabled
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      throw createError(400, "email and password are required");
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw createError(401, "Email or password is incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createError(401, "Email or password is incorrect");
    }

    if (normalizedEmail === "admin@gmail.com" && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    const token = createToken(user);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          chatEnabled: user.chatEnabled
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

function getProfile(req, res) {
  res.json({
    success: true,
    data: req.user
  });
}

async function updateMyProfile(req, res, next) {
  try {
    const { fullName, phone, password, chatEnabled } = req.body;
    const updates = {};

    if (fullName !== undefined) updates.fullName = fullName;
    if (phone !== undefined) updates.phone = phone;
    if (chatEnabled !== undefined && req.user.role !== "admin") {
      updates.chatEnabled = Boolean(chatEnabled);
    }
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    if (!user) {
      throw createError(404, "User not found");
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        chatEnabled: user.chatEnabled
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateMyProfile
};
