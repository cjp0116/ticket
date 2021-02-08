const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const ExpressError = require('../ExpressError');
const bcrypt = require("bcrypt");
const BCRYPT_WORKFACTOR = 10;

class User {
  // Only admins can register.
  static async reigster(data) {
    const dupCheck = await db.query(`SELCT * FROM users WHERE username = $1`, [data.username]);
    if(dupCheck.rowCount) {
      throw new ExpressError(`Username ${data.username} already exists`, 409);
    }
    if(data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORKFACTOR);
    }
    const res = await db.query(
      `INSERT INTO users (email, username, password, firstName, lastName, deptCode)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [data.email, data.username, data.password, data.firstName, data.lastName, data.deptCode]
    );
    const user = res.rows[0];
    delete user.id;
    delete user.password;
    return user;
  };

  static async findOne(username) {
    const res = await db.query(
      `SELECT * FROM users WHERE username = $1`, [username]
    );
    if(!res.rowCount) {
      throw new ExpressError(`Username ${username} does not exist`, 404);
    };
    const user = res.rows[0];
    delete user.id;
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