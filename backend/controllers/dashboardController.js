const Room = require("../models/Room");
const Booking = require("../models/Booking");
const User = require("../models/User");

async function getDashboardSummary(_req, res, next) {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const [totalRooms, availableRooms, totalBookings, totalUsers, pendingBookings, revenueAgg, revenue30DaysAgg] =
      await Promise.all([
        Room.countDocuments(),
        Room.countDocuments({ status: "available" }),
        Booking.countDocuments(),
        User.countDocuments(),
        Booking.countDocuments({ status: "pending" }),
        Booking.aggregate([
          {
            $match: {
              paymentStatus: "paid"
            }
          },
          {
            $lookup: {
              from: "rooms",
              localField: "room",
              foreignField: "_id",
              as: "roomData"
            }
          },
          {
            $unwind: "$roomData"
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$roomData.price" }
            }
          }
        ]),
        Booking.aggregate([
          {
            $match: {
              paymentStatus: "paid",
              paidAt: { $gte: last30Days }
            }
          },
          {
            $lookup: {
              from: "rooms",
              localField: "room",
              foreignField: "_id",
              as: "roomData"
            }
          },
          {
            $unwind: "$roomData"
          },
          {
            $group: {
              _id: null,
              revenue30Days: { $sum: "$roomData.price" }
            }
          }
        ])
      ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
    const revenue30Days = revenue30DaysAgg[0]?.revenue30Days || 0;

    res.json({
      success: true,
      data: {
        totalRooms,
        availableRooms,
        totalBookings,
        totalUsers,
        pendingBookings,
        totalRevenue,
        revenue30Days
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardSummary
};
