process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest');
const db = require("../db");
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");

const tokens = {};

function createToken(username, isAdmin=false) {
  let payload = { username, isAdmin };
  return jwt.sign(payload, SECRET);
};

beforeEach(async () => {
  async function _pwd(password) {
    return await bcrypt.hash(password, 1); // bcrypt workfactor lowered for speed.
  };
  let sampleUsers = [
    ['test1@gmail.com', 'testUser1', await _pwd('pw1'), 'Jae', 'Cho', 'F_END', false],
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
});

// AUTHENTICATION ROUTES
describe('POST /login', () => {
  test("should log valid users in", async () => {
    const res = await request(app).post("/login").send({
      username : "testUser1",
      password : "pw1"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ token : expect.any(String) });
    
    const { username, isAdmin } = jwt.verify(res.body.token, SECRET);
    expect(username).toBe('testUser1');
    expect(isAdmin).toBe(false);
  });

  test('should return 401 error if cannot authenticate', async () => {
    const res = await request(app).post("/login").send({
      username : "I dont exist lmao",
      password : "this is the worst pw ever"
    });
    expect(res.statusCode).toBe(401);
  });
});

// REGISTRATION ROUTES
describe("POST /register", () => {
  test('should raise 422 if all the required fields are not present.', async () => {
    const res = await request(app).post('/register').send({
      _token : tokens.testUser3,
      email : "testEmail55@gmail.com",
      username : "testUser1",
      password : "ososecret"
    });
    expect(res.statusCode).toBe(422);    
  });
  test('It should return a token upon successful registration', async () => {
    const res = await request(app).post("/register").send({
      _token : tokens.testUser3,
      email : "testEmail99@gmail.com",
      username : "testing",
      password : "testing",
      firstName : "Jae",
      lastName : "Cho",
      deptCode : "F_STACK",
      isAdmin : false
    });
    expect(res.statusCode).toBe(200);
    const { username, isAdmin } = jwt.verify(res.body.token, SECRET);
    expect(username).toBe('testing');
    expect(isAdmin).toBe(false);
  });
  test('It should raise 401 if non-admin tries to register', async () => {
    const res = await request(app).post('/register').send({
      _token : tokens.testUser1,
      username : 'something',
      password : 'something'
    });
    expect(res.statusCode).toBe(401);
  })
});

afterEach(async function () {
  await db.query(`DELETE FROM users`);
});

afterAll(function() {
  db.end();
});
