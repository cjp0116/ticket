process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest');
const db = require("../db");
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");

let user;
const tokens = {};

function createToken(username, admin=false) {
  let payload = { username, admin };
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

describe('POST /login', () => {
  test("should log valid users in", async () => {
    const res = await request(app).post("/login").send({
      username : "testUser1",
      password : "pw1"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ token : expect.any(String) });
    
    const { username, admin } = jwt.verify(res.body.token, SECRET);
    expect(username).toBe('testUser1');
    expect(admin).toBe(false);
  });

  test('should return 401 error if cannot authenticate', async () => {
    const res = await (await request(app).post("/login")).send({
      username : "I dont exist lmao",
      password : "this is the worst pw ever"
    });
    expect(res.statusCode).toBe(401);
  });
});

afterEach(async function () {
  await db.query(`DELETE FROM users`);
});

afterAll(function() {
  db.end();
});
