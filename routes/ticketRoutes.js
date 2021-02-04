const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authRequired, ensureCorrectUser, ensureAdmin } = require("../middleware/auth");
const Ticket = require('../models/tickets');

// GET /tickets
// => { tickets : [{ticket}, {ticket}]}
router.get("/", async (req, res, next) => {
  try {
    const tickets = await Ticket.getALL();
    return res.status(200).json({ tickets })
  } catch(e) {
    return next(e)
  }
});

// GET /tickets/:ticketID
// => { ticket : { createdBy, assignedTo, createdAt, importanceLevel, closedAt, isResolved, notes : { } } }
router.get('/:id', async (req, res, next) => {
  try {
    const ticket = await Ticket.getById(req.params.id);
    return res.status(200).json({ ticket })
  } catch(e) {
    return next(e)
  }
});

// POST /tickets/
// => { ticket : { createdBy,  assignedTo, importanceLevel, closedAt, isResolved }}
router.post("/", async (req, res, next) => {
  try {
    const ticket = await Ticket.create(req.body);
    return res.status(200).json({ ticket });
  } 
  catch(e) {
    return next(e)
  }
});

// PUT /tickets/:ticketID
// => { ticket : { } }

module.exports = router;