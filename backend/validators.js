const { body, validationResult } = require("express-validator");

const userRegistrationRules = () => {
  return [
    body("email", "Invalid Email").not().isEmpty().isEmail(),
    body("username", "username cannot be blank").not().isEmpty().trim().escape(),
    body("password", "password cannot be blank").not().isEmpty(),
    body("firstName", "firstName cannot be blank").not().isEmpty(),
    body("lastName", "lastName cannot be blank").not().isEmpty(),
  ];
};

const loginRules = () => {
  return [
    body("username").not().isEmpty(), 
    body("password").not().isEmpty()
  ];
};

const ticketPostRules = () => {
  return [
    body("createdBy", "createdBy cannot be blank").not().isEmpty(),
    body("assignedTo", "assignedTo cannot be blank").not().isEmpty(),
    body("isResolved", "Is this ticket open? or closed?").not().isEmpty().isBoolean(),
    body("subject", "Enter subject").not().isEmpty(),
    body("requestDetail", "Enter request details").not().isEmpty(),
    body("assignedGroup", "Select valid group").isIn(["F_STACK", "F_END", "B_END"]),
    body("importanceLevel", "Select importance level").isInt(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  return res.status(422).json({ errors : extractedErrors })
};

module.exports = { userRegistrationRules, loginRules, ticketPostRules, validate };
