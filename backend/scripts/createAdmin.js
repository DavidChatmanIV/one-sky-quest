require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../backend/models/Admin");
const bcrypt = require("bcryptjs");

const run = async () => {
try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB ✅");

    const email = "admin@example.com";
    const password = "securepassword123";

    const existing = await Admin.findOne({ email });
    if (existing) {
    console.log("Admin already exists.");
    } else {
    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: hashed });
    console.log("✅ Admin created:", admin);
    }

    mongoose.disconnect();
} catch (err) {
    console.error("❌ Error creating admin:", err);
    mongoose.disconnect();
}
};

run();
