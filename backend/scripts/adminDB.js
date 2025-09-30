const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI);

(async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = new Admin({
    email: "admin@oneskyquest.com",
    password: hashedPassword,
  });
  await admin.save();
  console.log("✅ Admin created");
  mongoose.disconnect();
})();
