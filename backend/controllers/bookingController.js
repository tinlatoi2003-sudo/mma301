const Booking = require("../models/Booking");
const Room = require("../models/Room");
const createError = require("../utils/createError");

async function createBooking(req, res, next) {
  try {
    const { roomId, visitDate, note } = req.body;

    if (!roomId || !visitDate) {
      throw createError(400, "roomId and visitDate are required");
    }

    const room = await Room.findById(roomId);
    if (!room) {
      throw createError(404, "Room not found");
    }

    const booking = await Booking.create({
      room: roomId,
      user: req.user._id,
      visitDate,
      note
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });
  } catch (error) {
    next(error);
  }
}

async function getMyBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
}

async function getAllBookings(req, res, next) {
  try {
    const filters = {};

    if (req.query.status) {
      filters.status = req.query.status;
    }

    const bookings = await Booking.find(filters)
      .populate("room")
      .populate("user", "fullName email phone role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
}

async function updateBookingStatus(req, res, next) {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      throw createError(404, "Booking not found");
    }

    res.json({
      success: true,
      message: "Booking updated successfully",
      data: booking
    });
  } catch (error) {
    next(error);
  }
}

async function payBookingSandbox(req, res, next) {
  try {
    const { payerName, accountNumber } = req.body;

    if (!payerName || !payerName.trim() || !accountNumber || !accountNumber.trim()) {
      throw createError(400, "payerName and accountNumber are required");
    }

    const booking = await Booking.findById(req.params.id).populate("room");

    if (!booking) {
      throw createError(404, "Booking not found");
    }

    const isOwner = String(booking.user) === String(req.user._id);
    if (!isOwner && req.user.role !== "admin") {
      throw createError(403, "You do not have access to pay this booking");
    }

    if (booking.paymentStatus === "paid") {
      return res.json({
        success: true,
        message: "Booking is already paid",
        data: booking
      });
    }

    const transactionId = `SBX-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    booking.paymentStatus = "paid";
    booking.paymentMethod = "sandbox";
    booking.paymentTransactionId = transactionId;
    booking.sandboxPayerName = payerName.trim();
    booking.sandboxAccountMasked = accountNumber.trim().slice(-4).padStart(8, "*");
    booking.paidAt = new Date();

    if (booking.status === "pending") {
      booking.status = "confirmed";
    }

    await booking.save();

    res.json({
      success: true,
      message: "Sandbox payment successful",
      data: booking
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  payBookingSandbox
};
