const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");
const User = require('../models/users');
const { ensureAdmin } = require("../middleware/auth");
const { loginRules, validate, userRegistrationRules } = require("../validators");

function createToken(username, isAdmin=false) {
  const payload = { username, isAdmin };
  return jwt.sign(payload, SECRET)
}

// Log in user; return token.
// invalid creds should raise 401.
// returns { token : jwt-token-string }.
// raise 422 if the fields are blank
router.post("/login", loginRules(), validate, async (req, res, next) => {
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
// if any of the incoming data is invalid, raise 422.
router.post("/register", userRegistrationRules(), validate , async (req, res, next) => {
  try {
    const user = await User.register(req.body);
    const token = createToken(user.username, user.isAdmin);
    return res.status(200).json({ token });
  } catch(e) {
    return next(e)
  }
});

module.exports = router;