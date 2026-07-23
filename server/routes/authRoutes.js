// server/routes/authRoutes.js

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const TestResult = require('../models/TestResult');
const Admin = require('../models/Admin');
const nodemailer = require("nodemailer");
// --- MIDDLEWARE ---
const auth = (req, res, next) => {

  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // ✅ remove "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
  }
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const adminAuth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Check if admin
    if (decoded.type !== 'admin') {
      return res.status(403).json({ msg: "Access denied: Admin only" });
    }

    req.admin = decoded;
    next();

  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
  }
};




router.post('/admin/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { username, password } = req.body;

    let admin = await Admin.findOne({ username });
    if (admin) {
      return res.status(400).json({ msg: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    admin = new Admin({
      username,
      password: hashedPassword
    });

    await admin.save();

    res.status(201).json({ msg: 'Admin registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { username, type: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.json({
      msg: "Admin login successful",
      token,
    });
  }

  return res.status(401).json({
    msg: "Invalid credentials",
  });
});


// =====================================
// ADMIN: LIST USERS (sorted by most recent test activity)
// =====================================
// Previously this just did User.find().sort({ createdAt: -1 }), which
// meant the frontend had no real "lastTestDate" to sort on — every user
// fell back to their signup time, so newer accounts could outrank users
// who'd actually tested more recently.
//
// Fix: pull the most-recent TestResult.date per user straight from the
// TestResult collection via aggregation, attach it to each user as
// `lastTestDate`, and sort so that:
//   1) anyone with test activity ranks above anyone with none, and
//   2) within each group, most-recent activity comes first.
router.get('/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .lean();

    // One row per user: the max(date) among their TestResult docs.
    const lastTests = await TestResult.aggregate([
      { $group: { _id: "$user", lastTestDate: { $max: "$date" } } }
    ]);

    const lastTestMap = {};
    lastTests.forEach((t) => {
      if (t._id) lastTestMap[t._id.toString()] = t.lastTestDate;
    });

    const usersWithLastTest = users.map((u) => ({
      ...u,
      lastTestDate: lastTestMap[u._id.toString()] || null,
    }));

    usersWithLastTest.sort((a, b) => {
      const aHas = !!a.lastTestDate;
      const bHas = !!b.lastTestDate;
      if (aHas !== bHas) return aHas ? -1 : 1; // test-takers first

      const aTime = new Date(aHas ? a.lastTestDate : a.createdAt).getTime();
      const bTime = new Date(bHas ? b.lastTestDate : b.createdAt).getTime();
      return bTime - aTime; // most recent first
    });

    res.json({
      totalUsers: usersWithLastTest.length,
      users: usersWithLastTest
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/admin/user/:userId/results', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const results = await TestResult.find({ user: userId })
      .sort({ date: -1 });

    res.json({
      user,
      totalResults: results.length,
      results
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// =====================================
// 1️⃣ GET CURRENT USER (WITH TEST HISTORY)
// =====================================
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const testHistory = await TestResult
      .find({ user: req.user.id })
      .sort({ date: -1 });

    user.testHistory = testHistory;

    res.json(user);

  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).send('Server Error');
  }
});



// =====================================
// 2️⃣ REGISTER
// =====================================
router.post('/register', [
  check('fullname', 'Name is required').not().isEmpty(),
    check('phone', 'Phone number must be 10 digits').isLength({ min: 10, max: 10 }),
  check('email', 'Please include a valid email').isEmail(),
  check('city', 'City is required').not().isEmpty(),
check('study_preference', 'Study preference is required').not().isEmpty(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
const { fullname, email, phone, password, otp, study_preference, city } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({
  fullname,
  phone,
  email,
  password: hashedPassword,
  city,
  study_preference
});
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
         phone: user.phone,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});



// =====================================
// 3️⃣ LOGIN
// =====================================
router.post('/login', [
  
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
console.log("🔥 NEW AUTH ROUTES FILE LOADED 🔥");

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

const otpStore = {};

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // 🔴 CHECK COOLDOWN
    const existing = otpStore[email];

    if (existing && Date.now() < existing.nextAllowedTime) {
      const secondsLeft = Math.ceil((existing.nextAllowedTime - Date.now()) / 1000);
      return res.status(400).json({
        msg: `Please wait ${secondsLeft} seconds before requesting new OTP`
      });
    }

    // ✅ generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // ✅ store OTP + expiry + cooldown
    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,        // OTP valid 5 min
      nextAllowedTime: Date.now() + 30 * 1000     // 30 sec cooldown
    };

 await transporter.sendMail({
  from: `"TestX" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Password Reset OTP",
  text: `Your OTP is ${otp}. It is valid for 5 minutes.`
});

    res.json({ msg: "OTP sent to email" });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // check OTP exists
    const record = otpStore[email];

    if (!record) {
      return res.status(400).json({ msg: "OTP not found" });
    }

    // check OTP expiry
    if (Date.now() > record.expires) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    // verify OTP
    if (record.otp != otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // update password directly
    const result = await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    if (result.matchedCount === 0) {
      return res.status(400).json({ msg: "User not found" });
    }

    // delete OTP after successful reset
    delete otpStore[email];

    res.json({ msg: "Password reset successful" });

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;