const User = require("../models/User");

/**
 * 🔼 Add XP to a user
 * @param {String} userId - MongoDB user _id
 * @param {Number} amount - XP amount to add
 * @returns {Boolean} true if XP was added, false otherwise
 */
async function addXP(userId, amount) {
  if (!userId || typeof amount !== "number") return false;

  try {
    const user = await User.findById(userId);
    if (!user) return false;

    user.xp += amount;
    await user.save();

    console.log(`✅ ${amount} XP added to user ${user.username}`);
    return true;
  } catch (err) {
    console.error("❌ Error adding XP:", err.message);
    return false;
  }
}

module.exports = addXP;
