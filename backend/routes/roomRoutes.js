const express = require("express");
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} = require("../controllers/roomController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getRooms);
router.get("/:id", getRoomById);
router.post("/", authMiddleware, adminOnly, createRoom);
router.put("/:id", authMiddleware, adminOnly, updateRoom);
router.delete("/:id", authMiddleware, adminOnly, deleteRoom);

module.exports = router;
