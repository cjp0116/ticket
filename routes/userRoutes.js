const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authRequired, ensureCorrectUser } = require("../middleware/auth");
const User = require('../models/users');

// GET /users
// => { users : [{user}, {user}]}
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({ users })
  } catch(e) {
    return next(e)
  }
});

// GET /users/:username
// => { user : { username, email, firstName, lastName, deptCode }}
router.get("/:username", async (req, res, next) => {
  try {
    const user = await User.findOne(req.params.username);
    return res.status(200).json({ user })
  } catch(e) {
    return next(e)
  }
});

// POST /users
// => { user : { username, email, firstName, lastName, deptCode} }
router.post("/", async (req, res, next) => {
  try {
    const user = await User.register(req.body);
    return res.status(200).json({ user })
  } catch(e) {
    return next(e)
  }
});

 // DELETE /users/:username
 router.delete('/:username', async (req, res, next) => {
   try {
    await User.remove(req.params.username);
    return res.status(200).json({ message : 'deleted' }) 
   } catch(e) {
     return next(e)
   }
 });

 // PATCH /users/:username
 // needs pw of current user.
 router.patch("/:username", async (req, res, next) => {
   try {
    const updatedUser = await User.update(req.params.username, req.body)
   } catch(e) {
     return next(e)
   }
 });

 module.exports = router;