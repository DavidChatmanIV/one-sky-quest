import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user.js";

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || "oneSkyQuestDB",
    });

    // Add additional models as you create them:
    const userRes = await User.syncIndexes();
    console.log("User.syncIndexes():", userRes);

    await mongoose.disconnect();
    console.log("✅ Index sync complete");
  } catch (err) {
    console.error("Index sync failed:", err);
    process.exit(1);
  }
}
main();
