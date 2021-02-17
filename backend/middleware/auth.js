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
    throw new ExpressError('You are not authorized', 401)
  } catch(e) {
    return next(e)
  } 
};

function ensureAdmin(req, res, next) {
  try {
    const tokenStr = req.body._token || req.query._token;
    let token = jwt.verify(tokenStr, SECRET);
    req.username = token.username;
    if(token.isAdmin) return next();

    throw new ExpressError('Not authorized', 401);

  } catch(e) {
    return next(e)
  }
}

module.exports = { authRequired, ensureCorrectUser, ensureAdmin };
