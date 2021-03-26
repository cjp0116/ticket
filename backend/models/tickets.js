const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const ExpressError = require("../ExpressError");

class Ticket {
  static async search(data) {
    let baseQuery = `SELECT * FROM tickets`;
    let whereExpressions = [];
    let queryValues = [];
    if (+data.importanceLevel > 5) {
      throw new ExpressError(
        "Please select values between 1 - 5 or completely omit it",
        422
      );
    }
    if (data.dateFrom > data.dateTo) {
      throw new ExpressError(
        "Do you have a time machine? Check the dates again",
        422
      );
    }
    if (data.ticketID) {
      queryValues.push(+data.ticketID);
      whereExpressions.push(`id = $${queryValues.length}`);
    }
    // If you supply both, it'll look in between start - end range
    if (data.dateFrom && data.dateTo) {
      queryValues.push(`${data.dateFrom}`);
      queryValues.push(`${data.dateTo}`);
      whereExpressions.push(
        `createdAt BETWEEN $${queryValues.length} AND $${queryValues.length}`
      );
    }
    // If you only supply end Date, it'll search for everything up to supplied date.
    else if (data.dateTo) {
      queryValues.push(`${data.dateTo}`);
      whereExpressions.push(`createdAt <= $${queryValues.length}`);
    }
    // If you only supplyl start date, it'll search for everyfrom that supplied date to latest date.
    else if (data.dateFrom) {
      queryValues.push(`${data.dateFrom}`);
      whereExpressions.push(`createdAt >= ${queryValues.length}`);
    }
    if (data.createdBy) {
      queryValues.push(`%${data.createdBy}%`);
      whereExpressions.push(`createdBy ILIKE $${queryValues.length}`);
    }
    if (data.assignedTo) {
      queryValues.push(`${data.assignedTo}`);
      whereExpressions.push(`assignedTo ILIKE $${queryValues.length}`);
    }
    if (data.isResolved) {
      queryValues.push(data.isResolved);
      whereExpressions.push(`isResolved = $${queryValues.length}`);
    }
    if (data.importanceLevel) {
      queryValues.push(+data.importanceLevel);
      whereExpressions.push(`importanceLevel = $${queryValues.length}`);
    }
    if (data.assignedGroup) {
      queryValues.push(`${data.assignedGroup}`);
      whereExpressions.push(`assignedGroup = $${queryValues.length}`);
    }
    if (whereExpressions.length > 0) {
      baseQuery += " WHERE ";
    }

    let finalQuery = baseQuery + whereExpressions.join(" AND ");
    const results = await db.query(finalQuery, queryValues);
    return results.rows;
  }

  static async getAll() {
    try {
      const tickets = await db.query(`SELECT * FROM tickets`);
      for (const ticket of tickets.rows) {
        const notes = await db.query(
          `SELECT * FROM notes WHERE ticketID = $1`,
          [ticket.id]
        );
        ticket.notes = notes.rows;
      }
      return tickets.rows;
    } catch (e) {
      console.error(e);
    }
  }

  static async create(data) {
    try {
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
           RETURNING *`,
        [
          data.createdBy,
          data.assignedTo,
          data.importanceLevel,
          data.isResolved,
          data.subject,
          data.requestDetail,
          data.assignedGroup,
        ]
      );
      const ticket = res.rows[0];
      if (data.notes) {
        notes = await db.query(
          `INSERT INTO notes (ticketID, createdBy, message) 
          VALUES ($1, $2, $3)
          RETURNING *`,
          [ticket.id, data.createdBy, data.notes]
        );
        ticket.notes = notes.rows;
      }
      return ticket;
    } catch (e) {
      console.error(e);
    }
  }

  static async getById(id) {
    try {
      const res = await db.query("select * from tickets where id = $1", [id]);
      if (!res.rowCount) {
        throw new ExpressError("ticket does not exist", 404);
      }
      const noteRes = await db.query(
        "select * from notes where ticketID = $1",
        [id]
      );
      const ticket = res.rows[0];
      ticket.notes = noteRes.rows;
      return ticket;
    } catch (e) {
      console.error(e);
    }
  }

  static async update(ticketID, data) {
    try {
      if(data.isResolved) {
        data.closedAt = new Date();
      }
      const { query, values } = sqlForPartialUpdate(
        "tickets",
        data,
        "id",
        ticketID
      );
      const res = await db.query(query, values);
      if (!res.rowCount) {
        console.log(res);
        throw new ExpressError("Ticket does not exist", 404);
      }
      return res.rows[0];
    } catch (e) {
      console.error(e);
    }
  }

  static async destroy(ticketID) {
    const checkIfExists = await db.query(
      "select * from tickets where id = $1",
      [ticketID]
    );
    if (!checkIfExists.rowCount) {
      throw new ExpressError("Ticket does not exist", 404);
    }
    const res = await db.query("delete from tickets where id = $1", [ticketID]);
  }

  // NOTES
  static async createNotes(ticketID, data) {
    try {
      const ticketRes = await db.query(`SELECT * FROM tickets WHERE id = $1`, [
        ticketID,
      ]);
      if (!ticketRes.rowCount) {
        throw new ExpressError("Ticket does not exist", 404);
      }
      const notes = await db.query(
        `INSERT INTO notes (ticketID, createdBy, message) 
        VALUES ($1, $2, $3)
        RETURNING *`,
        [ticketID, data.createdBy, data.message]
      );
      const ticket = ticketRes.rows[0];
      const allNotesForThatTicket = await db.query(
        "SELECT * FROM notes WHERE ticketID = $1",
        [ticketID]
      );
      ticket.notes = allNotesForThatTicket.rows;
      return ticket;
    } catch (e) {
      console.error(e);
    }
  }

  static async updateNotes(ticketID, id, data) {
    try {
      const ticketRes = await db.query(`SELECT * FROM tickets WHERE id = $1`, [
        ticketID,
      ]);
      if (!ticketRes.rowCount)
        throw new ExpressError("Ticket does not exist", 404);
      const { query, values } = sqlForPartialUpdate("notes", data, "id", id);
      const notes = await db.query(query, values);
      const allNotesForThatTicket = await db.query(
        "SELECT * FROM notes WHERE ticketID = $1",
        [ticketID]
      );
      ticketRes.rows[0].notes = allNotesForThatTicket.rows;
      return ticketRes.rows[0];
    } catch (e) {
      console.error(e);
    }
  }

  static async deleteNote(ticketID, id) {
    try {
      const ticket = await db.query(`SELECT * FROM tickets WHERE id = $1`, [
        ticketID,
      ]);
      if (!ticket.rowCount)
        throw new ExpressError("Ticket does not exist", 404);
      const notes = await db.query(`SELECT * FROM notes WHERE id = $1`, [id]);
      if (!notes.rowCount) throw new ExpressError("Note does not exist", 404);
      await db.query(`DELETE FROM notes WHERE id = $1`, [id]);
      return await Ticket.getById(ticketID);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = Ticket;
