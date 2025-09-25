// backend/models/Admin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["superadmin", "support"],
    default: "support",
  },
});

// 🔐 Automatically hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Method to compare password during login
adminSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
