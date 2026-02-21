const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
