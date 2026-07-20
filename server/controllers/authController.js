const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * POST /api/auth/signup
 */
const signup = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already exists' });
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    password,
    role: 'user', // Defaults to user based on schema anyway
  });

  const token = signToken(user);
  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
  });
});

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = signToken(user);
  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
  });
});

/**
 * POST /api/auth/seed-admin
 * One-time convenience endpoint to create the first admin user from .env values.
 * Disable or remove this route once your admin account exists in production.
 */
const seedAdmin = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Admin already exists' });
  }
  const admin = await User.create({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'admin',
  });
  res.status(201).json({ success: true, message: 'Admin created', email: admin.email });
});

/**
 * PUT /api/auth/profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  const token = signToken(updatedUser);

  res.json({
    success: true,
    token,
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
    },
  });
});

module.exports = { signup, login, seedAdmin, updateProfile };
