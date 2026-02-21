const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDatabase = require("./config/database");
const Room = require("./models/Room");
const User = require("./models/User");
const sampleRooms = require("./sampleRooms");

dotenv.config();

async function runSeed() {
  try {
    await connectDatabase();
    
    // Clear existing data
    await Room.deleteMany({});
    await User.deleteMany({});
    
    // Insert sample rooms
    await Room.insertMany(sampleRooms);
    console.log("Room data inserted successfully");
    
    // Create admin user
    const hashedPassword = await bcrypt.hash("123456", 10);
    const adminUser = await User.create({
      fullName: "Admin User",
      email: "admin@gmail.com",
      password: hashedPassword,
      phone: "0123456789",
      role: "admin"
    });
    console.log("Admin user created successfully:", adminUser.email);
    
    console.log("Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed", error);
    process.exit(1);
  }
}

runSeed();
