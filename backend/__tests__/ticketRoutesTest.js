process.env.NODE_ENV = 'test';

const app = require("../app");
const db = require("../db");
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { SECRET } = require("../config");

function createToken(username, isAdmin = false) {
  const payload = { username, isAdmin };
  return jwt.sign(payload, SECRET);
};

const tokens = {};
beforeEach(async () => {
  async function _pwd(password) {
    return await bcrypt.hash(password, 1);
  };
  let sampleUsers = [
    ['test1@gmail.com', 'testUser1', await _pwd('pw1'), 'Jae', 'Cho', 'B_END', false],
    ['test2@gmail.com', 'testUser2', await _pwd('pw2'), 'Carol', 'Yoo', 'B_END', false],
    ['test3@gmail.com', 'testUser3', await _pwd('pw3'), 'Courtney', 'Kim', 'F_STACK', true] // testUser3 is admin
  ];
  for(const user of sampleUsers) {
    await db.query(
      `INSERT INTO users (email, username, password, firstName, lastName, deptCode, isAdmin)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`, user
    );
    tokens[user[1]] = createToken(user[1], user[6]);
  };
  let sampleTickets = [
    [1,'testUser1', 'testUser2', 5, false, 'testTicketSubject1', 'testRequestDetail1'],
    [2, 'testUser2', 'testUser1', 5, true, 'testTicketSubject2', 'testRequestDetail2'],
    [3, 'testUser3', 'testUser1', 5, false, 'testTicketSubject3', 'testRequestDetail3'],
  ];
  for(const ticket of sampleTickets) {
    await db.query(`
      INSERT INTO tickets 
      (id, createdBy, assignedTo, importanceLevel, isResolved, subject, requestDetail)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`, ticket
    );
  }
});

describe('GET tickets/', () => {
  test('It should return a array of tickets', async () => {
    const res = await request(app).get('/tickets');
    expect(res.statusCode).toBe(200);
  });
});

describe('GET /tickets/:id', () => {
  test('It should return info about ticket', async () => {
    const res = await request(app).get('/tickets/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.ticket.id).toBe(1);
  });
  test('It should raise 404 if ticket not found', async () => {
    const res = await request(app).get('/tickets/984894');
    expect(res.statusCode).toBe(404);
    expect(res.body.error.msg).toBe('ticket does not exist');
  });
});

describe('POST tickets/', () => {
  test('It should create a ticket', async () => {
    const res = await request(app).post("/tickets/").send({
      createdBy : "testUser1",
      assignedTo : "testUser3",
      importanceLevel : 2,
      isResolved : false,
      subject : "testSubject",
      requestDetail : "testRequestDetail"
    });
    expect(res.statusCode).toBe(200);
    const ticket = res.body.ticket
    expect(ticket.createdby).toBe('testUser1');
    expect(ticket.assignedto).toBe('testUser3');
    expect(ticket.requestdetail).toBe('testRequestDetail');
  });
});

describe('PUT /tickets/:id', () => {
  test('It should update a ticket', async () => {
    const res = await request(app).put(`/tickets/1`).send({
      createdBy : 'testUser3',
      assignedTo : 'testUser1',
      subject : 'updatedSubject',
      isResolved : true
    });
    expect(res.statusCode).toBe(200);
    const { ticket } = res.body;
    expect(ticket.createdby).toBe('testUser3');
    expect(ticket.assignedto).toBe('testUser1');
    expect(ticket.subject).toBe('updatedSubject');
    expect(ticket.isresolved).toBe(true);
  });
  test('Raises 404 if ticket not exists', async () => {
    const res = await request(app).patch('/tickets/687465435').send({
      createdBy : "cjp0116"
    });
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /tickets/:id', () => {
  test('It should delete a ticket', async () => {
    const res = await request(app).delete('/tickets/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('deleted');
  });
  test('Should raise a 404 if that ticket does not exist', async () => {
    const res = await request(app).delete('/tickets/65476546');
    expect(res.statusCode).toBe(404)
  })
});

describe('POST /tickets/:id/notes', () => {
  test('It should add notes to an existing ticket', async () => {
    const res = await request(app).post('/tickets/1/notes').send({
      createdBy : 'testUser1',
      message : 'testMessage'
    });
    expect(res.statusCode).toBe(200);
    const { notes } = res.body.ticket;
    const note = notes[0];
    expect(note.ticketid).toBe(1);
    expect(note.createdby).toBe('testUser1');
    expect(note.message).toBe('testMessage');
  });
  test('404 if the ticket does not exist', async () => {
    const res = await request(app).post('/tickets/65874685/notes').send({
      createdBy : 'testUser1',
      message : 'lmao'
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.error.msg).toBe('Ticket does not exist');
  });
});

describe('PUT /tickets/:id/notes', () => {
  test('It should update notes on valid tickets', async () => {
    await db.query(`INSERT INTO notes (id, ticketID, createdBy, message) VALUES ($1, $2, $3, $4)`, [1, 1, 'testUser1', 'testNote1']);
    const res = await request(app).put('/tickets/1/notes/1').send({
      createdBy : 'testUser2',
      message : 'It should update to this now'
    });
    expect(res.statusCode).toBe(200);
    const note = res.body.ticket.notes[0];
    expect(note.createdby).toBe('testUser2');
    expect(note.message).toBe('It should update to this now');
  });
  test('404 if the ticket does not exist', async () => {
    const res = await request(app).put('/tickets/45648/notes/654654').send({
      createdBy : `It shouldn't even work lmao`
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.error.msg).toBe('Ticket does not exist')
  });
});

describe('DELETE /tickets/:ticketID/notes/:id', () => {
  test('It should delete a note within a ticket', async () => {
    await db.query(`INSERT INTO notes (id, ticketID, createdBy, message) VALUES ($1, $2, $3, $4)`, [1, 1, 'testUser1', 'test message']);
    const res = await request(app).delete('/tickets/1/notes/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('deleted note');
  });
  test('404 if the ticket is not found', async () => {
    const res = await request(app).delete('/tickets/56465/notes/1');
    expect(res.statusCode).toBe(404);
    expect(res.body.error.msg).toBe('Ticket does not exist');
  });
  test('404 if the note is not found', async () => {
    const res = await request(app).delete('/tickets/1/notes/968494');
    expect(res.statusCode).toBe(404);
    expect(res.body.error.msg).toBe('Note does not exist');
  })
})

afterEach(async () => {
  await db.query(`DELETE from notes`);
  await db.query(`DELETE from tickets`);
  await db.query(`DELETE from users`);
});

afterAll(() => db.end());