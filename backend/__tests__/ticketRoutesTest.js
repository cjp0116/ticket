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
    const res = await request(app).post("/tickets").send({
      createdBy : "testUser1",
      assignedTo : "testUser3",
      importanceLevel : 2,
      isResolved : false,
      subject : "testSubject",
      requestDetail : "testRequestDetail"
    });
    console.log(res.body)
    // expect(res.statusCode).toBe(200);
    // expect(res.body.ticket.subject).toBe('testSubject');
  });
});

describe('')

afterEach(async () => {
  await db.query(`DELETE from tickets`);
  await db.query(`DELETE from users`);
});

afterAll(() => db.end());