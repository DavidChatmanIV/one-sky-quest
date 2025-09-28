import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const { Schema } = mongoose;

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function isReasonablyStrong(pw) {
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /\d/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  const categories = [hasLower, hasUpper, hasDigit, hasSymbol].filter(
    Boolean
  ).length;
  return pw.length >= 8 && categories >= 2;
}

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // don't return by default
      validate: {
        validator: isReasonablyStrong,
        message:
          "Password must be 8+ chars and include at least two of: lowercase, uppercase, number, symbol.",
      },
    },
    role: {
      type: String,
      enum: ["superadmin", "support"],
      default: "support",
    },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

// Case-insensitive unique email index
adminSchema.index(
  { email: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  this.password = await bcrypt.hash(this.password, saltRounds);
  this.passwordChangedAt = new Date();
  next();
});

adminSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

adminSchema.methods.recordFailedLogin = async function () {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 5) {
    const lockMinutes = parseInt(process.env.LOGIN_LOCK_MINUTES || "15", 10);
    this.lockedUntil = new Date(Date.now() + lockMinutes * 60 * 1000);
  }
  await this.save();
};

adminSchema.methods.clearFailedLogins = async function () {
  this.failedLoginAttempts = 0;
  this.lockedUntil = undefined;
  await this.save();
};

adminSchema.methods.createPasswordResetToken = function () {
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  this.passwordResetToken = hash;
  const expireMinutes = parseInt(
    process.env.PASSWORD_RESET_EXPIRES_MIN || "15",
    10
  );
  this.passwordResetExpires = new Date(Date.now() + expireMinutes * 60 * 1000);
  return raw;
};

adminSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    return ret;
  },
});

adminSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email?.toLowerCase() }).collation({
    locale: "en",
    strength: 2,
  });
};

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export default Admin;
