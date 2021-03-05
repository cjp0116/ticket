const db = require('../db');
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const ExpressError = require('../ExpressError');
const bcrypt = require('bcrypt');
const BCRYPT_WORKFACTOR = 10;

class Ticket {
  static async getAll() {
    const tickets = await db.query(`SELECT * FROM tickets`);
    for(const ticket of tickets.rows) {
      const notes = await db.query(`SELECT * FROM notes WHERE ticketID = $1`, [ticket.id]);
      ticket.notes = notes.rows[0]
    };
    return tickets.rows;
  }
  
  static async create(data) {
    let notes;
    const res = await db.query(
      `INSERT INTO tickets 
        (createdBy, 
          assignedTo, 
          importanceLevel, 
          isResolved, 
          subject, 
          requestDetail,
          assignedGroup
        )
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`, [
          data.createdBy, 
          data.assignedTo, 
          data.importanceLevel, 
          data.isResolved, 
          data.subject, 
          data.requestDetail,
          data.assignedGroup
        ]
    );
    const ticket = res.rows[0];
    if(data.notes) {
      notes = await db.query(
        `INSERT INTO notes (ticketID, createdBy, message) 
        VALUES ($1, $2, $3)
        RETURNING *`, [ticket.id, data.createdBy, data.notes]
      );
      ticket.notes = notes.rows
    }
    return ticket;
  };

  static async getById(id) {
    const res = await db.query('select * from tickets where id = $1', [id]);
    if(!res.rowCount) {
      throw new ExpressError('ticket does not exist', 404)
    };
    const noteRes = await db.query('select * from notes where ticketID = $1', [id]);
    const ticket = res.rows[0];
    ticket.notes = noteRes.rows;
    return ticket;
  };

  static async update(ticketID, data) {
    if(data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORKFACTOR)
    }
    const { query, values } = sqlForPartialUpdate('tickets', data, 'id', ticketID);
    const res = await db.query(query, values);
    if(!res.rowCount) {
      throw new ExpressError('Ticket does not exist', 404)
    }
    return res.rows[0]
  };

  static async destroy(ticketID) { 
    const checkIfExists = await db.query('select * from tickets where id = $1', [ticketID]);
    if(!checkIfExists.rowCount) {
      throw new ExpressError('Ticket does not exist', 404)
    };
    const res = await db.query('delete from tickets where id = $1', [ticketID])
  };

  // NOTES 
  static async createNotes(ticketID, data) {
    const ticketRes = await db.query(`SELECT * FROM tickets WHERE id = $1`, [ticketID]);
    if(!ticketRes.rowCount) {
      throw new ExpressError('Ticket does not exist', 404);
    }
    const notes = await db.query(
      `INSERT INTO notes (ticketID, createdBy, message) 
      VALUES ($1, $2, $3)
      RETURNING *`, [ticketID, data.createdBy, data.message]
    );
    const ticket = ticketRes.rows[0];
    ticket.notes = notes.rows;
    return ticket;
  };

  static async updateNotes(ticketID, id, data) {
    const ticketRes = await db.query(`SELECT * FROM tickets WHERE id = $1`, [ticketID]);
    if(!ticketRes.rowCount) throw new ExpressError('Ticket does not exist', 404);
    const { query, values } = sqlForPartialUpdate('notes', data, 'id', id);
    const notes = await db.query(query, values);
    ticketRes.rows[0].notes = notes.rows;
    return ticketRes.rows[0]; 
  };

  static async deleteNote(ticketID, id) {
    const ticket = await db.query(`SELECT * FROM tickets WHERE id = $1`, [ticketID]);
    if(!ticket.rowCount) throw new ExpressError('Ticket does not exist', 404);
    const notes = await db.query(`SELECT * FROM notes WHERE id = $1`, [id]);
    if(!notes.rowCount) throw new ExpressError('Note does not exist', 404);
    await db.query(`DELETE FROM notes WHERE id = $1`, [id]);
    return await Ticket.getById(ticketID);
  }
};

module.exports = Ticket;