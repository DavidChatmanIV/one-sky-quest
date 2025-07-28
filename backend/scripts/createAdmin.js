require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "admin@oneskyquest.com";
    const plainPassword = "admin123";

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("⚠️ Admin already exists.");
      return mongoose.disconnect();
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const admin = new Admin({
      email,
      password: hashedPassword,
    });

    await admin.save();
    console.log("✅ Admin created:", admin.email);

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    mongoose.disconnect();
  }
}

createAdmin();
