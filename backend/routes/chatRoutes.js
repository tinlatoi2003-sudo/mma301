const express = require("express");
const {
  getConversations,
  getMessages,
  createMessage
} = require("../controllers/chatController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/conversations", getConversations);
router.get("/conversations/:id/messages", getMessages);
router.post("/conversations/:id/messages", createMessage);

module.exports = router;
