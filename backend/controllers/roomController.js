const Room = require("../models/Room");
const createError = require("../utils/createError");

async function getRooms(req, res, next) {
  try {
    const keyword = req.query.keyword || "";
    const status = req.query.status || "";

    const filters = {};

    if (keyword) {
      filters.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { address: { $regex: keyword, $options: "i" } }
      ];
    }

    if (status) {
      filters.status = status;
    }

    const rooms = await Room.find(filters).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
}

async function getRoomById(req, res, next) {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      throw createError(404, "Room not found");
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
}

async function createRoom(req, res, next) {
  try {
    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room
    });
  } catch (error) {
    next(error);
  }
}

async function updateRoom(req, res, next) {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!room) {
      throw createError(404, "Room not found");
    }

    res.json({
      success: true,
      message: "Room updated successfully",
      data: room
    });
  } catch (error) {
    next(error);
  }
}

async function deleteRoom(req, res, next) {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      throw createError(404, "Room not found");
    }

    res.json({
      success: true,
      message: "Room deleted successfully"
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
};
