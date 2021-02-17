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
    const res = await db.query(
      `INSERT INTO tickets 
        (createdBy, 
          assignedTo, 
          createdAt, 
          importanceLevel, 
          isResolved, 
          subject, requestDetail
        )
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`, [data.createdBy, data.assignedTo, data.createdAt, data.importanceLevel, data.isResolved, data.subject, data.requestDetail]
    );
    const ticket = res.rows[0];
    return ticket;
  };

  static async getById(id) {
    const res = await db.query('select * from tickets where id = $1', [id]);
    if(!res.rowCount) {
      throw new ExpressError('ticket does not exist', 404)
    };
    const noteRes = await db.query('select * from notes where ticketID = $1', [id]);
    const ticket = res.rows[0];
    ticket.notes = noteRes.rows[0];
    return ticket;
  };

  static async update(ticketID, data) {
    if(data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORKFACTOR)
    }
    const { query, values } = sqlForPartialUpdate('tickets', data, 'ticketID', ticketID);
    const res = await db.query(query, values);
    if(!res.rowCount) {
      throw new ExpressError('Ticket does not exist', 404)
    }
    return res.rows[0]
  };

  static async destroy(ticketID, data) { 
    const checkIfExists = await db.query('select * from tickets where id = $1', [ticketID]);
    if(!checkIfExists.rowCount) {
      throw new ExpressError('Ticket does not exist', 404)
    };
    const res = await db.query('delete from tickets where id = $1', [ticketID])
  }
};

module.exports = Ticket;