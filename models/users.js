const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const ExpressError = require('../ExpressError');
const bcrypt = require("bcrypt");
const BCRYPT_WORKFACTOR = 10;

class User {
  static async register(data) {
    const dupCheck = await db.query('SELECT username from users where username = $1', [data.username]);
    if(dupCheck.rowCount) {
      throw new ExpressError('Username already exists', 400)
    };
    const hashedPW = bcrypt.hash(data.password, BCRYPT_WORKFACTOR);
    const res = await db.query(
      "insert into users (username, email, password, firstName, lastName, deptCode) values ($1, $2, $3, $4, $5, $6) returning username, password, firstName, lastName, deptCode", [data.username, hashedPW, data.firstName, data.lastName, data.deptCode]
    );
    return res.rows[0];
  };

  static async authenticate(data) {
    const res = await db.query('select username, password, email, firstName, lastName, deptCode from users where username = $1', [data.username])
    const user = res.rows[0];
    if(user) {
      if(await bcrypt.compare(data.password, user.password)) {
        return user;
      }
    }
    throw new ExpressError('Invalid credentials', 401)
  };

  static async findAll() {
    const res = await db.query('select username, email, firstName, lastName, deptCode from users');
    return res.rows;
  };

  static async findOne(username) {
    const res = await db.query('select username, email, firstName, lastName, deptCode from users where username = $1', [username])
    const user = res.rows[0];
    if(!user) {
      throw new ExpressError('User does not exist', 404);
    }
    return user;
  };

  static async update(username, data) {
    if(data.password) {
      data.password = await bcrypt.hash(data.passwor,BCRYPT_WORKFACTOR);
    }
    const { query, values} = sqlForPartialUpdate("users", data, "username", username);
    const res = await db.query(query, values);
    const user = res.rows[0];
    if(!user) {
      throw new ExpressError("User does not exist", 404);
    }
    delete user.password;
    return user;
  }
  
  static async remove(username) {
    const res = await db.query('delete from users where username = $1 returning username', [username])
    if(!res.rowCount) {
      throw new ExpressError('username does not exist', 404)
    };
  }
}
module.exports = User;