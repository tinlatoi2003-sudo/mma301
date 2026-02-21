const jwt = require("jsonwebtoken");

function createToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = createToken;
