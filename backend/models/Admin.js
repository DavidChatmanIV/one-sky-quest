const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
});

// Automatically hash password before saving
adminSchema.pre("save", async function (next) {
if (!this.isModified("password")) return next();
this.password = await bcrypt.hash(this.password, 10);
next();
});

// Add method to compare password
adminSchema.methods.comparePassword = function (input) {
return bcrypt.compare(input, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
