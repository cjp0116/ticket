const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");
const User = require('../models/users');
const { ensureAdmin } = require("../middleware/auth");

function createToken(username, admin=false) {
  const payload = { username, admin };
  return jwt.sign(payload, SECRET)
}

// Log in user; return token.
// invalid creds should raise 401.
// returns { token : jwt-token-string }.
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body);
    const token = createToken(user.username);
    return res.json({ token })
  } catch(e) {
    return next(e)
  }
});

// Registers users, only designated admins can register users.
// returns { token : jwt-token-string }.
// incorrect usernames/pw should raise 409.
router.post("/register", ensureAdmin, async (req, res, next) => {
  try {
    const user = await User.reigster(req.body);
    const token = createToken(user.username, user.isAdmin);
    return res.json({ token });
  } catch(e) {
    return next(e)
  }
});

module.exports = router;