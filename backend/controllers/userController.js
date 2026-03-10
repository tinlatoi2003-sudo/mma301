const bcrypt = require("bcryptjs");
const User = require("../models/User");
const createError = require("../utils/createError");

async function getUsers(_req, res, next) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const { fullName, email, password, phone, role, chatEnabled } = req.body;

    if (!fullName || !email || !password) {
      throw createError(400, "fullName, email and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      role: role || "user",
      chatEnabled: chatEnabled !== undefined ? Boolean(chatEnabled) : false
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
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

async function updateUser(req, res, next) {
  try {
    const { fullName, phone, role, password, chatEnabled } = req.body;
    const updates = {
      fullName,
      phone,
      role,
      chatEnabled: chatEnabled !== undefined ? Boolean(chatEnabled) : undefined
    };

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    if (!user) {
      throw createError(404, "User not found");
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    if (req.user._id.toString() === req.params.id) {
      throw createError(400, "Admin cannot delete the current logged in account");
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      throw createError(404, "User not found");
    }

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
