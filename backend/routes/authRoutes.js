const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { SECRET, DB_URI } = require("../config");
const User = require('../models/users');
const { ensureAdmin } = require("../middleware/auth");


function createToken(username, isAdmin=false) {
  const payload = { username, isAdmin };
  return jwt.sign(payload, SECRET)
}

// Log in user; return token.
// invalid creds should raise 401.
// returns { token : jwt-token-string }.
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body);
    const token = createToken(user.username);
    return res.status(201).json({ token })
  } catch(e) {
    return next(e)
  }
});

// Registers users, only designated admins can register users.
// returns { token : jwt-token-string }.
// incorrect usernames/pw should raise 409.
// if they're not a admin, should raise 401.
router.post("/register", async (req, res, next) => {
  try {
    const user = await User.register(req.body);
    const token = createToken(user.username, user.isAdmin);
    return res.status(201).json({ token });
  } catch(e) {
    return next(e)
  }
});

module.exports = router;