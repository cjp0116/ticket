const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");
const ExpressError = require("../ExpressError");

function authRequired(req, res, next) {
  try {
    const tokenStr = req.body._token || req.query._token;
    let token = jwt.verify(tokenStr, SECRET);
    req.username = token.username;
    return next();
  } catch(e) {
    return next(new ExpressError("You must authenticate first.", 401))
  }
};

function ensureCorrectUser(req, res, next) {
  try {
    const tokenStr = req.body._token || req.query._token;
    let token = jwt.verify(tokenStr, SECRET);
    req.username = token.username;
    if(token.username === req.params.username) {
      return next()
    }
  } catch(e) {
    return next(new ExpressError('You are not authorized', 401))
  } 
};

module.exports = { authRequired, ensureCorrectUser };
