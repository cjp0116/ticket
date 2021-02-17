process.env.NODE_ENV = "test";

const db = require("../db");
const app = require("../app");
const bcrypt = require("bcrypt");
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { SECRET } = require("../config");

function createToken(username, isAdmin=false) {
  const payload = { username, isAdmin };
  return jwt.sign(payload, SECRET);
};

const tokens = {};
beforeEach(async () => {
  async function _pwd(password) {
    return await bcrypt.hash(password, 1)
  };
  let sampleUsers = [
    ['test1@gmail.com', 'testUser1', await _pwd('pw1'), 'Jae', 'Cho', 'B_END', false],
    ['test2@gmail.com', 'testUser2', await _pwd('pw2'), 'Carol', 'Yoo', 'B_END', false],
    ['admin@admin.com', 'admin', await _pwd('pw3'), 'Courtney', 'Kim', 'F_STACK', true] 
  ];
  for(const user of sampleUsers) {
    await db.query(`
      INSERT INTO users (email, username, password, firstName, lastName, deptCode, isAdmin)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`, user
    );
    tokens[user[1]] = createToken(user[1], user[6])
  };

});

describe("GET /users", () => {
  test("It should return a array of users", async () => {
    await db.query(`insert into users (email, username, password, firstName, lastName, deptCode, isAdmin) 
    VALUES ('t1@testing.com', 'testttt', 'something', 'jae', 'cho', 'B_END', 'false')`)
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.users.length).toBe(4);
    expect(res.body.users[0].username).toBe("testUser1");
  });
});

describe("GET /users/:username", () => {
  test('It should return info about user, if username is valid', async () => {
    const res = await request(app).get(`/users/testUser1`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('test1@gmail.com');
  });
  test('Raises 404 if username is not found', async () => {
    const res = await request(app).get(`/users/iDontExistLMAO`);
    expect(res.statusCode).toBe(404)
  });
});

describe("DELETE /users/:username", () => {
  test('It should remove a valid user', async () => {
    const res = await request(app).delete('/users/testUser1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('deleted');
    
    const numUsers = await db.query(`select * from users`);
    const userLen = numUsers.rowCount;
    expect(userLen).toBe(2);
  });
  test('It should raise 404 status code if useranem not exists', async () => {
    const res = await request(app).delete(`/users/iDontExistLMAO`);
    expect(res.statusCode).toBe(404);
  });
});

describe('PATCH /users/:username', () => {
  test('It should update a valid user', async () => {
    const res = await request(app).patch(`/users/testUser1`).send({
      username : "updated"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe('updated');
  });
  test('It should raise 404 if username not valid', async () => {
    const res = await request(app).patch('/users/IDontExist').send({
      username : "something"
    });
    expect(res.statusCode).toBe(404);
  });
})

afterEach(async () => {
  await db.query(`DELETE FROM users`);
});

afterAll(() => {
  db.end();
})