const generateReferralCode = (username) => {
  return `ONE_${username.toUpperCase().slice(0, 5)}${Math.floor(
    Math.random() * 1000
  )}`;
};

// inside your register logic
const referralCode = generateReferralCode(username);

// Optional: check if URL has a ?ref= parameter
const referredBy = req.query.ref || null;

const newUser = new User({
  username,
  email,
  password: hashedPassword,
  referralCode,
  referredBy,
});
await newUser.save();
