const express = require('express');
const router = express.Router();
const { authRequired, ensureCorrectUser, ensureAdmin } = require("../middleware/auth");
const Ticket = require('../models/tickets');
const { ticketPostRules, validate } = require("../validators");
const { route } = require('./authRoutes');

// GET tickets/
// => { tickets : [{ticket, notes : [{}] }, {ticket, notes : [{}] }]}
router.get("/", async (req, res, next) => {
  try {
    const tickets = await Ticket.getAll();
    return res.status(200).json({ tickets })
  } catch(e) {
    return next(e)
  }
});

// POST tickets/search
// 404 if no tickets found
router.post("/search", async (req, res, next) => {
  try {
    const searchResults = await Ticket.search(req.body);
    return res.status(200).json({ searchResults })
  } catch(e) {
    return next(e)
  }
})

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
router.post("/", ticketPostRules(), validate ,async (req, res, next) => {
  try {
    const ticket = await Ticket.create(req.body);
    return res.status(200).json({ ticket });
  } 
  catch(e) {
    return next(e)
  }
});

// PUT /tickets/:ticketID
// => { ticket : { id, createdBy, assignedTo, createdAt, importanceLevel, closedAt ,isResolved, subject, requestDetail } }
// 404 if ticket does not exist
router.put("/:id", async (req, res, next) => {
  if('createdAt' in req.body) delete req.body['createdAt']; // doesn't make sense to update when the ticket was created.
  if('notes' in req.body) delete req.body['notes'];
  if('closedAt' in req.body) delete req.body['closedAt'];
  try {
    let ticket = await Ticket.update(req.params.id, req.body);
    return res.status(200).json({ ticket })
  } catch(e) {
    return next(e)
  }
});

// POST /tickets/:ticketID/notes
// => { ticket : { ticketData, notes : [{ noteData }] } }
// 404 if the ticket does not exist.
router.post("/:id/notes", async (req, res, next) => {
  try {
    const ticket = await Ticket.createNotes(req.params.id, req.body);
    return res.status(200).json({ ticket })
  } catch(e) {
    return next(e)
  }
});

// PUT /tickets/:ticketID/notes/:id
// => { ticket : { ticketData, notes : [{ noteData }] } }
// 404 if the ticket does not exist
router.put("/:ticketID/notes/:id", async (req, res, next) => {
 
  try {
  
    const ticket = await Ticket.updateNotes(req.params.ticketID, req.params.id, req.body);
    return res.status(200).json({ ticket });
  } catch(e) {
    return next(e)
  }
});

// DELETE /tickets/:ticketID/notes/:id
// => { ticket : { ticketData, notes : [{Object}] } }
// 404 if the ticket or the note doesn't exist
router.delete('/:ticketID/notes/:id', async (req, res, next) => {
  try {
    const { ticketID, id } = req.params;
    await Ticket.deleteNote(ticketID, id);
    return res.status(200).json({ message : 'deleted note' });
  } catch(e) {
    return next(e)
  }
});


// DELETE /tickets/:id
// => { message : 'deleted' }
router.delete('/:id', async (req, res, next) => {
  try {
    await Ticket.destroy(req.params.id);
    return res.status(200).json({ message : 'deleted' })
  } catch(e) {
    return next(e)
  }
});

module.exports = router;