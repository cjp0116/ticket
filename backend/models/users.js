const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const ExpressError = require('../ExpressError');
const bcrypt = require("bcrypt");
const BCRYPT_WORKFACTOR = 10;

class User {

  static async authenticate(data) {
    const res = await db.query(
      `SELECT * FROM users WHERE username = $1`, [data.username]
    );
    if(!res.rowCount) {
      throw new ExpressError('Cannot authenticate', 401)
    };
    const user = res.rows[0];
    if( (await bcrypt.compare(data.password, user.password)) ) {
      return user;
    } else {
      throw new ExpressError('Cannot authenticate', 401)
    };
  };

  // Only admins can register.
  static async register(data) {
    const dupCheck = await db.query(
      `SELECT * FROM users 
      WHERE username = $1 OR email = $2`, 
      [data.username, data.email]
    );
    if(dupCheck.rowCount) {
      throw new ExpressError(`Username ${data.username} or email ${data.email} already exists`, 409);
    }
    if(data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORKFACTOR);
    }
    const res = await db.query(
      `INSERT INTO users (email, username, password, firstName, lastName, deptCode, isAdmin)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [data.email, data.username, data.password, data.firstName, data.lastName, data.deptCode, data.isAdmin]
    );
    return res.rows[0];
  };

  static async findOne(username) {
    const res = await db.query(
      `SELECT * FROM users WHERE username = $1`, [username]
    );
    if(!res.rowCount) {
      throw new ExpressError(`Username ${username} does not exist`, 404);
    };
    const user = res.rows[0];
    delete user.password; 
    return user;
  };

  static async findAll() {
    const res = await db.query(
      `SELECT * FROM users`
    );
    const users = res.rows;
    // remove id, password, isAdmin before returning
    for(const user of users) {
      delete user.id;
      delete user.password;
      delete user.isAdmin;
    };
    return users;
  };

  static async remove(username) {
    const checkIfExists = await db.query(
      `SELECT * FROM users WHERE username = $1`, [username]
    );
    if(!checkIfExists.rowCount) {
      throw new ExpressError(`username ${username} does not exist`, 404);
    };
    const res = await db.query(
      `DELETE FROM users WHERE username = $1`, [username]
    );
  };

  static async update(username, data) {
    const checkIfExists = await db.query(`SELECT * FROM users WHERE username = $1`, [username])
    if(!checkIfExists.rowCount) {
      throw new ExpressError(`Username ${username} does not exist`, 404);
    };
    const { query, values } = sqlForPartialUpdate('users', data, 'username', username)
    const updatedUser = await db.query(query, values);
    return updatedUser.rows[0]
  };

};

module.exports = User;