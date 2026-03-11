const express = require("express");
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  payBookingSandbox
} = require("../controllers/bookingController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createBooking);
router.get("/mine", authMiddleware, getMyBookings);
router.get("/", authMiddleware, adminOnly, getAllBookings);
router.patch("/:id/status", authMiddleware, adminOnly, updateBookingStatus);
router.post("/:id/pay-sandbox", authMiddleware, payBookingSandbox);

module.exports = router;
