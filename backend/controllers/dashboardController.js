const Room = require("../models/Room");
const Booking = require("../models/Booking");
const User = require("../models/User");

async function getDashboardSummary(_req, res, next) {
  try {
    const [totalRooms, availableRooms, totalBookings, totalUsers, pendingBookings] =
      await Promise.all([
        Room.countDocuments(),
        Room.countDocuments({ status: "available" }),
        Booking.countDocuments(),
        User.countDocuments(),
        Booking.countDocuments({ status: "pending" })
      ]);

    res.json({
      success: true,
      data: {
        totalRooms,
        availableRooms,
        totalBookings,
        totalUsers,
        pendingBookings
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardSummary
};
