import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "support"],
      default: "support",
    },
  },
  { timestamps: true }
);

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

// ✅ Export as default (ESM style)
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;
