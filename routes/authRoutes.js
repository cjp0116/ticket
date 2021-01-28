const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");
const User = require('../models/users')
// function createToken(user) {
//   let payload = { username : user.username };
//   return jwt.sign(payload, SECRET)
// };

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body);
    const payload = { username : user.username };
    const token = jwt.sign(payload, SECRET);
    return res.json({ token })
  } catch(e) {
    return next(e)
  }
});



module.exports = router;