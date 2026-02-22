const express = require("express");
const { register, login, getProfile, updateMyProfile } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateMyProfile);

module.exports = router;
