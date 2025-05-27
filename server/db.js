require("dotenv").config(); // ⬅️ Load environment variables
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

module.exports = connectToDB;
