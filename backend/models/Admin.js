import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const { Schema } = mongoose;

const ALLOWED_ROLES = ["superadmin", "support"];
const EMAIL_REGEX = /^\S+@\S+\.\S+$/; // keep strict but not overly brittle

// Optional: enable a simple password complexity check (length + mix)
// Tweak as you like or remove if you prefer only minlength.
function isReasonablyStrong(pw) {
  // At least 8 chars, with 2 of the following categories present
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

    // Never return password by default
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
      validate: {
        validator: isReasonablyStrong,
        message:
          "Password must be 8+ chars and include at least two of: lowercase, uppercase, number, symbol.",
      },
    },

    role: {
      type: String,
      enum: ALLOWED_ROLES,
      default: "support",
      immutable: false,
    },

    // ---- Security posture fields ----
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date }, // if set, disallow login before this time
    passwordChangedAt: { type: Date },

    // ---- Password reset flow ----
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

// Case-insensitive unique index for email.
// NOTE: Your MongoDB must support collations.
// When querying by email, include the same collation or store emails lowercased (we do both).
adminSchema.index(
  { email: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

// Pre-save: hash password if modified, and bump passwordChangedAt
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  this.password = await bcrypt.hash(this.password, saltRounds);
  this.passwordChangedAt = new Date();
  next();
});

// Compare password (returns boolean)
adminSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// Mark password changed manually (e.g., in a service flow)
adminSchema.methods.markPasswordChanged = function () {
  this.passwordChangedAt = new Date();
};

// Increment failed logins and optionally set a lock time
// Example policy: lock for 15 minutes after 5 failed attempts
adminSchema.methods.recordFailedLogin = async function () {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 5) {
    const lockMinutes = parseInt(process.env.LOGIN_LOCK_MINUTES || "15", 10);
    this.lockedUntil = new Date(Date.now() + lockMinutes * 60 * 1000);
  }
  await this.save();
};

// Clear failed logins on successful auth
adminSchema.methods.clearFailedLogins = async function () {
  this.failedLoginAttempts = 0;
  this.lockedUntil = undefined;
  await this.save();
};

// Create & set a password reset token (hashed in DB), returns raw token
adminSchema.methods.createPasswordResetToken = function () {
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");

  this.passwordResetToken = hash;
  const expireMinutes = parseInt(
    process.env.PASSWORD_RESET_EXPIRES_MIN || "15",
    10
  );
  this.passwordResetExpires = new Date(Date.now() + expireMinutes * 60 * 1000);

  return raw; // send this to user via email; only the hash is stored
};

// Hide sensitive fields when converting to JSON
adminSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    return ret;
  },
});

// Helpful static: find by email (always lowercase)
adminSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email?.toLowerCase() });
};

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;
