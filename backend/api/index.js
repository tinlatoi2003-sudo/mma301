const app = require("../app");
const connectDatabase = require("../config/database");

module.exports = async (req, res) => {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Failed to handle request", error);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to the database"
    });
  }
};
